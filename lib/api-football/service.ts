import { ApiFootballResponse, Country, League, Team, Standing, Fixture, Player, Statistic, Prediction, Odds } from './client';
import directApiFootballClient from './client-direct';

class ApiFootballService {
  private baseUrl = '/api/football';
  private isStaticBuild = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_STATIC_BUILD === 'true';

  private async fetchApi<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiFootballResponse<T>> {
    const requestId = `${endpoint}-${Date.now()}`;
    const startTime = Date.now();
    
    try {
      // For static builds, use direct API client
      if (this.isStaticBuild) {
        console.log(`[${requestId}] Service: Using direct API client for static build`);
        
        // Set API key for direct client
        const apiKey = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY;
        if (apiKey) {
          directApiFootballClient.setApiKey(apiKey);
        }
        
        return await directApiFootballClient.request<T>(endpoint, params);
      }

      // For development/server builds, use API route
      const searchParams = new URLSearchParams({
        endpoint,
        ...params,
      });

      const url = `${this.baseUrl}?${searchParams}`;
      console.log(`[${requestId}] Service: Starting fetch to ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const duration = Date.now() - startTime;
      console.log(`[${requestId}] Service: Fetch completed in ${duration}ms, status: ${response.status}`);
      
      // Get response text first to check if it's valid JSON
      const responseText = await response.text();
      
      console.log(`[${requestId}] Service: Response length: ${responseText.length} chars`);
      
      // Enhanced HTML detection
      const isHtml = responseText.trim().startsWith('<!DOCTYPE') || 
                    responseText.trim().startsWith('<html') ||
                    responseText.includes('<title>') ||
                    responseText.includes('<body>');
      
      if (isHtml) {
        console.error(`[${requestId}] Service: Received HTML response instead of JSON:`, {
          statusCode: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          preview: responseText.substring(0, 300),
          url
        });
        
        // Try to extract error message from HTML
        const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
        const errorTitle = titleMatch ? titleMatch[1] : 'Unknown error';
        
        throw new Error(`Server returned HTML page: ${errorTitle}. Check if the API route is properly configured.`);
      }
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log(`[${requestId}] Service: Successfully parsed JSON response`);
      } catch (parseError) {
        console.error(`[${requestId}] Service: JSON parse error:`, {
          error: parseError instanceof Error ? parseError.message : parseError,
          responsePreview: responseText.substring(0, 300),
          responseLength: responseText.length,
          statusCode: response.status,
          url
        });
        
        throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Parse failed'}`);
      }
      
      // Check for HTTP errors
      if (!response.ok) {
        console.error(`[${requestId}] Service: HTTP error:`, {
          status: response.status,
          statusText: response.statusText,
          data,
          url
        });
        
        const errorMessage = data?.error || data?.message || data?.details || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Check for API-specific errors in the response
      if (data && typeof data === 'object' && 'error' in data && data.error) {
        console.error(`[${requestId}] Service: API returned error:`, data.error);
        throw new Error(typeof data.error === 'string' ? data.error : 'API returned an error');
      }

      console.log(`[${requestId}] Service: Request successful, returning data`);
      return data;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] Service: Request failed after ${duration}ms:`, {
        endpoint,
        params,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        url: `${this.baseUrl}?${new URLSearchParams({ endpoint, ...params })}`
      });
      
      // Re-throw with enhanced context
      if (error instanceof Error) {
        error.message = `[${endpoint}] ${error.message}`;
      }
      
      throw error;
    }
  }

  async getTimezone() {
    return this.fetchApi<string[]>('timezone');
  }

  async getCountries() {
    return this.fetchApi<Country[]>('countries');
  }

  async getLeagues(params?: {
    id?: number;
    name?: string;
    country?: string;
    season?: number;
  }) {
    return this.fetchApi<League[]>('leagues', params);
  }

  async getTeams(params?: {
    id?: number;
    name?: string;
    league?: number;
    season?: number;
  }) {
    return this.fetchApi<Team[]>('teams', params);
  }

  async getStandings(league: number, season: number) {
    return this.fetchApi<Standing[][]>('standings', { league, season });
  }

  async getFixtures(params?: {
    date?: string;
    league?: number;
    season?: number;
    team?: number;
    live?: string;
  }) {
    return this.fetchApi<Fixture[]>('fixtures', params);
  }

  async getPlayers(params?: {
    team?: number;
    league?: number;
    season?: number;
    search?: string;
  }) {
    return this.fetchApi<Player[]>('players', params);
  }

  async getTopScorers(league: number, season: number) {
    return this.fetchApi<Player[]>('topscorers', { league, season });
  }

  async getStatistics(fixture: number) {
    return this.fetchApi<Statistic[]>('statistics', { fixture });
  }

  async getPredictions(fixture: number) {
    return this.fetchApi<Prediction[]>('predictions', { fixture });
  }

  async getOdds(params?: {
    fixture?: number;
    league?: number;
    season?: number;
  }) {
    return this.fetchApi<Odds[]>('odds', params);
  }
}

export const apiFootballService = new ApiFootballService();