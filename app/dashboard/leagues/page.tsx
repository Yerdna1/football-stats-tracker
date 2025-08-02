'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiFootballService } from '@/lib/api-football/service';
import { Search, Filter } from 'lucide-react';

interface League {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: Array<{
    year: number;
    start: string;
    end: string;
    current: boolean;
  }>;
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [filteredLeagues, setFilteredLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    loadLeagues();
  }, []);

  useEffect(() => {
    filterLeagues();
  }, [searchTerm, selectedCountry, leagues]);

  const loadLeagues = async () => {
    try {
      setLoading(true);
      const response = await apiFootballService.getLeagues();
      setLeagues(response.response);
      
      // Extract unique countries
      const uniqueCountries = [...new Set(response.response.map((l: League) => l.country.name))];
      setCountries(uniqueCountries.sort());
      
      setFilteredLeagues(response.response);
    } catch (err: any) {
      setError(err.message || 'Failed to load leagues');
    } finally {
      setLoading(false);
    }
  };

  const filterLeagues = () => {
    let filtered = leagues;

    if (searchTerm) {
      filtered = filtered.filter(league =>
        league.league.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(league =>
        league.country.name === selectedCountry
      );
    }

    setFilteredLeagues(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leagues</h1>
        <p className="text-muted-foreground">
          Explore football leagues and competitions from around the world
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search leagues..."
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeagues.map((league, index) => (
          <Card key={`${league.league.id}-${index}`} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {league.league.logo && (
                  <img
                    src={league.league.logo}
                    alt={`${league.league.name} logo`}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{league.league.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {league.country.flag && (
                      <img
                        src={league.country.flag}
                        alt={`${league.country.name} flag`}
                        className="w-5 h-3 object-cover"
                      />
                    )}
                    <p className="text-sm text-muted-foreground">{league.country.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Type: {league.league.type}
                  </p>
                  {league.seasons.find(s => s.current) && (
                    <p className="text-sm font-medium text-primary mt-1">
                      Current Season: {league.seasons.find(s => s.current)?.year}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeagues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No leagues found matching your criteria</p>
        </div>
      )}
    </div>
  );
}