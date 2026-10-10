import { useState, useEffect } from 'react';
import { api } from '../services/api';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import StoryViewerModal from '../components/StoryViewerModal';
import ThemeToggle from '../components/ThemeToggle';
import ReelixLogo from '../components/ReelixLogo';

export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);

  // Fallback demo posts if backend has empty database
  const demoPosts = [
    {
      id: 'demo-1',
      authorName: 'Masudur Rahman',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Bremen, Germany',
      mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80',
      type: 'image',
      description: 'Apply for a feature following the link in our bio and we will publish your photos in our account: @travelsfever #Wanderlust #Architecture #Reelix',
      likeCount: 28500,
      commentCount: 33,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      authorName: 'Sophia Vance',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      location: 'Tokyo, Japan',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'video',
      description: 'Night lights of Shibuya Crossing! Exploring the futuristic cityscapes of Japan 🌃✨ #TokyoNights #Cyberpunk #Vibe',
      likeCount: 42100,
      commentCount: 89,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      authorName: 'Ben Schade',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Berlin, Germany',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      type: 'image',
      description: 'Abstract digital render experiments using Blender & Three.js 🎨 Violet glow & liquid metal dynamics!',
      likeCount: 19800,
      commentCount: 45,
      createdAt: new Date().toISOString(),
    }
  ];

  const loadFeed = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feed/latest?page=0&size=10');
      const fetched = res.data?.data?.content || res.data?.data || [];
      if (fetched.length > 0) {
        setVideos(fetched);
      } else {
        setVideos(demoPosts);
      }
    } catch (err) {
      console.warn('Backend offline or empty, rendering demo posts:', err);
      setVideos(demoPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handlePostCreated = (newPost) => {
    setVideos((prev) => [newPost, ...prev]);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        padding: '16px 24px 40px 24px',
        maxWidth: 1440,
        margin: '0 auto',
      }}
    >
      {/* ==========================================================================
         TOP HEADER BAR
         ========================================================================== */}
      <header
        className="glass-panel"
        style={{
          borderRadius: 24,
          padding: '12px 24px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          position: 'sticky',
          top: 12,
          zIndex: 100,
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ReelixLogo size="medium" />
        </div>

        {/* Center Search Bar + Create Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flex: 1,
            maxWidth: 620,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 99,
              padding: '6px 18px',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: 16, color: 'var(--text-muted)', marginRight: 10 }}>🔍</span>
            <input
              type="text"
              placeholder="Search creators, hashtags, posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: 14,
              }}
            />
            <span style={{ fontSize: 16, cursor: 'pointer', color: 'var(--text-muted)' }}>🎤</span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 99,
              background: 'var(--gradient-funky)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 13,
              boxShadow: 'var(--glow-purple)',
              whiteSpace: 'nowrap',
            }}
            className="glow-on-hover"
          >
            <span style={{ fontSize: 16 }}>+</span>
            <span>Create new Post</span>
          </button>
        </div>

        {/* Top Right Action Icons & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeToggle showLabel={false} compact={true} />

          <button
            title="Messages"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: 18,
              position: 'relative',
            }}
          >
            ✈️
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#EC4899',
                border: '2px solid var(--bg-surface)',
              }}
            />
          </button>

          <button
            title="Notifications"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: 18,
              position: 'relative',
            }}
          >
            🔔
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#10B981',
                border: '2px solid var(--bg-surface)',
              }}
            />
          </button>

          <button
            title="Menu"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: 18,
            }}
          >
            ☰
          </button>
        </div>
      </header>

      {/* ==========================================================================
         MAIN 3-COLUMN DASHBOARD GRID
         ========================================================================== */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* Left Column Sidebar */}
        <LeftSidebar />

        {/* Center Main Feed Column */}
        <main
          style={{
            flex: 1,
            maxWidth: 640,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Stories Horizontal Bar */}
          <div
            className="glass-panel"
            style={{
              borderRadius: 24,
              padding: '18px 20px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <StoriesBar
              onAddStoryClick={() => setIsCreateModalOpen(true)}
              onSelectStory={(story) => setActiveStory(story)}
            />
          </div>

          {/* Feeds Sub-Header & Tab Filters */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px',
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.4px',
              }}
            >
              Feeds ✨
            </h2>

            {/* Filter Toggle Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-card)',
                padding: 4,
                borderRadius: 99,
                border: '1px solid var(--border-color)',
              }}
            >
              {['Latest', 'Popular', 'Following'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 99,
                      background: isActive ? 'var(--gradient-primary)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: 13,
                      boxShadow: isActive ? '0 2px 8px rgba(139,92,246,0.3)' : 'none',
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Stream */}
          {loading ? (
            <div
              className="glass-panel"
              style={{
                padding: 40,
                textAlign: 'center',
                borderRadius: 24,
                color: 'var(--text-muted)',
              }}
            >
              <span style={{ fontSize: 32 }}>✨</span>
              <p style={{ marginTop: 12, fontWeight: 700 }}>Loading feeds...</p>
            </div>
          ) : (
            videos.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </main>

        {/* Right Column Sidebar */}
        <RightSidebar onCreatePostClick={() => setIsCreateModalOpen(true)} />
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <StoryViewerModal
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
