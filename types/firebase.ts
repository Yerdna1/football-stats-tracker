export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  plan: 'free' | 'basic' | 'pro';
}

export interface ApiCall {
  id?: string;
  userId: string;
  endpoint: string;
  timestamp: Date;
  responseTime: number;
  status: number;
  responseSize: number;
  error?: string;
}

export interface ApiResponse {
  id?: string;
  userId: string;
  endpoint: string;
  timestamp: Date;
  response: any;
  expiresAt: Date;
}

export interface UsageStats {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  totalCalls: number;
  byEndpoint: Record<string, number>;
  errors: number;
  avgResponseTime: number;
  totalResponseSize: number;
}