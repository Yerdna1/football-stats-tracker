'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ApiTestResult = 
  | {
      type: 'HTML Response';
      status: number;
      headers: Record<string, string>;
      preview: string;
    }
  | {
      type: 'JSON Response';
      status: number;
      data: unknown;
    }
  | {
      type: 'Parse Error';
      status: number;
      rawResponse: string;
      parseError: string;
    }
  | {
      type: 'Network Error';
      error: string;
    };

export default function TestApiPage() {
  const [result, setResult] = useState<ApiTestResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing API at:', window.location.origin + '/api/football?endpoint=timezone');
      
      // Test the API directly
      const response = await fetch('/api/football?endpoint=timezone');
      const responseText = await response.text();
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response text length:', responseText.length);
      console.log('Response preview:', responseText.substring(0, 200));

      if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
        setError(`Received HTML instead of JSON (Status: ${response.status}). API route may not be configured correctly.`);
        setResult({
          type: 'HTML Response',
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          preview: responseText.substring(0, 1000)
        });
      } else {
        try {
          const data = JSON.parse(responseText);
          console.log('Successfully parsed JSON:', data);
          setResult({
            type: 'JSON Response',
            status: response.status,
            data: data
          });
        } catch (e) {
          setError(`Failed to parse JSON response: ${e instanceof Error ? e.message : 'Parse error'}`);
          setResult({
            type: 'Parse Error',
            status: response.status,
            rawResponse: responseText.substring(0, 1000),
            parseError: e instanceof Error ? e.message : 'Unknown parse error'
          });
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult({
        type: 'Network Error',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
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
