import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { recordApiCall, getCachedResponse, cacheApiResponse } from '@/lib/firebase/firestore';
import { auth } from '@/lib/firebase/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io';

export interface ApiFootballResponse<T = any> {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

class ApiFootballClient {
  private client: AxiosInstance;
  private apiKey: string | null = null;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // 1 second between requests

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          // Rate limiting: ensure minimum interval between requests
          const now = Date.now();
          const timeSinceLastRequest = now - this.lastRequestTime;
          if (timeSinceLastRequest < this.minRequestInterval) {
            await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
          }
          
          this.lastRequestTime = Date.now();
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private async retryWithBackoff<T>(
    requestFn: () => Promise<T>, 
    maxRetries = 3, 
    baseDelay = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error: any) {
        if (error.response?.status === 429 && attempt < maxRetries) {
          // Rate limited - wait with exponential backoff
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const startTime = Date.now();
        (config as any).metadata = { startTime };

        // Add API key to headers
        if (this.apiKey) {
          config.headers['x-apisports-key'] = this.apiKey;
        }

        // Check cache if user is authenticated
        const user = auth.currentUser;
        if (user && config.method === 'get') {
          const cacheKey = this.getCacheKey(config);
          const cached = await getCachedResponse(user.uid, cacheKey);
          
          if (cached) {
            // Return cached response by throwing a special error
            throw {
              isCached: true,
              data: cached.response,
              config,
            };
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      async (response) => {
        const endTime = Date.now();
        const startTime = (response.config as any).metadata?.startTime || endTime;
        const responseTime = endTime - startTime;

        // Track API call if user is authenticated
        const user = auth.currentUser;
        if (user) {
          const endpoint = this.getEndpointName(response.config);
          const responseSize = JSON.stringify(response.data).length;

          await recordApiCall({
            userId: user.uid,
            endpoint,
            timestamp: new Date(),
            responseTime,
            status: response.status,
            responseSize,
          });

          // Cache successful GET responses with different durations based on endpoint
          if (response.config.method === 'get' && response.status === 200) {
            const cacheKey = this.getCacheKey(response.config);
            const expiresAt = new Date();
            
            // Different cache durations for different endpoints
            const url = response.config.url || '';
            if (url.includes('/countries') || url.includes('/leagues')) {
              // Countries and leagues change rarely - cache for 1 hour
              expiresAt.setHours(expiresAt.getHours() + 1);
            } else if (url.includes('/teams') || url.includes('/standings')) {
              // Teams and standings - cache for 30 minutes
              expiresAt.setMinutes(expiresAt.getMinutes() + 30);
            } else if (url.includes('/fixtures') || url.includes('/odds')) {
              // Fixtures and odds change frequently - cache for 5 minutes
              expiresAt.setMinutes(expiresAt.getMinutes() + 5);
            } else {
              // Default cache duration - 15 minutes
              expiresAt.setMinutes(expiresAt.getMinutes() + 15);
            }

            await cacheApiResponse({
              userId: user.uid,
              endpoint: cacheKey,
              timestamp: new Date(),
              response: response.data,
              expiresAt,
            });
          }
        }

        return response;
      },
      async (error) => {
        // Handle cached response
        if (error.isCached) {
          return {
            data: error.data,
            status: 200,
            statusText: 'OK (Cached)',
            headers: {},
            config: error.config,
          };
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000; // Default 5 seconds
          
          console.warn(`Rate limited, waiting ${delay}ms before retrying`);
          
          // Create a more user-friendly error for 429 responses
          const rateLimitError = new Error(
            `API rate limit exceeded. Too many requests. Please wait ${Math.ceil(delay / 1000)} seconds before trying again.`
          );
          (rateLimitError as any).isRateLimit = true;
          (rateLimitError as any).retryAfter = delay;
          
          // Track the rate limit error
          const user = auth.currentUser;
          if (user) {
            const endpoint = this.getEndpointName(error.config);
            const responseTime = Date.now() - ((error.config as any).metadata?.startTime || Date.now());

            await recordApiCall({
              userId: user.uid,
              endpoint,
              timestamp: new Date(),
              responseTime,
              status: 429,
              responseSize: 0,
              error: 'Rate limit exceeded',
            });
          }
          
          return Promise.reject(rateLimitError);
        }

        // Track failed API calls
        const user = auth.currentUser;
        if (user && error.response) {
          const endpoint = this.getEndpointName(error.config);
          const responseTime = Date.now() - ((error.config as any).metadata?.startTime || Date.now());

          await recordApiCall({
            userId: user.uid,
            endpoint,
            timestamp: new Date(),
            responseTime,
            status: error.response.status,
            responseSize: 0,
            error: error.message,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private getEndpointName(config: AxiosRequestConfig): string {
    const url = config.url || '';
    const method = config.method?.toUpperCase() || 'GET';
    return `${method} ${url}`;
  }

  private getCacheKey(config: AxiosRequestConfig): string {
    const url = config.url || '';
    const params = config.params ? JSON.stringify(config.params) : '';
    return `${url}${params}`;
  }

  // API Methods
  async getTimezone(): Promise<ApiFootballResponse<string[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/timezone');
        return response.data;
      })
    );
  }

  async getCountries(): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/countries');
        return response.data;
      })
    );
  }

  async getLeagues(params?: {
    id?: number;
    name?: string;
    country?: string;
    code?: string;
    season?: number;
    team?: number;
    type?: string;
    current?: boolean;
    search?: string;
    last?: number;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/leagues', { params });
        return response.data;
      })
    );
  }

  async getTeams(params?: {
    id?: number;
    name?: string;
    league?: number;
    season?: number;
    country?: string;
    code?: string;
    venue?: number;
    search?: string;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/teams', { params });
        return response.data;
      })
    );
  }

  async getStandings(params: {
    league: number;
    season: number;
    team?: number;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/standings', { params });
        return response.data;
      })
    );
  }

  async getFixtures(params?: {
    id?: number;
    ids?: string;
    live?: string;
    date?: string;
    league?: number;
    season?: number;
    team?: number;
    last?: number;
    next?: number;
    from?: string;
    to?: string;
    round?: string;
    status?: string;
    venue?: number;
    timezone?: string;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/fixtures', { params });
        return response.data;
      })
    );
  }

  async getPlayers(params?: {
    id?: number;
    team?: number;
    league?: number;
    season?: number;
    search?: string;
    page?: number;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/players', { params });
        return response.data;
      })
    );
  }

  async getTopScorers(params: {
    league: number;
    season: number;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/players/topscorers', { params });
        return response.data;
      })
    );
  }

  async getStatistics(params: {
    fixture: number;
    team?: number;
    type?: string;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/fixtures/statistics', { params });
        return response.data;
      })
    );
  }

  async getPredictions(params: {
    fixture: number;
  }): Promise<ApiFootballResponse<any>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/predictions', { params });
        return response.data;
      })
    );
  }

  async getOdds(params?: {
    fixture?: number;
    league?: number;
    season?: number;
    date?: string;
    timezone?: string;
    page?: number;
    bookmaker?: number;
    bet?: number;
  }): Promise<ApiFootballResponse<any[]>> {
    return this.queueRequest(() => 
      this.retryWithBackoff(async () => {
        const response = await this.client.get('/odds', { params });
        return response.data;
      })
    );
  }
}

// Create singleton instance
const apiFootballClient = new ApiFootballClient();

// Server-side API route handler
export async function getApiClient() {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error('API_FOOTBALL_KEY is not configured');
  }
  
  apiFootballClient.setApiKey(apiKey);
  return apiFootballClient;
}

export default apiFootballClient;