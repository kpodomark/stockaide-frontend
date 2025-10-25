import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MessageSquare, Send, TrendingUp, TrendingDown, MinusCircle, Clock, Trash2, Plus, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { addToWatchlist } from '../services/watchlistService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper functions for localStorage
const CHAT_STORAGE_KEY = 'stockaide_chat_history';

const saveChatToStorage = (ticker, messages) => {
  try {
    const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    
    if (!allChats[ticker]) {
      allChats[ticker] = [];
    }
    
    // Add new chat session with timestamp
    allChats[ticker].unshift({
      timestamp: new Date().toISOString(),
      messages: messages,
      messageCount: messages.length
    });
    
    // Keep only last 10 sessions per stock
    if (allChats[ticker].length > 10) {
      allChats[ticker] = allChats[ticker].slice(0, 10);
    }
    
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  } catch (error) {
    console.error('Error saving chat:', error);
  }
};

const getChatHistory = (ticker) => {
  try {
    const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    return allChats[ticker] || [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

const deleteChatSession = (ticker, timestamp) => {
  try {
    const allChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    if (allChats[ticker]) {
      allChats[ticker] = allChats[ticker].filter(session => session.timestamp !== timestamp);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
};

export default function Research() {
  const [searchTicker, setSearchTicker] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [currentSessionSaved, setCurrentSessionSaved] = useState(false);

  // Watchlist state
  const { user } = useAuth();
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  // Load saved chats when analysis changes
  useEffect(() => {
    if (analysis) {
      setSavedChats(getChatHistory(analysis.ticker));
    }
  }, [analysis]);

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
      setCurrentSessionSaved(false);
      
      // Reset chat for new stock
      const initialMessage = {
        role: 'assistant',
        content: `I've analyzed ${response.data.ticker} for you. I can see the entry score is ${response.data.insights.entryScore}/10 with a quality grade of ${response.data.quality.grade}. What would you like to know about this stock?`
      };
      setChatHistory([initialMessage]);
    } catch (err) {
      setError('Failed to analyze stock');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!analysis || !user) return;
    
    try {
      setAddingToWatchlist(true);
      await addToWatchlist(user.uid, {
        ticker: analysis.ticker,
        companyName: analysis.company?.name || analysis.ticker,
        entryScore: analysis.insights?.entryScore,
        qualityGrade: analysis.quality?.grade,
        currentPrice: analysis.priceData?.currentPrice
      });
      setInWatchlist(true);
      setTimeout(() => setInWatchlist(false), 3000); // Reset after 3 seconds
    } catch (error) {
      if (error.message === 'Stock already in watchlist') {
        alert('This stock is already in your watchlist!');
      } else {
        alert('Failed to add to watchlist. Please try again.');
      }
      console.error(error);
    } finally {
      setAddingToWatchlist(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !analysis) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    
    // Add user message to history
    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);
    setChatLoading(true);

    try {
      // Prepare context for Claude
      const contextPrompt = `You are helping an investor analyze ${analysis.ticker}. Here's the analysis data you have access to:

Company: ${analysis.company.name}
Current Price: $${analysis.priceData.currentPrice}
Entry Score: ${analysis.insights.entryScore}/10
Quality Grade: ${analysis.quality.grade}

Investment Thesis: ${analysis.insights.thesis}

Bull Case:
${analysis.insights.bullCase.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Bear Case:
${analysis.insights.bearCase.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Key Insight: ${analysis.insights.keyInsight}

Financial Metrics:
- ROIC: ${analysis.quality.metrics.roic}
- ROE: ${analysis.quality.metrics.roe}
- Profit Margin: ${analysis.quality.metrics.profitMargin}

Insider Activity: ${analysis.insiderActivity.netBuying.description}

Recent News Headlines:
${analysis.recentNews.slice(0, 3).map(n => `- ${n.headline}`).join('\n')}

The investor is asking: ${userMessage}

Provide a helpful, concise response based on the analysis data above. Reference specific data points from the analysis when relevant.`;

      const response = await axios.post(`${API_BASE_URL}/analysis/chat`, {
        message: contextPrompt,
        conversationHistory: []
      });

      // Add assistant response
      const updatedHistory = [...newHistory, { 
        role: 'assistant', 
        content: response.data.reply 
      }];
      setChatHistory(updatedHistory);
      
      // Auto-save after each exchange (if more than 2 messages)
      if (updatedHistory.length > 2 && !currentSessionSaved) {
        saveChatToStorage(analysis.ticker, updatedHistory);
        setSavedChats(getChatHistory(analysis.ticker));
        setCurrentSessionSaved(true);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory([...newHistory, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const loadChatSession = (session) => {
    setChatHistory(session.messages);
    setCurrentSessionSaved(true);
  };

  const deleteSavedChat = (timestamp, e) => {
    e.stopPropagation();
    deleteChatSession(analysis.ticker, timestamp);
    setSavedChats(getChatHistory(analysis.ticker));
  };

  const formatTransactionType = (code) => {
    const types = {
      'P': 'Purchase',
      'S': 'Sale',
      'M': 'Option Exercise',
      'A': 'Award',
      'D': 'Disposition'
    };
    return types[code] || code;
  };

  const getTransactionIcon = (code) => {
    if (code === 'P' || code === 'M') return <TrendingUp className="text-green-400" size={16} />;
    if (code === 'S') return <TrendingDown className="text-red-400" size={16} />;
    return <MinusCircle className="text-slate-400" size={16} />;
  };

  const formatChatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Stock Research</h1>
        <p className="text-slate-400">Analyze any stock with AI-powered insights</p>
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
          {/* Price Data Header */}
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{analysis.ticker}</h2>
              
              {/* Add to Watchlist Button */}
              <button
                onClick={handleAddToWatchlist}
                disabled={addingToWatchlist || inWatchlist}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  inWatchlist
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check size={18} />
                    Added to Watchlist
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {addingToWatchlist ? 'Adding...' : 'Add to Watchlist'}
                  </>
                )}
              </button>
            </div>

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

          {/* SPLIT SCREEN: Analysis + Chat */}
          <div className="grid grid-cols-5 gap-6">
            
            {/* LEFT: Analysis (3/5 width = 60%) */}
            <div className="col-span-3 space-y-6">
              
              {/* AI Analysis */}
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
                
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
              </div>

              {/* Financial Metrics */}
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

              {/* Insider Transactions Table */}
              {analysis.insiderActivity && analysis.insiderActivity.recentTransactions && analysis.insiderActivity.recentTransactions.length > 0 && (
                <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Insider Transactions</h3>
                  
                  {/* Summary Badge */}
                  <div className={`mb-4 p-3 rounded ${
                    analysis.insiderActivity.netBuying.trend === 'buying' ? 'bg-green-900/30 border border-green-700' :
                    analysis.insiderActivity.netBuying.trend === 'selling' ? 'bg-red-900/30 border border-red-700' :
                    'bg-slate-600'
                  }`}>
                    <p className="text-slate-300 text-sm">{analysis.insiderActivity.netBuying.description}</p>
                  </div>

                  {/* Transactions Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600 text-left">
                          <th className="pb-2 text-slate-400 text-sm font-semibold">Type</th>
                          <th className="pb-2 text-slate-400 text-sm font-semibold">Name</th>
                          <th className="pb-2 text-slate-400 text-sm font-semibold">Shares</th>
                          <th className="pb-2 text-slate-400 text-sm font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.insiderActivity.recentTransactions.map((transaction, idx) => (
                          <tr key={idx} className="border-b border-slate-600 last:border-0">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                {getTransactionIcon(transaction.transactionCode)}
                                <span className="text-slate-300 text-sm">
                                  {formatTransactionType(transaction.transactionCode)}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-slate-300 text-sm">{transaction.name || 'N/A'}</td>
                            <td className="py-3 text-slate-300 text-sm">
                              {transaction.share ? transaction.share.toLocaleString() : 'N/A'}
                            </td>
                            <td className="py-3 text-slate-400 text-sm">
                              {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT: Chat Panel (2/5 width = 40%) */}
            <div className="col-span-2">
              <div className="bg-slate-700 rounded-lg border border-slate-600 flex flex-col sticky top-6" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-600 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-blue-400" size={20} />
                    <h3 className="text-lg font-bold text-white">Ask About {analysis.ticker}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">Context-aware AI assistant</p>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '50vh' }}>
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg p-3 ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-600 text-slate-100'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-600 text-slate-100 rounded-lg p-3">
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-600 flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Ask a question..."
                      className="flex-1 bg-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={chatLoading}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={chatLoading || !chatMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {/* Chat History Section */}
                {savedChats.length > 0 && (
                  <div className="border-t border-slate-600 flex-shrink-0">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="text-slate-400" size={16} />
                        <h4 className="text-sm font-semibold text-slate-300">Previous Chats</h4>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {savedChats.map((session, idx) => (
                          <div
                            key={idx}
                            onClick={() => loadChatSession(session)}
                            className="flex items-center justify-between p-2 bg-slate-600 hover:bg-slate-500 rounded cursor-pointer transition group"
                          >
                            <div className="flex-1">
                              <p className="text-slate-200 text-xs">{formatChatTimestamp(session.timestamp)}</p>
                              <p className="text-slate-400 text-xs">{session.messageCount} messages</p>
                            </div>
                            <button
                              onClick={(e) => deleteSavedChat(session.timestamp, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition"
                            >
                              <Trash2 size={14} className="text-slate-300" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}