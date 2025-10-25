// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Chrome } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await login();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📈</div>
          <h1 className="text-4xl font-bold text-white mb-2">StockAide</h1>
          <p className="text-slate-400">AI-powered investment research and portfolio management</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-700 rounded-lg p-8 border border-slate-600">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome size={20} />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p className="text-slate-400 text-sm text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-slate-300 text-sm">Deep Stock Research</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💼</div>
            <p className="text-slate-300 text-sm">Portfolio Analysis</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💬</div>
            <p className="text-slate-300 text-sm">AI Chat Assistant</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📊</div>
            <p className="text-slate-300 text-sm">Smart Rebalancing</p>
          </div>
        </div>
      </div>
    </div>
  );
}