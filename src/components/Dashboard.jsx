import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const USER_ID = 1; // For demo, using userId 1

  // Fetch portfolio on component load
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/portfolio?userId=${USER_ID}`);
      setPortfolio(response.data.portfolio);
      setError('');
    } catch (err) {
      setError('Failed to load portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (e) => {
    e.preventDefault();
    
    if (!ticker || !quantity || !entryPrice) {
      setError('All fields required');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/portfolio`, {
        userId: USER_ID,
        ticker: ticker.toUpperCase(),
        quantity: parseInt(quantity),
        entryPrice: parseFloat(entryPrice)
      });

      setSuccess('Stock added successfully!');
      setTicker('');
      setQuantity('');
      setEntryPrice('');
      setError('');

      // Refresh portfolio
      setTimeout(() => {
        fetchPortfolio();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add stock');
    }
  };

  const deleteStock = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/portfolio/${id}`);
      setSuccess('Stock removed');
      fetchPortfolio();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to delete stock');
    }
  };

  // Calculate portfolio totals
  const totalInvested = portfolio.reduce((sum, s) => sum + (s.quantity * parseFloat(s.entry_price)), 0);
  const totalValue = portfolio.reduce((sum, s) => sum + (s.quantity * (s.currentPrice || 0)), 0);
  const totalGain = totalValue - totalInvested;
  const gainPercent = totalInvested ? ((totalGain / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Manage your investment portfolio</p>
      </div>

      {/* Portfolio Summary */}
      {portfolio.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Portfolio Value</p>
              <p className="text-4xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Invested</p>
              <p className="text-4xl font-bold">${totalInvested.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Gain</p>
              <p className={`text-4xl font-bold ${totalGain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {totalGain >= 0 ? '+' : ''}{totalGain.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Return</p>
              <p className={`text-4xl font-bold ${gainPercent >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {gainPercent >= 0 ? '+' : ''}{gainPercent}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-700 text-green-300 p-4 rounded">{success}</div>}

      {/* Add Stock Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h2 className="text-xl font-bold text-white mb-4">Add Stock</h2>
          <form onSubmit={addStock} className="space-y-4">
            <input
              type="text"
              placeholder="Ticker (e.g., AAPL)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Entry Price"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              step="0.01"
              className="w-full bg-slate-600 text-white px-4 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} /> Add Stock
            </button>
          </form>
        </div>

        {/* Holdings */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Holdings</h2>
          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : portfolio.length === 0 ? (
            <div className="bg-slate-700 rounded-lg p-8 text-center border border-slate-600 border-dashed">
              <p className="text-slate-400">No stocks in portfolio yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolio.map((stock) => {
                const gainLoss = (stock.quantity * stock.currentPrice) - (stock.quantity * parseFloat(stock.entry_price));
                const gainPercent = ((gainLoss / (stock.quantity * parseFloat(stock.entry_price))) * 100).toFixed(2);
                
                return (
                  <div key={stock.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white">{stock.ticker}</h3>
                      <p className="text-slate-400 text-sm">{stock.quantity} shares @ ${parseFloat(stock.entry_price).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${(stock.quantity * stock.currentPrice).toFixed(2)}</p>
                      <p className={`text-sm font-semibold ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {gainLoss >= 0 ? <TrendingUp className="inline mr-1" size={16} /> : <TrendingDown className="inline mr-1" size={16} />}
                        {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(2)} ({gainPercent}%)
                      </p>
                    </div>
                    <button
                      onClick={() => deleteStock(stock.id)}
                      className="ml-4 text-slate-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}