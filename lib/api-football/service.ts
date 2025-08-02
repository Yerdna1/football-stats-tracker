import { ApiFootballResponse } from './client';

class ApiFootballService {
  private baseUrl = '/api/football';

  private async fetchApi<T>(endpoint: string, params?: Record<string, any>): Promise<ApiFootballResponse<T>> {
    const searchParams = new URLSearchParams({
      endpoint,
      ...params,
    });

    const response = await fetch(`${this.baseUrl}?${searchParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  async getTimezone() {
    return this.fetchApi<string[]>('timezone');
  }

  async getCountries() {
    return this.fetchApi<any[]>('countries');
  }

  async getLeagues(params?: {
    id?: number;
    name?: string;
    country?: string;
    season?: number;
  }) {
    return this.fetchApi<any[]>('leagues', params);
  }

  async getTeams(params?: {
    id?: number;
    name?: string;
    league?: number;
    season?: number;
  }) {
    return this.fetchApi<any[]>('teams', params);
  }

  async getStandings(league: number, season: number) {
    return this.fetchApi<any[]>('standings', { league, season });
  }

  async getFixtures(params?: {
    date?: string;
    league?: number;
    season?: number;
    team?: number;
    live?: string;
  }) {
    return this.fetchApi<any[]>('fixtures', params);
  }

  async getPlayers(params?: {
    team?: number;
    league?: number;
    season?: number;
    search?: string;
  }) {
    return this.fetchApi<any[]>('players', params);
  }

  async getTopScorers(league: number, season: number) {
    return this.fetchApi<any[]>('topscorers', { league, season });
  }

  async getStatistics(fixture: number) {
    return this.fetchApi<any[]>('statistics', { fixture });
  }

  async getPredictions(fixture: number) {
    return this.fetchApi<any>('predictions', { fixture });
  }

  async getOdds(params?: {
    fixture?: number;
    league?: number;
    season?: number;
  }) {
    return this.fetchApi<any[]>('odds', params);
  }
}

export const apiFootballService = new ApiFootballService();