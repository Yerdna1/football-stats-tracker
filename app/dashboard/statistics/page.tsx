'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import { BarChart, PieChart, Activity, Target } from 'lucide-react';

interface MatchStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: Array<{
    type: string;
    value: number | string;
  }>;
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<MatchStatistics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fixtureId, setFixtureId] = useState('');

  const loadStatistics = async () => {
    if (!fixtureId) {
      setError('Please enter a Fixture ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiFootballService.getStatistics(parseInt(fixtureId));
      setStatistics(response.response);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('shot')) return <Target className="h-4 w-4" />;
    if (lowerType.includes('possession')) return <PieChart className="h-4 w-4" />;
    if (lowerType.includes('pass')) return <Activity className="h-4 w-4" />;
    return <BarChart className="h-4 w-4" />;
  };

  const formatStatValue = (value: number | string, type: string) => {
    if (typeof value === 'string') return value;
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('percentage') || lowerType.includes('%')) {
      return `${value}%`;
    }
    if (lowerType.includes('possession')) {
      return `${value}%`;
    }
    return value.toString();
  };

  const getStatColor = (value: number | string, type: string, isHome: boolean) => {
    if (typeof value === 'string') return 'text-foreground';
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('possession') || lowerType.includes('percentage')) {
      if (value > 60) return 'text-green-600';
      if (value > 40) return 'text-yellow-600';
      return 'text-red-600';
    }
    
    // For other stats, higher is generally better
    if (value > 10) return 'text-green-600';
    if (value > 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStatComparison = (homeStat: any, awayStat: any, type: string) => {
    const homeValue = homeStat?.value || 0;
    const awayValue = awayStat?.value || 0;
    
    let homePercentage = 50;
    let awayPercentage = 50;
    
    if (typeof homeValue === 'number' && typeof awayValue === 'number') {
      const total = homeValue + awayValue;
      if (total > 0) {
        homePercentage = (homeValue / total) * 100;
        awayPercentage = (awayValue / total) * 100;
      }
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={getStatColor(homeValue, type, true)}>
            {formatStatValue(homeValue, type)}
          </span>
          <span className="text-sm text-muted-foreground capitalize">{type}</span>
          <span className={getStatColor(awayValue, type, false)}>
            {formatStatValue(awayValue, type)}
          </span>
        </div>
        
        {typeof homeValue === 'number' && typeof awayValue === 'number' && (
          <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 transition-all duration-300"
              style={{ width: `${homePercentage}%` }}
            />
            <div 
              className="bg-red-500 transition-all duration-300"
              style={{ width: `${awayPercentage}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Match Statistics</h1>
        <p className="text-muted-foreground">
          View detailed statistics for specific matches
        </p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Load Match Statistics</CardTitle>
          <CardDescription>
            Enter a fixture ID to view detailed match statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Fixture ID</label>
              <Input
                placeholder="e.g., 868847"
                value={fixtureId}
                onChange={(e) => setFixtureId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can find fixture IDs in the Fixtures page
              </p>
            </div>
            <Button onClick={loadStatistics} disabled={loading}>
              {loading ? 'Loading...' : 'Load Statistics'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Statistics Display */}
      {!loading && statistics.length === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Match Statistics Comparison</CardTitle>
            <CardDescription>
              Detailed statistics comparison between both teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Team Headers */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                {statistics[0].team.logo && (
                  <img 
                    src={statistics[0].team.logo} 
                    alt={statistics[0].team.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span className="font-semibold">{statistics[0].team.name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-semibold">{statistics[1].team.name}</span>
                {statistics[1].team.logo && (
                  <img 
                    src={statistics[1].team.logo} 
                    alt={statistics[1].team.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>
            </div>

            {/* Statistics Comparison */}
            <div className="space-y-4">
              {statistics[0].statistics.map((homeStat, index) => {
                const awayStat = statistics[1].statistics.find(
                  stat => stat.type === homeStat.type
                );
                
                if (!awayStat) return null;

                return (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    {renderStatComparison(homeStat, awayStat, homeStat.type)}
                  </div>
                );
              })}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {statistics.map((teamStats, teamIndex) => (
                <Card key={teamIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {teamStats.team.logo && (
                        <img 
                          src={teamStats.team.logo} 
                          alt={teamStats.team.name}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      {teamStats.team.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {teamStats.statistics.slice(0, 8).map((stat, statIndex) => (
                        <div key={statIndex} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatIcon(stat.type)}
                            <span className="text-sm">{stat.type}</span>
                          </div>
                          <span className="font-medium">
                            {formatStatValue(stat.value, stat.type)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {!loading && statistics.length === 0 && fixtureId && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No statistics found for the specified fixture ID.</p>
        </div>
      )}

      {/* Initial State */}
      {!loading && statistics.length === 0 && !fixtureId && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter a fixture ID to view match statistics.</p>
        </div>
      )}
    </div>
  );
}