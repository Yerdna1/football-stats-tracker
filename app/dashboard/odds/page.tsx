'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiFootballService } from '@/lib/api-football/service';
import { Percent, TrendingUp, Target, Star, DollarSign } from 'lucide-react';


interface Bet {
  id: number;
  name: string;
  values: Array<{
    value: string;
    odd: string;
  }>;
}

interface Odd {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  fixture: {
    id: number;
    timezone: string;
    date: string;
    timestamp: number;
  };
  update: string;
  bookmakers: Array<{
    id: number;
    name: string;
    bets: Bet[];
  }>;
}

export default function OddsPage() {
  const [odds, setOdds] = useState<Odd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fixtureId, setFixtureId] = useState('');
  const [bet, setBet] = useState('1');
  const [bookmaker, setBookmaker] = useState('');

  const loadOdds = async () => {
    if (!fixtureId) {
      setError('Please enter a Fixture ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const params: Record<string, number> = {
        fixture: parseInt(fixtureId),
        bet: parseInt(bet)
      };
      
      if (bookmaker) {
        params.bookmaker = parseInt(bookmaker);
      }
      
      const response = await apiFootballService.getOdds(params);
      setOdds(response.response as any);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load odds');
    } finally {
      setLoading(false);
    }
  };

  const getOddColor = (odd: string) => {
    const value = parseFloat(odd);
    if (value <= 1.5) return 'text-green-600 font-bold';
    if (value <= 2.5) return 'text-blue-600 font-semibold';
    if (value <= 4.0) return 'text-yellow-600 font-medium';
    return 'text-red-600';
  };

  const calculateImpliedProbability = (odd: string) => {
    const value = parseFloat(odd);
    if (value > 0) {
      return ((1 / value) * 100).toFixed(1);
    }
    return '0.0';
  };

  const getBetTypeIcon = (betName: string) => {
    const lowerName = betName.toLowerCase();
    if (lowerName.includes('winner') || lowerName.includes('match')) {
      return <Target className="h-4 w-4" />;
    }
    if (lowerName.includes('goals') || lowerName.includes('over') || lowerName.includes('under')) {
      return <TrendingUp className="h-4 w-4" />;
    }
    if (lowerName.includes('handicap') || lowerName.includes('spread')) {
      return <Star className="h-4 w-4" />;
    }
    return <Percent className="h-4 w-4" />;
  };

  const formatBetValue = (value: string) => {
    if (value === 'Home') return '1 (Home)';
    if (value === 'Draw') return 'X (Draw)';
    if (value === 'Away') return '2 (Away)';
    return value;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Betting Odds</h1>
        <p className="text-muted-foreground">
          View live betting odds and markets for football matches
        </p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Load Betting Odds</CardTitle>
          <CardDescription>
            Enter fixture details to view current betting odds from various bookmakers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Fixture ID</label>
                <Input
                  placeholder="e.g., 868847"
                  value={fixtureId}
                  onChange={(e) => setFixtureId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use fixture IDs from the Fixtures page
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bet Type</label>
                <Select value={bet} onValueChange={setBet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Match Winner</SelectItem>
                    <SelectItem value="2">Home/Away</SelectItem>
                    <SelectItem value="3">Second Half Winner</SelectItem>
                    <SelectItem value="4">Asian Handicap</SelectItem>
                    <SelectItem value="5">Goals Over/Under</SelectItem>
                    <SelectItem value="6">Exact Score</SelectItem>
                    <SelectItem value="8">Double Chance</SelectItem>
                    <SelectItem value="9">First Half Winner</SelectItem>
                    <SelectItem value="12">Both Teams Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bookmaker (Optional)</label>
                <Input
                  placeholder="e.g., 1 for Bet365"
                  value={bookmaker}
                  onChange={(e) => setBookmaker(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty for all bookmakers
                </p>
              </div>
            </div>
            
            <Button onClick={loadOdds} disabled={loading}>
              {loading ? 'Loading...' : 'Load Odds'}
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

      {/* Odds Display */}
      {!loading && odds.length > 0 && (
        <div className="space-y-6">
          {odds.map((oddData, index) => (
            <div key={index} className="space-y-4">
              {/* Match Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Betting Market
                  </CardTitle>
                  <CardDescription>
                    {oddData.league.name} • {oddData.league.country} • {new Date(oddData.fixture.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>Fixture ID: {oddData.fixture.id}</p>
                    <p>Last Updated: {new Date(oddData.update).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Bookmakers */}
              <div className="space-y-4">
                {oddData.bookmakers.map((bookmaker) => (
                  <Card key={bookmaker.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{bookmaker.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {bookmaker.bets.map((bet) => (
                          <div key={bet.id} className="space-y-3">
                            <div className="flex items-center gap-2 border-b pb-2">
                              {getBetTypeIcon(bet.name)}
                              <h4 className="font-semibold">{bet.name}</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {bet.values.map((value, valueIndex) => (
                                <div 
                                  key={valueIndex}
                                  className="p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                                >
                                  <div className="text-center space-y-2">
                                    <div className="font-medium text-sm">
                                      {formatBetValue(value.value)}
                                    </div>
                                    <div className={`text-2xl font-bold ${getOddColor(value.odd)}`}>
                                      {value.odd}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {calculateImpliedProbability(value.odd)}% chance
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Betting Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Betting Guide</CardTitle>
              <CardDescription>
                Understanding odds and betting markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Odds Explanation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600 font-bold">1.20 - 1.50</span>
                      <span>Strong Favorite</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600 font-semibold">1.51 - 2.50</span>
                      <span>Moderate Favorite</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-600 font-medium">2.51 - 4.00</span>
                      <span>Close Match</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">4.00+</span>
                      <span>Underdog</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Common Bet Types</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>1X2:</strong> Home win / Draw / Away win</div>
                    <div><strong>Over/Under:</strong> Total goals scored</div>
                    <div><strong>Asian Handicap:</strong> Goal advantage/disadvantage</div>
                    <div><strong>Both Teams Score:</strong> Yes/No both teams score</div>
                    <div><strong>Double Chance:</strong> Two outcomes combined</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Disclaimer:</strong> This is for informational purposes only. 
                  Please gamble responsibly and be aware of the risks involved in betting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results */}
      {!loading && odds.length === 0 && fixtureId && (
        <div className="text-center py-12">
          <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No odds found for the specified fixture.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Odds may not be available for past matches or matches without betting markets.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && odds.length === 0 && !fixtureId && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Enter a fixture ID to view betting odds.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Use upcoming fixture IDs from the Fixtures page for live odds.
          </p>
        </div>
      )}
    </div>
  );
}