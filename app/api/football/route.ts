import { NextRequest, NextResponse } from 'next/server';
import apiFootballClient from '@/lib/api-football/client';

// Enhanced error logging utility
function logError(context: string, error: unknown, additionalInfo?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    additionalInfo
  };
  
  console.error(`[${timestamp}] ${context}:`, JSON.stringify(errorInfo, null, 2));
}

export async function GET(request: NextRequest) {
  const requestId = Date.now().toString();
  
  try {
    console.log(`[${requestId}] API Request started:`, {
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    });

    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
      logError('Missing endpoint parameter', null, { requestId, searchParams: Object.fromEntries(searchParams) });
      return NextResponse.json(
        { error: 'Endpoint parameter is required', requestId },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.API_FOOTBALL_KEY;
    
    if (!apiKey) {
      logError('Missing API key', null, { requestId });
      return NextResponse.json(
        { 
          error: 'API key is not configured. Please set API_FOOTBALL_KEY in your environment variables.',
          requestId 
        },
        { status: 500 }
      );
    }

    // Validate API key format
    if (apiKey.length < 10) {
      logError('Invalid API key format', null, { requestId, keyLength: apiKey.length });
      return NextResponse.json(
        { error: 'Invalid API key format', requestId },
        { status: 500 }
      );
    }

    // Set the API key
    apiFootballClient.setApiKey(apiKey);

    // Build params object from search params
    const params: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        // Try to parse as number if possible
        const numValue = Number(value);
        params[key] = isNaN(numValue) ? value : numValue;
      }
    });

    console.log(`[${requestId}] Making API request:`, {
      endpoint,
      params,
      timestamp: new Date().toISOString()
    });

    // Make the API request with timeout handling
    const startTime = Date.now();
    let response;
    
    try {
      response = await Promise.race([
        apiFootballClient.request(endpoint, params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
        )
      ]);
    } catch (requestError) {
      const duration = Date.now() - startTime;
      logError('API request failed', requestError, { 
        requestId, 
        endpoint, 
        params, 
        duration: `${duration}ms` 
      });
      throw requestError;
    }

    const duration = Date.now() - startTime; 
    
    console.log(`[${requestId}] API Response received:`, {
      status: response && typeof response === 'object' && 'errors' in response && response.errors?.length ? 'Error' : 'Success',
      duration: `${duration}ms`,
      hasData: response && typeof response === 'object' && 'response' in response ? !!response.response : false,
      timestamp: new Date().toISOString()
    });
    
    if (response && typeof response === 'object' && 'errors' in response && response.errors && response.errors.length > 0) {
      logError('API returned errors', null, { 
        requestId, 
        endpoint, 
        params, 
        errors: response.errors,
        duration: `${duration}ms`
      });
      
      return NextResponse.json(
        { 
          error: response.errors[0] || 'API request failed',
          requestId,
          endpoint,
          details: response.errors
        },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Request completed successfully in ${duration}ms`);
    return NextResponse.json({ ...response, requestId });
    
  } catch (error) {
    logError('Unhandled API route error', error, { requestId });
    
    // Enhanced error handling with more specific error types
    if (error && typeof error === 'object' && 'code' in error) {
      const networkError = error as { code: string; message: string };
      
      switch (networkError.code) {
        case 'ENOTFOUND':
          return NextResponse.json(
            { 
              error: 'Network error: Unable to reach API server',
              details: 'DNS resolution failed',
              requestId,
              code: networkError.code
            },
            { status: 503 }
          );
        case 'ECONNREFUSED':
          return NextResponse.json(
            { 
              error: 'Network error: Connection refused',
              details: 'API server refused connection',
              requestId,
              code: networkError.code
            },
            { status: 503 }
          );
        case 'ETIMEDOUT':
          return NextResponse.json(
            { 
              error: 'Network error: Request timeout',
              details: 'API server did not respond in time',
              requestId,
              code: networkError.code
            },
            { status: 504 }
          );
      }
    }
    
    // Check if it's an Axios error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status: number;
          statusText: string;
          data: unknown;
          headers: Record<string, string>;
        };
        message: string;
        code?: string;
      };
      
      const errorDetails = {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        message: axiosError.message,
        code: axiosError.code
      };
      
      logError('Axios error details', null, { requestId, errorDetails });
      
      return NextResponse.json(
        { 
          error: 'External API request failed',
          details: axiosError.response?.data || axiosError.message,
          status: axiosError.response?.status,
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: axiosError.response?.status || 500 }
      );
    }
    
    // Generic error fallback
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        requestId,
        timestamp: new Date().toISOString(),
        type: typeof error
      },
      { status: 500 }
    );
  }
}
