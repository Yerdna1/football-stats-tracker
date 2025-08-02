import axios, { AxiosInstance } from 'axios';
import { ApiFootballResponse } from './client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io';

class DirectApiFootballClient {
  private client: AxiosInstance;
  private apiKey: string | null = null;

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

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add API key to headers
        if (this.apiKey) {
          config.headers['x-apisports-key'] = this.apiKey;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          
          const rateLimitError = new Error(
            `API rate limit exceeded. Please wait ${Math.ceil(delay / 1000)} seconds before trying again.`
          );
          (rateLimitError as Error & { isRateLimit?: boolean; retryAfter?: number }).isRateLimit = true;
          (rateLimitError as Error & { isRateLimit?: boolean; retryAfter?: number }).retryAfter = delay;
          
          return Promise.reject(rateLimitError);
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method for dynamic endpoints
  async request<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<ApiFootballResponse<T>> {
    // Map endpoint names to API paths
    const endpointMap: Record<string, string> = {
      'timezone': '/timezone',
      'countries': '/countries',
      'leagues': '/leagues',
      'teams': '/teams',
      'standings': '/standings',
      'fixtures': '/fixtures',
      'players': '/players',
      'topscorers': '/players/topscorers',
      'statistics': '/fixtures/statistics',
      'predictions': '/predictions',
      'odds': '/odds'
    };

    const apiPath = endpointMap[endpoint] || `/${endpoint}`;
    const response = await this.client.get(apiPath, { params });
    return response.data;
  }
}

// Create singleton instance for direct API calls
const directApiFootballClient = new DirectApiFootballClient();

export default directApiFootballClient;