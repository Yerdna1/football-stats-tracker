import { ApiFootballResponse, Country, League, Team, Standing, Fixture, Player, Statistic, Prediction, Odds } from './client';

class ApiFootballService {
  private baseUrl = '/api/football';

  private async fetchApi<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiFootballResponse<T>> {
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