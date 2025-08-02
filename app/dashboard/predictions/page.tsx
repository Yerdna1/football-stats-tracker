'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import { Brain, Target, AlertCircle, Star } from 'lucide-react';
import Image from 'next/image';

interface Prediction {
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
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      last_5: {
        form: string;
        att: string;
        def: string;
        goals: {
          for: {
            total: number;
            average: string;
          };
          against: {
            total: number;
            average: string;
          };
        };
      };
    };
    away: {
      id: number;
      name: string;
      logo: string;
      last_5: {
        form: string;
        att: string;
        def: string;
        goals: {
          for: {
            total: number;
            average: string;
          };
          against: {
            total: number;
            average: string;
          };
        };
      };
    };
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
  h2h: Array<{
    fixture: {
      id: number;
      referee: string;
      timezone: string;
      date: string;
      timestamp: number;
    };
    teams: {
      home: {
        id: number;
        name: string;
        logo: string;
      };
      away: {
        id: number;
        name: string;
        logo: string;
      };
    };
    goals: {
      home: number;
      away: number;
    };
  }>;
}

export default function PredictionsPage() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fixtureId, setFixtureId] = useState('');

  const loadPrediction = async () => {
    if (!fixtureId) {
      setError('Please enter a Fixture ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiFootballService.getPredictions(parseInt(fixtureId));
      
      if (response.response.length > 0) {
        setPrediction(response.response[0] as Prediction);
      } else {
        setError('No predictions available for this fixture');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  const getWinProbabilityColor = (percentage: string) => {
    const value = parseFloat(percentage);
    if (value > 60) return 'text-green-600';
    if (value > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFormColor = (form: string) => {
    const percentage = parseFloat(form);
    if (percentage > 70) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (percentage > 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const renderFormIndicator = (form: string) => {
    return form.split('').map((result, index) => (
      <div
        key={index}
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          result === 'W' ? 'bg-green-500 text-white' :
          result === 'D' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}
      >
        {result}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Match Predictions</h1>
        <p className="text-muted-foreground">
          AI-powered predictions and analysis for upcoming matches
        </p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Load Match Prediction</CardTitle>
          <CardDescription>
            Enter a fixture ID to view AI predictions and analysis
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
                Use upcoming fixture IDs from the Fixtures page
              </p>
            </div>
            <Button onClick={loadPrediction} disabled={loading}>
              {loading ? 'Loading...' : 'Load Prediction'}
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

      {/* Prediction Display */}
      {!loading && prediction && (
        <div className="space-y-6">
          {/* Match Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Prediction Analysis
              </CardTitle>
              <CardDescription>
                {prediction.league.name} • {prediction.league.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {prediction.teams.home.logo && (
                    <Image 
                      src={prediction.teams.home.logo} 
                      alt={prediction.teams.home.name}
                      className="w-12 h-12 object-contain"
                      width={48}
                      height={48}
                    />
                  )}
                  <span className="text-xl font-bold">{prediction.teams.home.name}</span>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold">VS</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">{prediction.teams.away.name}</span>
                  {prediction.teams.away.logo && (
                    <Image 
                      src={prediction.teams.away.logo} 
                      alt={prediction.teams.away.name}
                      className="w-12 h-12 object-contain"
                      width={48}
                      height={48}
                    />
                  )}
                </div>
              </div>

              {/* Win Probabilities */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className={`text-2xl font-bold ${getWinProbabilityColor(prediction.predictions.percent.home)}`}>
                    {prediction.predictions.percent.home}%
                  </div>
                  <div className="text-sm text-muted-foreground">Home Win</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                  <div className={`text-2xl font-bold ${getWinProbabilityColor(prediction.predictions.percent.draw)}`}>
                    {prediction.predictions.percent.draw}%
                  </div>
                  <div className="text-sm text-muted-foreground">Draw</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className={`text-2xl font-bold ${getWinProbabilityColor(prediction.predictions.percent.away)}`}>
                    {prediction.predictions.percent.away}%
                  </div>
                  <div className="text-sm text-muted-foreground">Away Win</div>
                </div>
              </div>

              {/* Winner Prediction */}
              {prediction.predictions.winner && (
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold">Predicted Winner</span>
                  </div>
                  <div className="text-lg font-bold">{prediction.predictions.winner.name}</div>
                  <div className="text-sm text-muted-foreground">{prediction.predictions.winner.comment}</div>
                </div>
              )}

              {/* Advice */}
              {prediction.predictions.advice && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Betting Advice</span>
                  </div>
                  <div className="text-lg">{prediction.predictions.advice}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Form Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Home Team Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {prediction.teams.home.logo && (
                    <Image 
                      src={prediction.teams.home.logo} 
                      alt={prediction.teams.home.name}
                      className="w-6 h-6 object-contain"
                      width={24}
                      height={24}
                    />
                  )}
                  {prediction.teams.home.name} Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Last 5 Matches</div>
                    <div className="flex gap-1">
                      {renderFormIndicator(prediction.teams.home.last_5.form)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Attack</div>
                      <div className={`px-2 py-1 rounded text-sm ${getFormColor(prediction.teams.home.last_5.att)}`}>
                        {prediction.teams.home.last_5.att}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Defense</div>
                      <div className={`px-2 py-1 rounded text-sm ${getFormColor(prediction.teams.home.last_5.def)}`}>
                        {prediction.teams.home.last_5.def}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Goals (Last 5)</div>
                    <div className="text-lg font-semibold">
                      {prediction.teams.home.last_5.goals.for.total} scored / {prediction.teams.home.last_5.goals.against.total} conceded
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg: {prediction.teams.home.last_5.goals.for.average} per game
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Away Team Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {prediction.teams.away.logo && (
                    <Image 
                      src={prediction.teams.away.logo} 
                      alt={prediction.teams.away.name}
                      className="w-6 h-6 object-contain"
                      width={24}
                      height={24}
                    />
                  )}
                  {prediction.teams.away.name} Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Last 5 Matches</div>
                    <div className="flex gap-1">
                      {renderFormIndicator(prediction.teams.away.last_5.form)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Attack</div>
                      <div className={`px-2 py-1 rounded text-sm ${getFormColor(prediction.teams.away.last_5.att)}`}>
                        {prediction.teams.away.last_5.att}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Defense</div>
                      <div className={`px-2 py-1 rounded text-sm ${getFormColor(prediction.teams.away.last_5.def)}`}>
                        {prediction.teams.away.last_5.def}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Goals (Last 5)</div>
                    <div className="text-lg font-semibold">
                      {prediction.teams.away.last_5.goals.for.total} scored / {prediction.teams.away.last_5.goals.against.total} conceded
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg: {prediction.teams.away.last_5.goals.for.average} per game
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
              <CardDescription>
                Statistical comparison between both teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Overall Form</div>
                  <div className="flex justify-between">
                    <span className="font-bold">{prediction.comparison.form.home}%</span>
                    <span className="font-bold">{prediction.comparison.form.away}%</span>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Attack Strength</div>
                  <div className="flex justify-between">
                    <span className="font-bold">{prediction.comparison.att.home}%</span>
                    <span className="font-bold">{prediction.comparison.att.away}%</span>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Defense Strength</div>
                  <div className="flex justify-between">
                    <span className="font-bold">{prediction.comparison.def.home}%</span>
                    <span className="font-bold">{prediction.comparison.def.away}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results */}
      {!loading && !prediction && fixtureId && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No predictions available for this fixture.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Predictions are only available for upcoming matches in major leagues.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !prediction && !fixtureId && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Enter a fixture ID to view AI predictions.</p>
        </div>
      )}
    </div>
  );
}