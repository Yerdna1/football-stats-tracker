'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import Image from 'next/image';

interface Standing {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  update: string;
}

interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings: Standing[][];
}

export default function StandingsPage() {
  const [standings, setStandings] = useState<League | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [season, setSeason] = useState(new Date().getFullYear().toString());

  const loadStandings = async () => {
    if (!leagueId) {
      setError('Please enter a League ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await apiFootballService.getStandings(
        parseInt(leagueId), 
        parseInt(season)
      );
      
      if (response.response.length > 0) {
        setStandings(response.response[0].league);
      } else {
        setError('No standings found for the specified league and season');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load standings');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number, description: string | null) => {
    if (!description) return '';
    
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('champions league')) {
      return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950';
    }
    if (lowerDesc.includes('europa') || lowerDesc.includes('uefa')) {
      return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950';
    }
    if (lowerDesc.includes('relegation')) {
      return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950';
    }
    return '';
  };

  const getFormIcon = (result: string) => {
    switch (result) {
      case 'W':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'D':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'L':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const loadPremierLeague = () => {
    setLeagueId('39'); // Premier League ID
    setSeason('2023');
  };

  const loadLaLiga = () => {
    setLeagueId('140'); // La Liga ID
    setSeason('2023');
  };

  const loadBundesliga = () => {
    setLeagueId('78'); // Bundesliga ID
    setSeason('2023');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">League Standings</h1>
        <p className="text-muted-foreground">
          View league tables and team standings
        </p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>League Selection</CardTitle>
          <CardDescription>
            Enter League ID and Season to view standings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">League ID</label>
                <Input
                  placeholder="e.g., 39 for Premier League"
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Season</label>
                <Input
                  placeholder="e.g., 2023"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={loadStandings} disabled={loading}>
                  {loading ? 'Loading...' : 'Load Standings'}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={loadPremierLeague}>
                Premier League
              </Button>
              <Button variant="outline" size="sm" onClick={loadLaLiga}>
                La Liga
              </Button>
              <Button variant="outline" size="sm" onClick={loadBundesliga}>
                Bundesliga
              </Button>
            </div>
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

      {/* Standings Table */}
      {!loading && standings && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {standings.logo && (
                <Image src={standings.logo} alt={standings.name} className="w-12 h-12" width={48} height={48} />
              )}
              <div>
                <CardTitle className="flex items-center gap-2">
                  {standings.name}
                  {standings.flag && (
                    <Image src={standings.flag} alt={standings.country} className="w-6 h-4" width={24} height={16} />
                  )}
                </CardTitle>
                <CardDescription>
                  {standings.country} • Season {standings.season}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm">
                    <th className="text-left p-2">Pos</th>
                    <th className="text-left p-2">Team</th>
                    <th className="text-center p-2">MP</th>
                    <th className="text-center p-2">W</th>
                    <th className="text-center p-2">D</th>
                    <th className="text-center p-2">L</th>
                    <th className="text-center p-2">GF</th>
                    <th className="text-center p-2">GA</th>
                    <th className="text-center p-2">GD</th>
                    <th className="text-center p-2">Pts</th>
                    <th className="text-center p-2">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.standings[0]?.map((team) => (
                    <tr 
                      key={team.team.id} 
                      className={`border-b hover:bg-muted/50 transition-colors ${getRankColor(team.rank, team.description)}`}
                    >
                      <td className="p-2 font-medium">{team.rank}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          {team.team.logo && (
                            <Image 
                              src={team.team.logo} 
                              alt={team.team.name}
                              className="w-6 h-6 object-contain"
                              width={24}
                              height={24}
                            />
                          )}
                          <span className="font-medium">{team.team.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-2">{team.all.played}</td>
                      <td className="text-center p-2 text-green-600">{team.all.win}</td>
                      <td className="text-center p-2 text-yellow-600">{team.all.draw}</td>
                      <td className="text-center p-2 text-red-600">{team.all.lose}</td>
                      <td className="text-center p-2">{team.all.goals.for}</td>
                      <td className="text-center p-2">{team.all.goals.against}</td>
                      <td className="text-center p-2">
                        <span className={team.goalsDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {team.goalsDiff > 0 ? '+' : ''}{team.goalsDiff}
                        </span>
                      </td>
                      <td className="text-center p-2 font-bold">{team.points}</td>
                      <td className="text-center p-2">
                        <div className="flex items-center justify-center gap-1">
                          {team.form?.split('').slice(-5).map((result, index) => (
                            <div key={index} title={result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}>
                              {getFormIcon(result)}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2 text-sm">
              <h4 className="font-medium">Position Meaning:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500"></div>
                  <span>Champions League</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500"></div>
                  <span>Europa League / UEFA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500"></div>
                  <span>Relegation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}