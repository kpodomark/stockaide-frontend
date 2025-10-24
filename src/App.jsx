import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import Analysis from './components/Analysis';
import Chat from './components/Chat';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <nav className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="max-w-7xl mx-auto flex gap-6">
            <a href="/" className="text-white font-bold text-xl">Stock Aide</a>
            <a href="/dashboard" className="text-slate-300 hover:text-white">Dashboard</a>
            <a href="/watchlist" className="text-slate-300 hover:text-white">Watchlist</a>
            <a href="/chat" className="text-slate-300 hover:text-white">Chat</a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}