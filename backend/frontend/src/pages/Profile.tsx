import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersApi, feedApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfileDto, VideoDto, Page } from '../types';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: me, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'liked'>('videos');

  useEffect(() => {
    const targetUsername = username || me?.username;
    if (!targetUsername) return;
    setLoading(true);
    Promise.all([
      usersApi.getProfile(targetUsername),
      feedApi.latest(0, 50),
    ])
      .then(([pRes, fRes]) => {
        setProfile(pRes.data);
        setVideos((fRes.data as Page<VideoDto>).content.filter((v) => v.user.username === targetUsername));
      })
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  }, [username, me?.username]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      if (profile.isFollowing) {
        await usersApi.unfollow(profile.id);
        setProfile({ ...profile, isFollowing: false, followerCount: profile.followerCount - 1 });
      } else {
        await usersApi.follow(profile.id);
        setProfile({ ...profile, isFollowing: true, followerCount: profile.followerCount + 1 });
      }
    } catch { /* ignore */ }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!profile) return <div className="min-h-screen bg-black flex items-center justify-center text-white">User not found</div>;

  const isSelf = me?.username === profile.username;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-lg mx-auto">
        <div className="relative h-32 bg-gradient-to-b from-pink-900/40 to-black" />
        <div className="px-4 -mt-12">
          <img
            src={profile.profilePictureUrl || '/avatar.png'}
            alt=""
            className="w-24 h-24 rounded-full border-4 border-black bg-gray-800 object-cover"
          />
          <div className="mt-3">
            <h1 className="text-xl font-bold">{profile.displayName}</h1>
            <p className="text-gray-400 text-sm">@{profile.username}</p>
          </div>
          <p className="mt-2 text-sm text-gray-300">{profile.bio || 'No bio yet'}</p>
          <div className="flex gap-6 mt-3 text-sm">
            <div><span className="font-bold text-white">{profile.followingCount}</span> <span className="text-gray-400">Following</span></div>
            <div><span className="font-bold text-white">{profile.followerCount}</span> <span className="text-gray-400">Followers</span></div>
          </div>
          {!isSelf && (
            <button
              onClick={handleFollow}
              className={`mt-3 px-6 py-2 rounded-lg font-semibold text-sm ${
                profile.isFollowing ? 'bg-gray-800 text-white' : 'bg-pink-500 text-white'
              }`}
            >
              {profile.isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {isSelf && (
            <div className="mt-3 flex gap-2">
              <button onClick={logout} className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Log Out</button>
            </div>
          )}
        </div>
        <div className="flex border-b border-white/10 mt-4">
          <button onClick={() => setActiveTab('videos')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'videos' ? 'text-white border-b-2 border-pink-500' : 'text-gray-400'}`}>Videos</button>
          <button onClick={() => setActiveTab('liked')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'liked' ? 'text-white border-b-2 border-pink-500' : 'text-gray-400'}`}>Liked</button>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1">
          {activeTab === 'videos' && videos.map((v) => (
            <Link key={v.id} to={`/video/${v.id}`} className="aspect-[9/16] bg-gray-900 relative">
              <img src={v.thumbnailUrl || ''} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                {Math.floor(v.duration / 60)}:{String(Math.floor(v.duration % 60)).padStart(2, '0')}
              </span>
            </Link>
          ))}
          {activeTab === 'liked' && <div className="col-span-3 text-center text-gray-500 py-8 text-sm">Liked videos will appear here</div>}
        </div>
      </div>
    </div>
  );
}
