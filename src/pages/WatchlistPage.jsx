import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Authcontext';
//import { WatchlistService } from '../services/WatchlistService.js';
import { useNavigate } from 'react-router-dom';

const WatchlistPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Mock data for demonstration (remove when Firebase works)
  const mockWatchlist = [
    {
      id: 'AAPL',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 178.72,
      priceChange: 2.45,
      priceChangePercent: 1.39,
      addedAt: new Date('2024-10-20'),
      notes: 'Strong product ecosystem. Waiting for dip below $170 to add more.',
      entryScore: 8,
      qualityGrade: 'A'
    },
    {
      id: 'GOOGL',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      currentPrice: 142.35,
      priceChange: -1.20,
      priceChangePercent: -0.84,
      addedAt: new Date('2024-10-22'),
      notes: 'AI leadership with Gemini. Good value at current levels.',
      entryScore: 7,
      qualityGrade: 'A'
    },
    {
      id: 'TSLA',
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      currentPrice: 242.84,
      priceChange: 8.92,
      priceChangePercent: 3.81,
      addedAt: new Date('2024-10-24'),
      notes: '',
      entryScore: 6,
      qualityGrade: 'B+'
    }
  ];

  useEffect(() => {
    loadWatchlist();
  }, [currentUser]);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      // TODO: Uncomment when Firebase permissions are fixed
      // const stocks = await watchlistService.getWatchlist(currentUser.uid);
      // setWatchlist(stocks);
      
      // Using mock data for now
      setWatchlist(mockWatchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      // Fallback to mock data
      setWatchlist(mockWatchlist);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStock = async (stockId) => {
    try {
      // TODO: Uncomment when Firebase works
      // await watchlistService.removeFromWatchlist(currentUser.uid, stockId);
      setWatchlist(watchlist.filter(stock => stock.id !== stockId));
      console.log(`Removed ${stockId} from watchlist`);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleSaveNote = async (stockId) => {
    try {
      // TODO: Uncomment when Firebase works
      // await watchlistService.updateNote(currentUser.uid, stockId, noteText);
      setWatchlist(watchlist.map(stock => 
        stock.id === stockId ? { ...stock, notes: noteText } : stock
      ));
      setEditingNote(null);
      setNoteText('');
      console.log(`Saved note for ${stockId}`);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleAnalyze = (symbol) => {
    navigate('/research', { state: { symbol } });
  };

  const handleMoveToPortfolio = (stock) => {
    // TODO: Implement move to portfolio
    console.log('Move to portfolio:', stock);
    alert(`Moving ${stock.symbol} to portfolio - Feature coming soon!`);
  };

  const startEditingNote = (stock) => {
    setEditingNote(stock.id);
    setNoteText(stock.notes || '');
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setNoteText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Watchlist</h1>
          <p className="text-slate-400">
            Stocks you're tracking • {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'}
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            ℹ️ <strong>Demo Mode:</strong> Showing mock data while Firebase permissions are being fixed.
          </p>
        </div>

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Stocks Yet</h2>
            <p className="text-slate-400 mb-6">
              Start building your watchlist by analyzing stocks in the Research tab
            </p>
            <button
              onClick={() => navigate('/research')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Go to Research
            </button>
          </div>
        ) : (
          
          /* Stock Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map(stock => (
              <div
                key={stock.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
              >
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                    <p className="text-sm text-slate-400">{stock.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      stock.qualityGrade.startsWith('A') ? 'bg-green-900/30 text-green-400' :
                      stock.qualityGrade.startsWith('B') ? 'bg-blue-900/30 text-blue-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {stock.qualityGrade}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white mb-1">
                    ${stock.currentPrice.toFixed(2)}
                  </div>
                  <div className={`flex items-center space-x-2 ${
                    stock.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className="text-lg font-semibold">
                      {stock.priceChange >= 0 ? '+' : ''}{stock.priceChange.toFixed(2)}
                    </span>
                    <span className="text-sm">
                      ({stock.priceChange >= 0 ? '+' : ''}{stock.priceChangePercent.toFixed(2)}%)
                    </span>
                    <span className="text-lg">
                      {stock.priceChange >= 0 ? '📈' : '📉'}
                    </span>
                  </div>
                </div>

                {/* Entry Score */}
                <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-400">Entry Score</span>
                    <span className="text-lg font-bold text-white">{stock.entryScore}/10</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stock.entryScore >= 8 ? 'bg-green-500' :
                        stock.entryScore >= 6 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${stock.entryScore * 10}%` }}
                    ></div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-4">
                  {editingNote === stock.id ? (
                    <div>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add your investment thesis..."
                        className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-blue-500"
                        rows="3"
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleSaveNote(stock.id)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingNote}
                          className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400 font-semibold">NOTES</span>
                        <button
                          onClick={() => startEditingNote(stock)}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          {stock.notes ? 'Edit' : 'Add note'}
                        </button>
                      </div>
                      {stock.notes ? (
                        <p className="text-sm text-slate-300 italic">"{stock.notes}"</p>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No notes yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleAnalyze(stock.symbol)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-semibold transition-colors"
                  >
                    📊 Analyze Again
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMoveToPortfolio(stock)}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-semibold transition-colors"
                    >
                      ➕ Portfolio
                    </button>
                    <button
                      onClick={() => handleRemoveStock(stock.id)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-semibold transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>

                {/* Added Date */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500">
                    Added {stock.addedAt.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WatchlistPage;