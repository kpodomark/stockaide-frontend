import { useState } from 'react';
import axios from 'axios';
import { Send, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I\'m your investment advisor. Ask me anything about investing, your portfolio strategy, or how to approach stocks. Remember: this is educational guidance, not financial advice.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [portfolioContext, setPortfolioContext] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/analysis/chat`, {
        question: userMessage,
        portfolioContext
      });

      setMessages(prev => [...prev, { role: 'assistant', text: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Investment Advisor</h1>
        <p className="text-slate-400">Ask Claude anything about investing</p>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-700 rounded-lg border border-slate-600 flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-600 text-slate-100 rounded-bl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-600 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none">
                <p className="text-sm">Claude is thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-600 p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
              className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>

          {/* Example Questions */}
          <div className="bg-slate-600 rounded p-3 text-sm">
            <p className="text-slate-300 mb-2">Try asking:</p>
            <ul className="text-slate-400 space-y-1">
              <li>• What's a good long-term investment strategy?</li>
              <li>• How do I build a diversified portfolio?</li>
              <li>• Should I be worried about market volatility?</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-900/30 border border-blue-700 rounded p-3 flex gap-2">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-blue-300 text-xs">
              This is educational information only, not personalized financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}