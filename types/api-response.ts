// API Response types that match the actual Football API response structure
// These wrap the basic data types from the API client

import {
  Country as BaseCountry,
  League as BaseLeague,
  Team as BaseTeam,
  Fixture as BaseFixture,
  Player as BasePlayer,
  Standing as BaseStanding,
  Prediction as BasePrediction,
  Odds as BaseOdds
} from '@/lib/api-football/client';

// Response wrappers that match actual API structure
export interface FixtureResponse {
  fixture: BaseFixture;
  league: BaseLeague & {
    round: string;
    flag: string;
    season: number;
  };
  teams: {
    home: BaseTeam & { winner: boolean | null };
    away: BaseTeam & { winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface LeagueResponse {
  league: BaseLeague;
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: Array<{
    year: number;
    start: string;
    end: string;
    current: boolean;
  }>;
}

export interface TeamResponse {
  team: BaseTeam;
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

export interface PlayerResponse {
  player: BasePlayer;
  statistics: Array<{
    team: BaseTeam;
    league: BaseLeague & {
      flag: string;
      season: number;
    };
    games: {
      appearences: number;
      lineups: number;
      minutes: number;
      number: number;
      position: string;
      rating: string;
      captain: boolean;
    };
    substitutes: {
      in: number;
      out: number;
      bench: number;
    };
    shots: {
      total: number;
      on: number;
    };
    goals: {
      total: number;
      conceded: number;
      assists: number;
      saves: number;
    };
    passes: {
      total: number;
      key: number;
      accuracy: number;
    };
    tackles: {
      total: number;
      blocks: number;
      interceptions: number;
    };
    duels: {
      total: number;
      won: number;
    };
    dribbles: {
      attempts: number;
      success: number;
      past: number;
    };
    fouls: {
      drawn: number;
      committed: number;
    };
    cards: {
      yellow: number;
      yellowred: number;
      red: number;
    };
    penalty: {
      won: number;
      commited: number;
      scored: number;
      missed: number;
      saved: number;
    };
  }>;
}

export interface TopScorerResponse {
  player: BasePlayer;
  statistics: Array<{
    team: BaseTeam;
    league: BaseLeague & {
      flag: string;
      season: number;
    };
    games: {
      appearences: number;
      lineups: number;
      minutes: number;
      number: number;
      position: string;
      rating: string;
      captain: boolean;
    };
    goals: {
      total: number;
      assists: number;
    };
    cards: {
      yellow: number;
      red: number;
    };
  }>;
}

export interface StandingResponse {
  league: BaseLeague & {
    flag: string;
    season: number;
  };
  standings: BaseStanding[][];
}

export interface PredictionResponse {
  league: BaseLeague & {
    flag: string;
    season: number;
  };
  teams: {
    home: BaseTeam;
    away: BaseTeam;
  };
  comparison: {
    form: {
      home: string;
      away: string;
    };
    att: {
      home: string;
      away: string;
    };
    def: {
      home: string;
      away: string;
    };
    poisson_distribution: {
      home: string;
      away: string;
    };
    h2h: {
      home: string;
      away: string;
    };
    goals: {
      home: string;
      away: string;
    };
    total: {
      home: string;
      away: string;
    };
  };
  predictions: {
    winner: {
      id: number;
      name: string;
      comment: string;
    };
    win_or_draw: boolean;
    under_over: string;
    goals: {
      home: string;
      away: string;
    };
    advice: string;
    percent: {
      home: string;
      draw: string;
      away: string;
    };
  };
}

export interface OddsResponse {
  league: BaseLeague & {
    flag: string;
    season: number;
  };
  fixture: BaseFixture;
  bookmakers: Array<{
    id: number;
    name: string;
    bets: Array<{
      id: number;
      name: string;
      values: Array<{
        value: string;
        odd: string;
      }>;
    }>;
  }>;
}

// Additional types for dashboard specific needs
export interface ApiCall {
  id?: string;
  endpoint: string;
  timestamp: Date;
  status: number;
  responseTime: number;
  responseSize?: number;
  error?: string;
}

export interface UsageStats {
  totalCalls: number;
  avgResponseTime: number;
  errorRate: number;
  mostUsedEndpoint: string;
  byEndpoint?: Record<string, number>;
  errors?: number;
}