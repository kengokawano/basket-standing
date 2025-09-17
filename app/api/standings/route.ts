import { NextRequest, NextResponse } from 'next/server';

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
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Host': 'stats.nba.com',
        'Referer': 'https://www.nba.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true'
      },
      cache: 'no-cache'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NBA API error: ${response.status} - ${errorText}`);
      throw new Error(`NBA API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('NBA API error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url,
      error
    });
    return NextResponse.json(
      {
        error: 'NBA APIからデータを取得できませんでした',
        details: error instanceof Error ? error.message : 'Unknown error',
        url: url
      },
      { status: 500 }
    );
  }
}