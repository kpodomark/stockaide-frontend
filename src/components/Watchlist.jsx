import { useState } from 'react';
import axios from 'axios';
import { Search, Plus, Eye } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
                <p className="text-2xl font-bold text-white">${analysis.priceData.dayHigh.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Day Low</p>
                <p className="text-2xl font-bold text-white">${analysis.priceData.dayLow.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Change</p>
                <p className={`text-2xl font-bold ${analysis.priceData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {analysis.priceData.change >= 0 ? '+' : ''}{analysis.priceData.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Claude Analysis */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
            <div className="text-slate-300 whitespace-pre-wrap">{analysis.analysis}</div>
          </div>
        </div>
      )}
    </div>
  );
}