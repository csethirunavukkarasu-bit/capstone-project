import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReelixLogo from '../components/ReelixLogo';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
    bio: '',
    profilePictureUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-pink-500 text-sm text-center font-medium bg-pink-500/10 p-2.5 rounded-lg border border-pink-500/20">{error}</p>}
          <input className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all" placeholder="Display Name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required />
          <input className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all" placeholder="Bio (optional)" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <input className="w-full px-4 py-3 bg-gray-900/90 text-white rounded-xl border border-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all" placeholder="Profile Picture URL (optional)" value={form.profilePictureUrl} onChange={(e) => setForm({ ...form, profilePictureUrl: e.target.value })} />
          <button type="submit" disabled={loading} className="w-full py-3.5 reelix-gradient-bg hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold tracking-wide transition shadow-lg shadow-pink-500/25 active:scale-[0.98]">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

