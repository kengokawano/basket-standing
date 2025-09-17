import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const season = searchParams.get('season');
  const seasonType = searchParams.get('seasonType');

  if (!season || !seasonType) {
    return NextResponse.json(
      { error: 'シーズンとシーズンタイプは必須です' },
      { status: 400 }
    );
  }

  const leagueId = '00'; // NBA
  const url = `https://stats.nba.com/stats/leaguestandingsv3?LeagueID=${leagueId}&Season=${season}&SeasonType=${encodeURIComponent(seasonType)}&SeasonYear=`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`NBA API error: ${error.response.status}`);
      return NextResponse.json({ error: `API error: ${error.response.status}` }, { status: error.response.status });
    }
    console.error('NBA API fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch NBA data', standings: [] }, { status: 500 });
  }
}