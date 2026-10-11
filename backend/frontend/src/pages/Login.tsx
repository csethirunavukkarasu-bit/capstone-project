import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReelixLogo from '../components/ReelixLogo';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(usernameOrEmail, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-950/80 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <ReelixLogo size="xl" showTagline />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-pink-500 text-sm text-center font-medium bg-pink-500/10 p-2.5 rounded-lg border border-pink-500/20">{error}</p>}
          <div>
            <label className="block text-gray-300 text-sm mb-1 font-medium">Username or Email</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 reelix-gradient-bg hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold tracking-wide transition shadow-lg shadow-pink-500/25 active:scale-[0.98]"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

