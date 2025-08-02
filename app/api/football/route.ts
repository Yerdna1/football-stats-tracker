import { NextRequest, NextResponse } from 'next/server';
import { apiFootballClient } from '@/lib/api-football/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.API_FOOTBALL_KEY;
    
    if (!apiKey) {
      console.error('API_FOOTBALL_KEY is not configured');
      return NextResponse.json(
        { error: 'API key is not configured. Please set API_FOOTBALL_KEY in your environment variables.' },
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

    console.log(`API Request - Endpoint: ${endpoint}, Params:`, params);

    // Make the API request
    const response = await apiFootballClient.request(endpoint, params);
    
    // Log response for debugging
    console.log(`API Response - Status: ${response.errors?.length ? 'Error' : 'Success'}`);
    
    if (response.errors && response.errors.length > 0) {
      console.error('API Errors:', response.errors);
      return NextResponse.json(
        { error: response.errors[0] || 'API request failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Route Error:', error);
    
    // Check if it's an Axios error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('Axios Error Response:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers
      });
      
      // Return more detailed error information
      return NextResponse.json(
        { 
          error: 'API request failed',
          details: axiosError.response?.data || axiosError.message,
          status: axiosError.response?.status
        },
        { status: axiosError.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}