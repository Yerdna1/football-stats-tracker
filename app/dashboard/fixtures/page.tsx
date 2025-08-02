'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import Image from 'next/image';

interface Fixture {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number;
      second: number;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [liveOnly, setLiveOnly] = useState(false);

  useEffect(() => {
    loadFixtures();
  }, []);

  const loadFixtures = async (date?: string, live?: boolean) => {
    try {
      setLoading(true);
      setError('');
      const params: Record<string, string> = {};
      
      if (live) {
        params.live = 'all';
      } else if (date) {
        params.date = date;
      }
      
      const response = await apiFootballService.getFixtures(params);
      setFixtures(response.response);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load fixtures');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setLiveOnly(false);
    loadFixtures(date, false);
  };

  const handleLiveFixtures = () => {
    setLiveOnly(true);
    loadFixtures(undefined, true);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
      case '1H':
      case '2H':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'FT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'NS':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fixtures</h1>
        <p className="text-muted-foreground">
          View football matches, live scores and results
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Fixtures</CardTitle>
          <CardDescription>
            Select date or view live matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            <Button 
              variant={liveOnly ? "default" : "outline"}
              onClick={handleLiveFixtures}
              disabled={loading}
            >
              {loading && liveOnly ? 'Loading...' : 'Live Matches'}
            </Button>
            <Button 
              variant={!liveOnly ? "default" : "outline"}
              onClick={() => loadFixtures(selectedDate, false)}
              disabled={loading}
            >
              {loading && !liveOnly ? 'Loading...' : 'Load Date'}
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

      {/* Fixtures List */}
      {!loading && fixtures.length > 0 && (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <Card key={fixture.fixture.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{fixture.league.name}</span>
                    {fixture.league.flag && (
                      <Image 
                        src={fixture.league.flag} 
                        alt="Country" 
                        className="w-4 h-3" 
                        width={16}
                        height={12}
                      />
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fixture.fixture.status.short)}`}>
                    {fixture.fixture.status.long}
                    {fixture.fixture.status.elapsed && ` (${fixture.fixture.status.elapsed}')`}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Home Team */}
                  <div className="flex items-center gap-3">
                    {fixture.teams.home.logo && (
                      <Image 
                        src={fixture.teams.home.logo} 
                        alt={fixture.teams.home.name}
                        className="w-8 h-8 object-contain"
                        width={32}
                        height={32}
                      />
                    )}
                    <span className={`font-medium ${fixture.teams.home.winner ? 'text-green-600' : ''}`}>
                      {fixture.teams.home.name}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    {fixture.goals.home !== null && fixture.goals.away !== null ? (
                      <div className="text-2xl font-bold">
                        {fixture.goals.home} - {fixture.goals.away}
                      </div>
                    ) : (
                      <div className="text-lg text-muted-foreground">
                        {formatTime(fixture.fixture.date)}
                      </div>
                    )}
                    {fixture.score.halftime.home !== null && (
                      <div className="text-sm text-muted-foreground">
                        HT: {fixture.score.halftime.home} - {fixture.score.halftime.away}
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-3 md:justify-end">
                    <span className={`font-medium ${fixture.teams.away.winner ? 'text-green-600' : ''}`}>
                      {fixture.teams.away.name}
                    </span>
                    {fixture.teams.away.logo && (
                      <Image 
                        src={fixture.teams.away.logo} 
                        alt={fixture.teams.away.name}
                        className="w-8 h-8 object-contain"
                        width={32}
                        height={32}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {fixture.fixture.venue?.name && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{fixture.fixture.venue.name}, {fixture.fixture.venue.city}</span>
                    </div>
                  )}
                  {fixture.league.round && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{fixture.league.round}</span>
                    </div>
                  )}
                  {fixture.fixture.referee && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Ref: {fixture.fixture.referee}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && fixtures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {liveOnly ? 'No live matches found.' : 'No fixtures found for the selected date.'}
          </p>
        </div>
      )}
    </div>
  );
}