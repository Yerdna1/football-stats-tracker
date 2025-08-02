'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentApiCalls, getUsageStats } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';
import { ensureFirestoreConnection } from '@/lib/firebase/config';
import { Activity, BarChart3, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCallsToday: 0,
    avgResponseTime: 0,
    errorRate: 0,
    mostUsedEndpoint: '',
  });
  const [recentCalls, setRecentCalls] = useState<Array<{
    id: string;
    endpoint: string;
    timestamp: Date;
    status: number;
    responseTime: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      // Ensure Firestore connection before making calls
      const connected = await ensureFirestoreConnection();
      if (!connected) {
        console.error('Failed to connect to Firestore');
        setLoading(false);
        return;
      }

      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Load usage stats
      const usageStats = await getUsageStats(user.uid, today, today);
      if (usageStats.length > 0) {
        const todayStats = usageStats[0];
        const mostUsed = Object.entries(todayStats.byEndpoint || {})
          .sort(([, a], [, b]) => (b as number) - (a as number))[0];
        
        setStats({
          totalCallsToday: todayStats.totalCalls || 0,
          avgResponseTime: Math.round(todayStats.avgResponseTime || 0),
          errorRate: todayStats.totalCalls > 0 
            ? ((todayStats.errors || 0) / todayStats.totalCalls) * 100 
            : 0,
          mostUsedEndpoint: mostUsed ? mostUsed[0] : 'None',
        });
      }

      // Load recent API calls
      const recent = await getRecentApiCalls(user.uid, 10);
      setRecentCalls(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your Football API usage and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Calls Today
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCallsToday}</div>
            <p className="text-xs text-muted-foreground">
              API calls made today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average API response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Error Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Failed API calls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Used Endpoint
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats.mostUsedEndpoint}</div>
            <p className="text-xs text-muted-foreground">
              Most frequently called
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent API Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Calls</CardTitle>
          <CardDescription>
            Your last 10 API calls with response details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentCalls.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No API calls yet. Try exploring the endpoints from the sidebar!
            </p>
          ) : (
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{call.endpoint}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(call.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded",
                      call.status < 400
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    )}>
                      {call.status}
                    </span>
                    <span className="text-muted-foreground">
                      {call.responseTime}ms
                    </span>
                    <span className="text-muted-foreground">
                      {(call.responseSize / 1024).toFixed(1)}KB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}