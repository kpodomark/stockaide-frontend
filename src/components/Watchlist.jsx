import { useState } from 'react';
import axios from 'axios';
import { Search, Plus, Eye } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Watchlist() {
  const [searchTicker, setSearchTicker] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeStock = async () => {
    if (!searchTicker.trim()) {
      setError('Enter a ticker');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_BASE_URL}/analysis/analyze`, {
        ticker: searchTicker.toUpperCase()
      });
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze stock');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Watchlist & Analysis</h1>
        <p className="text-slate-400">Research stocks before buying</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search ticker (e.g., AAPL, MSFT)"
          value={searchTicker}
          onChange={(e) => setSearchTicker(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && analyzeStock()}
          className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={analyzeStock}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
        >
          <Search size={20} /> Analyze
        </button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded">{error}</div>}

      {loading && <div className="text-slate-300">Analyzing stock...</div>}

      {analysis && (
        <div className="space-y-6">
          {/* Price Data */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-4">{analysis.ticker}</h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Current Price</p>
                <p className="text-2xl font-bold text-white">${analysis.priceData.currentPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Day High</p>
                <p className="text-2xl font-bold text-white">${analysis.priceData.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Day Low</p>
                <p className="text-2xl font-bold text-white">${analysis.priceData.low.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Change</p>
                <p className={`text-2xl font-bold ${analysis.priceData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {analysis.priceData.change >= 0 ? '+' : ''}{analysis.priceData.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Analysis Display */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
            
            {/* Entry Score */}
            {analysis.insights && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Entry Score</p>
                    <p className="text-4xl font-bold text-blue-400">{analysis.insights.entryScore}/10</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Quality Grade</p>
                    <p className="text-4xl font-bold text-green-400">{analysis.quality.grade}</p>
                  </div>
                </div>

                {/* Investment Thesis */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Investment Thesis</h4>
                  <p className="text-slate-300">{analysis.insights.thesis}</p>
                </div>

                {/* Bull Case */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Bull Case</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {analysis.insights.bullCase.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Bear Case */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-red-400 mb-2">Bear Case</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {analysis.insights.bearCase.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Key Insight */}
                <div className="bg-blue-900/30 border border-blue-700 p-4 rounded">
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">💡 Key Insight</h4>
                  <p className="text-slate-300">{analysis.insights.keyInsight}</p>
                </div>
              </div>
            )}

            {/* Fallback if old format */}
            {analysis.analysis && !analysis.insights && (
              <div className="text-slate-300 whitespace-pre-wrap">{analysis.analysis}</div>
            )}
          </div>

          {/* Financial Metrics */}
          {analysis.quality && (
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
              <h3 className="text-xl font-bold text-white mb-4">Financial Quality</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">ROIC</p>
                  <p className="text-xl font-bold text-white">{analysis.quality.metrics.roic}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">ROE</p>
                  <p className="text-xl font-bold text-white">{analysis.quality.metrics.roe}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Profit Margin</p>
                  <p className="text-xl font-bold text-white">{analysis.quality.metrics.profitMargin}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">{analysis.quality.explanation}</p>
            </div>
          )}

          {/* Recent News */}
          {analysis.recentNews && analysis.recentNews.length > 0 && (
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
              <h3 className="text-xl font-bold text-white mb-4">Recent News</h3>
              <div className="space-y-3">
                {analysis.recentNews.map((news, idx) => (
                  <div key={idx} className="border-b border-slate-600 pb-3 last:border-0">
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      {news.headline}
                    </a>
                    <p className="text-slate-400 text-sm mt-1">
                      {news.source} • {new Date(news.datetime).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insider Activity */}
          {analysis.insiderActivity && (
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
              <h3 className="text-xl font-bold text-white mb-4">Insider Activity</h3>
              <div className={`p-4 rounded ${
                analysis.insiderActivity.netBuying.trend === 'buying' ? 'bg-green-900/30 border border-green-700' :
                analysis.insiderActivity.netBuying.trend === 'selling' ? 'bg-red-900/30 border border-red-700' :
                'bg-slate-600'
              }`}>
                <p className="text-slate-300">{analysis.insiderActivity.netBuying.description}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}