// src/pages/Portfolio.jsx
import { useState } from 'react';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'holdings', label: 'Holdings' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'chat', label: 'Chat' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-slate-400">Manage your investments</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coming Soon Placeholder */}
      <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
        <div className="text-6xl mb-4">💼</div>
        <h2 className="text-2xl font-bold text-white mb-2">Portfolio Coming Soon!</h2>
        <p className="text-slate-400 mb-4">
          This is the centerpiece of StockAide. Soon you'll have:
        </p>
        <ul className="text-slate-300 text-left max-w-md mx-auto space-y-2">
          <li>• <strong>Overview:</strong> Total value, P&L, top movers</li>
          <li>• <strong>Holdings:</strong> Detailed position table with import/export</li>
          <li>• <strong>Analysis:</strong> AI portfolio review with rebalancing suggestions ⭐</li>
          <li>• <strong>Chat:</strong> Portfolio-specific AI assistant</li>
        </ul>
      </div>
    </div>
  );
}