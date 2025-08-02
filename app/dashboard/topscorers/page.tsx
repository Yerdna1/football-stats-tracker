'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import { Trophy, Target, Timer, Star } from 'lucide-react';

interface TopScorer {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string;
      country: string;
    };
    nationality: string;
    height: string;
    weight: string;
    injured: boolean;
    photo: string;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
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
      conceded: number;
      assists: number;
      saves: number;
    };
    shots: {
      total: number;
      on: number;
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

export default function TopScorersPage() {
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [season, setSeason] = useState('2023');

  const loadTopScorers = async () => {
    if (!leagueId) {
      setError('Please enter a League ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiFootballService.getTopScorers(
        parseInt(leagueId), 
        parseInt(season)
      );
      
      setTopScorers(response.response);
    } catch (err: any) {
      setError(err.message || 'Failed to load top scorers');
    } finally {
      setLoading(false);
    }
  };

  const loadPremierLeague = () => {
    setLeagueId('39');
    setSeason('2023');
  };

  const loadLaLiga = () => {
    setLeagueId('140');
    setSeason('2023');
  };

  const loadBundesliga = () => {
    setLeagueId('78');
    setSeason('2023');
  };

  const loadSerieA = () => {
    setLeagueId('135');
    setSeason('2023');
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  const calculateGoalsPerGame = (goals: number, games: number) => {
    if (games === 0) return '0.00';
    return (goals / games).toFixed(2);
  };

  const calculateShotAccuracy = (shotsOn: number, shotsTotal: number) => {
    if (shotsTotal === 0) return '0%';
    return `${((shotsOn / shotsTotal) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Top Scorers
            </h1>
            <p className="text-muted-foreground text-lg">
              View the leading goalscorers by league and season
            </p>
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">League Selection</CardTitle>
              <CardDescription className="text-base">
                Select a league and season to view top scorers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">League ID</label>
                <Input
                  placeholder="e.g., 39 for Premier League"
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                  className="h-11 border-2 focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Season</label>
                <Input
                  placeholder="e.g., 2023"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="h-11 border-2 focus:border-primary transition-colors"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={loadTopScorers} 
                  disabled={loading}
                  size="lg"
                  className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Loading...
                    </div>
                  ) : (
                    'Load Top Scorers'
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Quick League Selection:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="h-12 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:scale-105" 
                  onClick={loadPremierLeague}
                >
                  <div className="text-center">
                    <div className="font-semibold">Premier League</div>
                    <div className="text-xs text-muted-foreground">England</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:scale-105" 
                  onClick={loadLaLiga}
                >
                  <div className="text-center">
                    <div className="font-semibold">La Liga</div>
                    <div className="text-xs text-muted-foreground">Spain</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:scale-105" 
                  onClick={loadBundesliga}
                >
                  <div className="text-center">
                    <div className="font-semibold">Bundesliga</div>
                    <div className="text-xs text-muted-foreground">Germany</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:scale-105" 
                  onClick={loadSerieA}
                >
                  <div className="text-center">
                    <div className="font-semibold">Serie A</div>
                    <div className="text-xs text-muted-foreground">Italy</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Unable to load top scorers</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="space-y-4 text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-primary/20"></div>
                <div className="absolute top-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Loading top scorers...</h3>
                <p className="text-sm text-muted-foreground">Fetching the latest goalscoring statistics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Scorers List */}
      {!loading && topScorers.length > 0 && (
        <div className="space-y-4">
          {topScorers.map((scorer, index) => {
            const stats = scorer.statistics[0]; // Take first/main stats
            const goals = stats?.goals?.total || 0;
            const games = stats?.games?.appearences || 0;
            const assists = stats?.goals?.assists || 0;
            const shots = stats?.shots?.total || 0;
            const shotsOn = stats?.shots?.on || 0;
            const penalties = stats?.penalty?.scored || 0;

            return (
              <Card key={`${scorer.player.id}-${index}`} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      {getRankIcon(index)}
                    </div>

                    {/* Player Photo */}
                    {scorer.player.photo && (
                      <img
                        src={scorer.player.photo}
                        alt={scorer.player.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{scorer.player.name}</h3>
                        {stats?.team?.logo && (
                          <img 
                            src={stats.team.logo} 
                            alt={stats.team.name}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <span className="text-sm text-muted-foreground">{stats?.team?.name}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{scorer.player.nationality}</span>
                        {scorer.player.age && <span>Age: {scorer.player.age}</span>}
                        {stats?.games?.position && <span>Position: {stats.games.position}</span>}
                      </div>
                    </div>

                    {/* Goals Display */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{goals}</div>
                      <div className="text-sm text-muted-foreground">Goals</div>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Assists</span>
                      </div>
                      <div className="text-lg font-bold">{assists}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Timer className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Games</span>
                      </div>
                      <div className="text-lg font-bold">{games}</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">G/Game</span>
                      </div>
                      <div className="text-lg font-bold">{calculateGoalsPerGame(goals, games)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Shots</div>
                      <div className="text-lg font-bold">{shots}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Shot Acc.</div>
                      <div className="text-lg font-bold">{calculateShotAccuracy(shotsOn, shots)}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Penalties</div>
                      <div className="text-lg font-bold">{penalties}</div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {stats?.games?.rating && (
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Rating:</span>
                      <span className="font-medium">{parseFloat(stats.games.rating).toFixed(1)}</span>
                    </div>
                  )}

                  {scorer.player.injured && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Currently Injured
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {!loading && topScorers.length === 0 && leagueId && (
        <Card className="border-0 bg-gradient-to-br from-muted/20 to-transparent">
          <CardContent className="text-center py-16">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No results found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  No top scorers were found for League ID "{leagueId}" in the {season} season. 
                  Try a different league or season.
                </p>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={loadPremierLeague}>
                  Try Premier League
                </Button>
                <Button variant="outline" size="sm" onClick={loadLaLiga}>
                  Try La Liga
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!loading && topScorers.length === 0 && !leagueId && (
        <Card className="border-0 bg-gradient-to-br from-muted/20 to-transparent">
          <CardContent className="text-center py-16">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Ready to explore top scorers?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select a league above to discover the leading goalscorers and their impressive statistics.
                </p>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={loadPremierLeague}>
                  Try Premier League
                </Button>
                <Button variant="outline" size="sm" onClick={loadLaLiga}>
                  Try La Liga
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}