'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Test the API directly
      const response = await fetch('/api/football?endpoint=timezone');
      const responseText = await response.text();
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response text:', responseText);

      if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
        setError('Received HTML instead of JSON. API route may not be configured correctly.');
        setResult(responseText.substring(0, 500));
      } else {
        try {
          const data = JSON.parse(responseText);
          setResult(data);
        } catch (e) {
          setError('Failed to parse JSON response');
          setResult(responseText);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4">
        <Button onClick={testApi} disabled={loading}>
          {loading ? 'Testing...' : 'Test API'}
        </Button>

        {error && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}