'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import { Search, Users, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import { TeamResponse as Team } from '@/types/api-response';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const filterTeams = useCallback(() => {
    let filtered = teams;

    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.team.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(team => team.team.country === selectedCountry);
    }

    setFilteredTeams(filtered);
  }, [teams, searchTerm, selectedCountry]);

  const loadTeams = async (country?: string, name?: string) => {
    try {
      setLoading(true);
      setError('');
      const params: Record<string, string> = {};
      
      if (country) params.country = country;
      if (name) params.search = name;
      
      const response = await apiFootballService.getTeams(params);
      setTeams(response.response as unknown as Team[]);
      setHasSearched(true);
      
      // Extract unique countries
      const uniqueCountries = [...new Set((response.response as unknown as Team[]).map((t: Team) => t.team.country))];
      setCountries(uniqueCountries.sort());
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterTeams();
  }, [searchTerm, selectedCountry, teams, filterTeams]);

  const handleSearch = () => {
    loadTeams(selectedCountry, searchTerm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">
          Search and explore football teams from around the world
        </p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search Teams</CardTitle>
          <CardDescription>
            Enter search criteria to find specific teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by team name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="flex h-10 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Countries</option>
              {countries.map((country, index) => (
                <option key={`${country}-${index}`} value={country}>{country}</option>
              ))}
            </select>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
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

      {/* Teams Grid */}
      {!loading && hasSearched && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team, index) => (
            <Card key={`${team.team.id}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {team.team.logo && (
                    <Image
                      src={team.team.logo}
                      alt={`${team.team.name} logo`}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{team.team.name}</h3>
                    <p className="text-sm text-muted-foreground">{team.team.country}</p>
                    {team.team.code && (
                      <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1 inline-block">
                        {team.team.code}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {team.team.founded && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Founded: {team.team.founded}</span>
                    </div>
                  )}
                  
                  {team.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{team.venue.name}, {team.venue.city}</span>
                    </div>
                  )}
                  
                  {team.venue?.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Capacity: {team.venue.capacity.toLocaleString()}</span>
                    </div>
                  )}

                  {team.team.national && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      National Team
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No teams found. Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !hasSearched && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter search criteria and click &quot;Search&quot; to find teams.</p>
        </div>
      )}
    </div>
  );
}