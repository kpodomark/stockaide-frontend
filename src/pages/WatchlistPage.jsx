// src/pages/WatchlistPage.jsx
export default function WatchlistPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-slate-400">Track stocks you're interested in</p>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="bg-slate-700 rounded-lg p-12 border border-slate-600 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-white mb-2">Watchlist Coming Soon!</h2>
        <p className="text-slate-400 mb-4">
          We're building this feature. Soon you'll be able to:
        </p>
        <ul className="text-slate-300 text-left max-w-md mx-auto space-y-2">
          <li>• Save stocks from Research for monitoring</li>
          <li>• Track price movements and news</li>
          <li>• Set price alerts</li>
          <li>• Quick analyze watched stocks</li>
          <li>• Move to Portfolio when ready to buy</li>
        </ul>
      </div>
    </div>
  );
}