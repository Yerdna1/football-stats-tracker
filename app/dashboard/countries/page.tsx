'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { RateLimitError } from '@/components/ui/rate-limit-error';
import { apiFootballService } from '@/lib/api-football/service';
import { Search } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface ApiError extends Error {
  isRateLimit?: boolean;
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFootballService.getCountries();
      setCountries(response.response);
      setFilteredCountries(response.response);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    // Check if it's a rate limit error
    if ((error as ApiError).isRateLimit) {
      return <RateLimitError error={error} onRetry={loadCountries} />;
    }
    
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message || 'Failed to load countries'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Countries</h1>
        <p className="text-muted-foreground">
          Browse all available countries in the Football API
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCountries.map((country, index) => (
          <Card key={`${country.code}-${index}`} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {country.flag && (
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={48}
                    height={32}
                    className="w-12 h-8 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{country.name}</h3>
                  <p className="text-sm text-muted-foreground">{country.code}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No countries found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}