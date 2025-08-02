'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import Image from 'next/image';

interface Player {
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

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [teamId, setTeamId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [season, setSeason] = useState('2023');

  const loadPlayers = async () => {
    if (!searchTerm && !teamId && !leagueId) {
      setError('Please enter search criteria (player name, team ID, or league ID)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const params: Record<string, string | number> = {};
      if (searchTerm) params.search = searchTerm;
      if (teamId) params.team = parseInt(teamId);
      if (leagueId) params.league = parseInt(leagueId);
      if (season) params.season = parseInt(season);
      
      const response = await apiFootballService.getPlayers(params);
      setPlayers(response.response);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setTeamId('');
    setLeagueId('');
    setPlayers([]);
    setError('');
  };

  const getPositionColor = (position: string) => {
    switch (position?.toLowerCase()) {
      case 'goalkeeper':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'defender':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'midfielder':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'attacker':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
        <p className="text-muted-foreground">
          Search for players and view their statistics
        </p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search Players</CardTitle>
          <CardDescription>
            Search by player name, team ID, or league ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Player Name</label>
                <Input
                  placeholder="e.g., Messi"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Team ID</label>
                <Input
                  placeholder="e.g., 33"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">League ID</label>
                <Input
                  placeholder="e.g., 39"
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Season</label>
                <Input
                  placeholder="e.g., 2023"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={loadPlayers} disabled={loading}>
                {loading ? 'Searching...' : 'Search Players'}
              </Button>
              <Button variant="outline" onClick={clearSearch}>
                Clear
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

      {/* Players Grid */}
      {!loading && players.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {players.map((playerData) => (
            <Card key={playerData.player.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {playerData.player.photo && (
                    <Image
                      src={playerData.player.photo}
                      alt={playerData.player.name}
                      className="w-16 h-16 rounded-full object-cover"
                      width={64}
                      height={64}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{playerData.player.name}</h3>
                    <p className="text-sm text-muted-foreground">{playerData.player.nationality}</p>
                    {playerData.player.age && (
                      <p className="text-sm text-muted-foreground">Age: {playerData.player.age}</p>
                    )}
                    {playerData.player.injured && (
                      <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Injured
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Physical Info */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {playerData.player.height && (
                      <div>
                        <span className="text-muted-foreground">Height:</span> {playerData.player.height}
                      </div>
                    )}
                    {playerData.player.weight && (
                      <div>
                        <span className="text-muted-foreground">Weight:</span> {playerData.player.weight}
                      </div>
                    )}
                  </div>

                  {/* Birth Info */}
                  {playerData.player.birth && (
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>Born: {new Date(playerData.player.birth.date).toLocaleDateString()}</span>
                      </div>
                      {playerData.player.birth.place && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{playerData.player.birth.place}, {playerData.player.birth.country}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Current Season Stats */}
                  {playerData.statistics && playerData.statistics.length > 0 && (
                    <div className="border-t pt-3">
                      {playerData.statistics.map((stat, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2">
                            {stat.team.logo && (
                              <Image src={stat.team.logo} alt={stat.team.name} className="w-4 h-4" width={16} height={16} />
                            )}
                            <span className="font-medium text-sm">{stat.team.name}</span>
                            {stat.games.position && (
                              <span className={`px-2 py-1 rounded-full text-xs ${getPositionColor(stat.games.position)}`}>
                                {stat.games.position}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Games: {stat.games.appearences || 0}</div>
                            <div>Goals: {stat.goals.total || 0}</div>
                            <div>Assists: {stat.goals.assists || 0}</div>
                            <div>Minutes: {stat.games.minutes || 0}</div>
                            {stat.games.rating && (
                              <div>Rating: {parseFloat(stat.games.rating).toFixed(1)}</div>
                            )}
                            {stat.games.captain && (
                              <div className="col-span-2">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  <Trophy className="h-3 w-3" />
                                  Captain
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && players.length === 0 && (searchTerm || teamId || leagueId) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No players found. Try different search criteria.</p>
        </div>
      )}

      {/* Initial State */}
      {!loading && players.length === 0 && !searchTerm && !teamId && !leagueId && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter search criteria to find players.</p>
        </div>
      )}
    </div>
  );
}