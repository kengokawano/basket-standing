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
    // シンプルなfetchでtry、axiosライブラリのアプローチを参考
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`NBA API error: ${response.status}`);
      // 参考リポジトリのようにエラー時は空配列を返す
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('NBA API fetch error:', error);
    // 参考リポジトリのようにエラー時は空の結果を返す
    return NextResponse.json({ error: 'Failed to fetch NBA data', standings: [] }, { status: 500 });
  }
}