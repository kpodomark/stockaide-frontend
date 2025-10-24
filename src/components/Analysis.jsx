import { useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Analysis() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const USER_ID = 1;

  const loadPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio?userId=${USER_ID}`);
      setPortfolio(response.data.portfolio);
    } catch (err) {
      setError('Failed to load portfolio');
    }
  };

  const analyzeHolding = async (ticker) => {
    try {
      setLoading(true);
      setSelectedStock(ticker);
      const response = await axios.post(`${API_BASE_URL}/analysis/analyze`, {
        ticker
      });
      setAnalysis(response.data);
      setError('');
    } catch (err) {
      setError('Failed to analyze stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Portfolio Analysis</h1>
        <p className="text-slate-400">Deep dive into your holdings</p>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio List */}
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h2 className="text-xl font-bold text-white mb-4">Your Holdings</h2>
          <button
            onClick={loadPortfolio}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4 transition"
          >
            Load Portfolio
          </button>

          {portfolio.length === 0 ? (
            <p className="text-slate-400">No holdings. Add stocks to your portfolio first.</p>
          ) : (
            <div className="space-y-2">
              {portfolio.map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => analyzeHolding(stock.ticker)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedStock === stock.ticker
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  <p className="font-bold">{stock.ticker}</p>
                  <p className="text-sm">{stock.quantity} shares</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-slate-300">Analyzing...</div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* Price Info */}
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-2xl font-bold text-white mb-4">{analysis.ticker}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Current Price</p>
                    <p className="text-3xl font-bold text-white">${analysis.priceData.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Daily Change</p>
                    <p className={`text-3xl font-bold ${analysis.priceData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {analysis.priceData.change >= 0 ? '+' : ''}{analysis.priceData.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Claude Analysis */}
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-blue-400" /> AI Analysis
                </h3>
                <div className="text-slate-300 space-y-3 whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.analysis}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-blue-300 text-sm">
                  This is educational analysis only, not financial advice. Always do your own research and consult a financial advisor.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-slate-400">Select a holding to analyze</div>
          )}
        </div>
      </div>
    </div>
  );
}