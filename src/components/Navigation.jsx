// src/components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';
import { Search, List, PieChart, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/research', label: 'Research', icon: Search },
    { path: '/watchlist', label: 'Watchlist', icon: List },
    { path: '/portfolio', label: 'Portfolio', icon: PieChart },
    { path: '/learn', label: 'Learn', icon: GraduationCap }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-500">📈</div>
            <h1 className="text-xl font-bold text-white">StockAide</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-slate-300 text-sm hidden md:block">
                {user?.displayName || user?.email}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}