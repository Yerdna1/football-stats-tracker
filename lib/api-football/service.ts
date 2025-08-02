import { ApiFootballResponse, Country, League, Team, Standing, Fixture, Player, Statistic, Prediction, Odds } from './client';

class ApiFootballService {
  private baseUrl = '/api/football';

  private async fetchApi<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiFootballResponse<T>> {
    try {
      const searchParams = new URLSearchParams({
        endpoint,
        ...params,
      });

      console.log(`Fetching: ${this.baseUrl}?${searchParams}`);
      
      const response = await fetch(`${this.baseUrl}?${searchParams}`);
      
      // Get response text first to check if it's valid JSON
      const responseText = await response.text();
      
      // Check if response is HTML (error page)
      if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
        console.error('Received HTML response instead of JSON:', responseText.substring(0, 200));
        throw new Error('API returned HTML instead of JSON. This usually indicates a configuration or routing error.');
      }
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', responseText.substring(0, 200));
        throw new Error('Invalid JSON response from API');
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `API request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Service Error:', error);
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