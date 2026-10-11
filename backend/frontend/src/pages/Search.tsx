import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi } from '../api';
import type { UserDto } from '../types';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await usersApi.search(q, 0, 20);
      setResults((res.data as { content: UserDto[] }).content);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 bg-black/90 backdrop-blur-md p-4 border-b border-white/10">
        <form onSubmit={handleSearch} className="max-w-lg mx-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users..."
            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none"
          />
        </form>
      </div>
      <div className="max-w-lg mx-auto p-4">
        {loading && <p className="text-gray-400 text-center py-4">Searching...</p>}
        {!loading && results.map((u) => (
          <Link key={u.id} to={`/user/${u.username}`} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition">
            <img src={u.profilePictureUrl || '/avatar.png'} alt="" className="w-10 h-10 rounded-full bg-gray-800 object-cover" />
            <div>
              <p className="font-semibold text-sm">{u.displayName}</p>
              <p className="text-gray-400 text-xs">@{u.username}</p>
            </div>
          </Link>
        ))}
        {!loading && results.length === 0 && q && <p className="text-gray-500 text-center py-8">No users found</p>}
        {!loading && !q && <p className="text-gray-500 text-center py-8">Search for users to see results</p>}
      </div>
    </div>
  );
}
