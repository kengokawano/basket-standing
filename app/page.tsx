'use client';

import { useState } from 'react';

export default function Home() {
  const [season, setSeason] = useState('2023-24');
  const [seasonType, setSeasonType] = useState('Regular Season');
  const [loading, setLoading] = useState(false);

  const downloadStandings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/standings?season=${season}&seasonType=${encodeURIComponent(seasonType)}`);

      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }

      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nba_standings_${season}_${seasonType.replace(' ', '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert('データのダウンロードに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">NBA順位表ダウンロード</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="season" className="block text-sm font-medium mb-2">
                シーズン
              </label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2023-24">2023-24</option>
                <option value="2022-23">2022-23</option>
                <option value="2021-22">2021-22</option>
                <option value="2020-21">2020-21</option>
                <option value="2019-20">2019-20</option>
              </select>
            </div>

            <div>
              <label htmlFor="seasonType" className="block text-sm font-medium mb-2">
                シーズンタイプ
              </label>
              <select
                id="seasonType"
                value={seasonType}
                onChange={(e) => setSeasonType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Regular Season">レギュラーシーズン</option>
                <option value="Pre Season">プレシーズン</option>
              </select>
            </div>

            <button
              onClick={downloadStandings}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {loading ? 'ダウンロード中...' : 'JSONをダウンロード'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>このツールはNBA公式APIから順位表データを取得し、JSON形式でダウンロードします。</p>
          <p className="mt-2">取得されるデータには、チーム情報、勝敗記録、順位などが含まれます。</p>
        </div>
      </main>
    </div>
  );
}
