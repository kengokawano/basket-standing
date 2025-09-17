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
      headers: {
        'Accept': 'application/json',
        'Referer': 'https://www.nba.com',
        'Origin': 'https://www.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      }
    });

    if (!response.ok) {
      throw new Error(`NBA API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('NBA API error:', error);
    return NextResponse.json(
      { error: 'NBA APIからデータを取得できませんでした' },
      { status: 500 }
    );
  }
}