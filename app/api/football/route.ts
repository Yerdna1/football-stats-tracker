import { NextRequest, NextResponse } from 'next/server';
import { getApiClient } from '@/lib/api-football/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint parameter is required' },
      { status: 400 }
    );
  }

  try {
    const client = await getApiClient();
    let data;

    // Parse additional parameters
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        params[key] = value;
      }
    });

    // Route to appropriate API method
    switch (endpoint) {
      case 'timezone':
        data = await client.getTimezone();
        break;
      case 'countries':
        data = await client.getCountries();
        break;
      case 'leagues':
        data = await client.getLeagues(params);
        break;
      case 'teams':
        data = await client.getTeams(params);
        break;
      case 'standings':
        data = await client.getStandings(params as any);
        break;
      case 'fixtures':
        data = await client.getFixtures(params);
        break;
      case 'players':
        data = await client.getPlayers(params);
        break;
      case 'topscorers':
        data = await client.getTopScorers(params as any);
        break;
      case 'statistics':
        data = await client.getStatistics(params as any);
        break;
      case 'predictions':
        data = await client.getPredictions(params as any);
        break;
      case 'odds':
        data = await client.getOdds(params);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown endpoint' },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}