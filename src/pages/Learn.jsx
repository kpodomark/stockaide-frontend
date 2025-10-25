import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/Authcontext';

const Learn = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested topics
  const suggestedTopics = [
    {
      icon: '📊',
      title: 'What is P/E ratio?',
      question: 'Can you explain what P/E ratio is and how to use it when evaluating stocks?'
    },
    {
      icon: '💰',
      title: 'Dollar-cost averaging',
      question: 'What is dollar-cost averaging and is it a good investment strategy?'
    },
    {
      icon: '📈',
      title: 'Value vs Growth investing',
      question: 'What\'s the difference between value investing and growth investing?'
    },
    {
      icon: '🎯',
      title: 'Portfolio diversification',
      question: 'How should I diversify my investment portfolio?'
    },
    {
      icon: '📋',
      title: 'Reading financial statements',
      question: 'How do I read and analyze a company\'s financial statements?'
    },
    {
      icon: '💵',
      title: 'Dividend investing',
      question: 'What is dividend investing and what are the pros and cons?'
    }
  ];

  // Investment glossary terms
  const glossaryTerms = [
    { term: 'Market Cap', definition: 'Total value of a company\'s outstanding shares' },
    { term: 'ROIC', definition: 'Return on Invested Capital - measures profitability' },
    { term: 'Beta', definition: 'Measures stock volatility compared to the market' },
    { term: 'Dividend Yield', definition: 'Annual dividend payment as % of stock price' },
    { term: 'Bull Market', definition: 'Period of rising stock prices and optimism' },
    { term: 'Bear Market', definition: 'Period of falling stock prices, typically -20% or more' }
  ];

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `👋 **Welcome to Investment Learning!**

I'm here to help you understand investing concepts, terminology, and strategies. Whether you're a beginner or looking to deepen your knowledge, feel free to ask me anything about:

- **Stock fundamentals** (P/E ratios, ROE, ROIC, etc.)
- **Investment strategies** (value investing, growth investing, dividend investing)
- **Portfolio management** (diversification, rebalancing, asset allocation)
- **Financial statements** (balance sheets, income statements, cash flow)
- **Market concepts** (bull/bear markets, market cap, sectors)
- **Risk management** (volatility, correlation, hedging)

**Click any suggested topic below to get started, or type your own question!**`,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('learn-chat-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 1) { // Only load if there's more than welcome message
          setMessages(parsed.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('learn-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSuggestedTopic = (question) => {
    setInputMessage(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Call your backend API here
      // For now, we'll use mock responses
      const response = await getMockResponse(messageText);
      
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock response function (replace with actual API call)
  const getMockResponse = async (question) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerQuestion = question.toLowerCase();

    // Pattern matching for common questions
    if (lowerQuestion.includes('p/e ratio') || lowerQuestion.includes('pe ratio')) {
      return `📊 **Price-to-Earnings (P/E) Ratio Explained**

The P/E ratio is one of the most widely used valuation metrics. Here's what you need to know:

**What it is:**
- P/E ratio = Stock Price ÷ Earnings Per Share (EPS)
- Shows how much investors are willing to pay for $1 of earnings

**How to interpret:**
- **Lower P/E:** Stock may be undervalued or company has challenges
- **Higher P/E:** Stock may be overvalued or company has strong growth prospects
- **Average S&P 500 P/E:** Around 15-20 historically

**Example:**
If a stock trades at $100 and earns $5 per share, the P/E is 20 (100÷5). This means investors pay $20 for every $1 of earnings.

**Important notes:**
⚠️ Compare P/E ratios within the same industry
⚠️ Use forward P/E for future earnings estimates
⚠️ Don't rely on P/E alone - combine with other metrics

**Related concepts:** PEG ratio, Price-to-Book, Price-to-Sales`;
    }

    if (lowerQuestion.includes('dollar-cost averaging') || lowerQuestion.includes('dca')) {
      return `💰 **Dollar-Cost Averaging (DCA) Strategy**

DCA is an investment strategy where you invest a fixed amount at regular intervals, regardless of price.

**How it works:**
Instead of investing $12,000 at once, you invest $1,000 per month for 12 months.

**Advantages:**
✅ Reduces impact of volatility
✅ Removes emotion from investing
✅ Lowers average cost per share over time
✅ Easy to automate
✅ Great for beginners

**Disadvantages:**
⚠️ May underperform lump-sum in rising markets
⚠️ Transaction fees can add up
⚠️ Requires discipline to maintain

**Example:**
- Month 1: Stock at $100 → Buy 10 shares ($1,000)
- Month 2: Stock at $80 → Buy 12.5 shares ($1,000)
- Month 3: Stock at $120 → Buy 8.33 shares ($1,000)
- **Average cost:** $96.77 vs market prices of $80-$120

**Best for:** Long-term investors, volatile markets, retirement accounts`;
    }

    if (lowerQuestion.includes('value') && lowerQuestion.includes('growth')) {
      return `📈 **Value vs Growth Investing**

Two fundamental investment philosophies with different approaches:

**Value Investing:**
🎯 **Strategy:** Buy undervalued stocks trading below intrinsic value
📊 **Characteristics:**
- Lower P/E ratios
- Higher dividend yields
- Established companies
- Focus on current earnings

👤 **Famous practitioners:** Warren Buffett, Benjamin Graham
📚 **Key metrics:** P/E, P/B, Dividend yield, ROIC

**Growth Investing:**
🚀 **Strategy:** Buy companies with high growth potential
📊 **Characteristics:**
- Higher P/E ratios
- Lower/no dividends
- Reinvest profits for expansion
- Focus on future earnings

👤 **Famous practitioners:** Peter Lynch, Cathie Wood
📚 **Key metrics:** Revenue growth, Earnings growth, Market share

**Which is better?**
Neither! It depends on:
- Your risk tolerance
- Time horizon
- Market conditions
- Personal goals

**Blended approach:** Many successful investors combine both strategies for balance.`;
    }

    if (lowerQuestion.includes('diversif')) {
      return `🎯 **Portfolio Diversification Guide**

Diversification reduces risk by spreading investments across different assets.

**Why diversify?**
✅ Reduces impact of any single investment failing
✅ Smooths portfolio volatility
✅ Improves risk-adjusted returns
✅ Protects against sector-specific risks

**How to diversify:**

**1. Asset Classes:**
- Stocks (60-80%)
- Bonds (15-30%)
- Cash/equivalents (5-10%)
- Alternative investments (0-10%)

**2. Sectors:**
Spread across 8-10 different sectors:
- Technology
- Healthcare
- Financial
- Consumer
- Energy
- etc.

**3. Geography:**
- Domestic (70-80%)
- International developed (15-20%)
- Emerging markets (5-10%)

**4. Company Size:**
- Large cap (60-70%)
- Mid cap (20-30%)
- Small cap (10-20%)

**Golden Rules:**
📌 No single stock should be >5-10% of portfolio
📌 No single sector should be >25-30% of portfolio
📌 Review and rebalance quarterly or annually

**Warning:** Over-diversification (owning 100+ stocks) can dilute returns!`;
    }

    if (lowerQuestion.includes('financial statement') || lowerQuestion.includes('balance sheet') || lowerQuestion.includes('income statement')) {
      return `📋 **Reading Financial Statements**

Three key financial statements tell a company's story:

**1. Income Statement (Profitability)**
Shows revenue and expenses over a period

Key items to check:
- **Revenue:** Top line growth
- **Gross Profit:** Revenue - Cost of goods sold
- **Operating Income:** Core business profitability
- **Net Income:** Bottom line earnings
- **EPS:** Earnings per share

**2. Balance Sheet (Financial Health)**
Snapshot of assets, liabilities, and equity

Key items to check:
- **Assets:** What company owns
- **Liabilities:** What company owes
- **Equity:** Shareholder ownership
- **Current Ratio:** Current Assets ÷ Current Liabilities (>1 is good)
- **Debt-to-Equity:** Total Debt ÷ Total Equity (lower is better)

**3. Cash Flow Statement (Cash Generation)**
Shows actual cash movement

Key items to check:
- **Operating Cash Flow:** Cash from business operations
- **Free Cash Flow:** Operating CF - Capital expenditures
- **Cash from Investing:** Buying/selling assets
- **Cash from Financing:** Raising/repaying capital

**Red flags to watch:**
🚩 Revenue growing but cash flow declining
🚩 High debt-to-equity ratio (>2)
🚩 Negative free cash flow for multiple years
🚩 Frequent accounting restatements

**Pro tip:** Look at 3-5 years of trends, not just one year!`;
    }

    if (lowerQuestion.includes('dividend')) {
      return `💵 **Dividend Investing Strategy**

Dividends are cash payments companies make to shareholders from profits.

**How dividends work:**
- Paid quarterly (usually)
- Expressed as $ per share or % yield
- **Dividend Yield** = Annual Dividend ÷ Stock Price

**Example:** 
Stock at $100, pays $4/year → 4% dividend yield

**Pros of dividend investing:**
✅ Regular passive income
✅ Less volatile than growth stocks
✅ Historically strong total returns
✅ Reinvestment compounds wealth
✅ Sign of financial health

**Cons:**
⚠️ Lower growth potential
⚠️ Tax implications (dividends are taxed)
⚠️ Dividends can be cut during hard times
⚠️ May miss out on high-growth opportunities

**Types of dividend stocks:**
1. **Dividend Aristocrats:** 25+ years of increasing dividends
2. **High Yield:** 4-6%+ yields (check sustainability!)
3. **Dividend Growth:** Consistently growing payouts

**Key metrics to evaluate:**
- **Payout Ratio:** Dividend ÷ Earnings (should be <70%)
- **Dividend Growth Rate:** YoY increase %
- **Free Cash Flow:** Ensure company can afford it

**Best for:** Retirees, income-focused investors, long-term wealth building

**DRIP tip:** Dividend Reinvestment Plans automatically buy more shares!`;
    }

    // Default response for other questions
    return `Thank you for your question! While I have detailed answers prepared for common topics, I'm currently in demo mode.

**For best results, try asking about:**
- P/E ratios and valuation metrics
- Dollar-cost averaging strategy
- Value vs Growth investing
- Portfolio diversification
- Reading financial statements
- Dividend investing

Or click one of the suggested topics above! 

*Note: Full AI integration coming soon for any investment question!*`;
  };

  const handleClearHistory = () => {
    if (confirm('Clear all chat history?')) {
      const welcomeMessage = messages[0];
      setMessages([welcomeMessage]);
      localStorage.removeItem('learn-chat-history');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Learn</h1>
          <p className="text-slate-400">
            Investment education and guidance • Ask anything about investing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chat Area - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700/50 text-slate-100'
                      }`}
                    >
                      <div className="prose prose-invert max-w-none">
                        {message.content.split('\n').map((line, i) => {
                          // Handle bold text
                          if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <p key={i} className="mb-2">
                                {parts.map((part, j) => 
                                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                )}
                              </p>
                            );
                          }
                          // Regular line
                          return line ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                        })}
                      </div>
                      <div className="text-xs mt-2 opacity-60">
                        {message.timestamp.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-700 bg-slate-900/50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything about investing..."
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            
            {/* Suggested Topics */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">📚 Suggested Topics</h2>
              <div className="space-y-2">
                {suggestedTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedTopic(topic.question)}
                    className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <span className="text-sm text-slate-300 group-hover:text-white">
                        {topic.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Glossary */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">📖 Quick Glossary</h2>
              <div className="space-y-3">
                {glossaryTerms.map((item, index) => (
                  <div key={index} className="border-b border-slate-700 pb-2 last:border-0">
                    <div className="text-sm font-semibold text-blue-400">{item.term}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.definition}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <button
                onClick={handleClearHistory}
                className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                🗑️ Clear Chat History
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Learn;