import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Authcontext';
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState(null);

  // Mock portfolio data
  const mockHoldings = [
    {
      id: 'AAPL',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 50,
      avgCost: 165.00,
      currentPrice: 178.72,
      sector: 'Technology',
      purchaseDate: new Date('2024-03-15')
    },
    {
      id: 'MSFT',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      quantity: 30,
      avgCost: 380.00,
      currentPrice: 398.45,
      sector: 'Technology',
      purchaseDate: new Date('2024-04-10')
    },
    {
      id: 'GOOGL',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      quantity: 40,
      avgCost: 145.50,
      currentPrice: 142.35,
      sector: 'Technology',
      purchaseDate: new Date('2024-05-20')
    },
    {
      id: 'JNJ',
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      quantity: 25,
      avgCost: 158.00,
      currentPrice: 162.40,
      sector: 'Healthcare',
      purchaseDate: new Date('2024-06-05')
    },
    {
      id: 'V',
      symbol: 'V',
      name: 'Visa Inc.',
      quantity: 20,
      avgCost: 245.00,
      currentPrice: 268.90,
      sector: 'Financial',
      purchaseDate: new Date('2024-07-12')
    }
  ];

  useEffect(() => {
    loadPortfolio();
  }, [currentUser]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      // TODO: Load from Firebase
      setHoldings(mockHoldings);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setHoldings(mockHoldings);
    } finally {
      setLoading(false);
    }
  };

  // Calculate portfolio metrics
  const calculateMetrics = () => {
    let totalCost = 0;
    let totalValue = 0;
    let bestPerformer = { symbol: '', gainPercent: -Infinity };
    let worstPerformer = { symbol: '', gainPercent: Infinity };

    holdings.forEach(holding => {
      const cost = holding.quantity * holding.avgCost;
      const value = holding.quantity * holding.currentPrice;
      const gainPercent = ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100;

      totalCost += cost;
      totalValue += value;

      if (gainPercent > bestPerformer.gainPercent) {
        bestPerformer = { symbol: holding.symbol, gainPercent };
      }
      if (gainPercent < worstPerformer.gainPercent) {
        worstPerformer = { symbol: holding.symbol, gainPercent };
      }
    });

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    return {
      totalCost,
      totalValue,
      totalGain,
      totalGainPercent,
      bestPerformer,
      worstPerformer
    };
  };

  const metrics = holdings.length > 0 ? calculateMetrics() : null;

  const handleRemoveHolding = (stockId) => {
    if (confirm(`Remove ${stockId} from portfolio?`)) {
      setHoldings(holdings.filter(h => h.id !== stockId));
    }
  };

  const handleAnalyze = (symbol) => {
    navigate('/research', { state: { symbol } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-700 rounded-xl"></div>
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
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-slate-400">
            Track your investments • {holdings.length} {holdings.length === 1 ? 'holding' : 'holdings'}
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            ℹ️ <strong>Demo Mode:</strong> Showing mock portfolio data.
          </p>
        </div>

        {/* Empty State */}
        {holdings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Holdings Yet</h2>
            <p className="text-slate-400 mb-6">
              Start building your portfolio by adding stocks from your watchlist
            </p>
            <button
              onClick={() => navigate('/watchlist')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Go to Watchlist
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Total Value Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-semibold">TOTAL VALUE</span>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-sm ${metrics.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metrics.totalGain >= 0 ? '+' : ''}${Math.abs(metrics.totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  ({metrics.totalGain >= 0 ? '+' : ''}{metrics.totalGainPercent.toFixed(2)}%)
                </div>
              </div>

              {/* Best Performer Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-semibold">BEST PERFORMER</span>
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {metrics.bestPerformer.symbol}
                </div>
                <div className="text-sm text-green-400">
                  +{metrics.bestPerformer.gainPercent.toFixed(2)}%
                </div>
              </div>

              {/* Worst Performer Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-semibold">WORST PERFORMER</span>
                  <span className="text-2xl">📉</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {metrics.worstPerformer.symbol}
                </div>
                <div className="text-sm text-red-400">
                  {metrics.worstPerformer.gainPercent.toFixed(2)}%
                </div>
              </div>

            </div>

            {/* Holdings Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              
              {/* Table Header */}
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Holdings</h2>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Cost</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Price</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Value</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Gain/Loss</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {holdings.map(holding => {
                      const totalCost = holding.quantity * holding.avgCost;
                      const totalValue = holding.quantity * holding.currentPrice;
                      const gain = totalValue - totalCost;
                      const gainPercent = (gain / totalCost) * 100;

                      return (
                        <tr key={holding.id} className="hover:bg-slate-700/30 transition-colors">
                          
                          {/* Stock Info */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-white font-semibold">{holding.symbol}</div>
                              <div className="text-sm text-slate-400">{holding.name}</div>
                              <div className="text-xs text-slate-500 mt-1">
                                {holding.sector}
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="px-6 py-4 text-right text-white font-semibold">
                            {holding.quantity}
                          </td>

                          {/* Avg Cost */}
                          <td className="px-6 py-4 text-right text-slate-300">
                            ${holding.avgCost.toFixed(2)}
                          </td>

                          {/* Current Price */}
                          <td className="px-6 py-4 text-right">
                            <div className="text-white font-semibold">
                              ${holding.currentPrice.toFixed(2)}
                            </div>
                            <div className={`text-xs ${holding.currentPrice >= holding.avgCost ? 'text-green-400' : 'text-red-400'}`}>
                              {holding.currentPrice >= holding.avgCost ? '▲' : '▼'} 
                              {Math.abs(((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100).toFixed(2)}%
                            </div>
                          </td>

                          {/* Total Value */}
                          <td className="px-6 py-4 text-right text-white font-semibold">
                            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>

                          {/* Gain/Loss */}
                          <td className="px-6 py-4 text-right">
                            <div className={`font-semibold ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {gain >= 0 ? '+' : ''}${Math.abs(gain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className={`text-xs ${gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ({gain >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleAnalyze(holding.symbol)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                                title="Analyze"
                              >
                                📊
                              </button>
                              <button
                                onClick={() => setEditingHolding(holding)}
                                className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-lg transition-colors"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleRemoveHolding(holding.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                                title="Remove"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-sm">Total Cost Basis: </span>
                    <span className="text-white font-semibold">
                      ${metrics.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-semibold transition-colors"
                  >
                    ➕ Add Holding
                  </button>
                </div>
              </div>

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default Portfolio;