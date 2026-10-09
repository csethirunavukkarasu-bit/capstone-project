import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RightSidebar({ onCreatePostClick }) {
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      name: 'Webuistylist',
      handle: '@webuistylist',
      location: 'Elk Grove, California',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isFollowing: false,
    },
    {
      id: 2,
      name: 'Anghelina',
      handle: '@anghelina_design',
      location: 'Sibiu, Romania',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      isFollowing: false,
    },
    {
      id: 3,
      name: 'Mais Designer',
      handle: '@mais_ui',
      location: 'Kyiv, Ukraine',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isFollowing: true,
    },
    {
      id: 4,
      name: 'Josh e-Sport',
      handle: '@josh_esports',
      location: 'Elk Grove, California',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isFollowing: false,
    },
  ]);

  const trendingThumbnails = [
    {
      id: 101,
      title: 'Cyber Neon Art',
      views: '42.8k',
      img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 102,
      title: 'Handmade Pottery',
      views: '29.1k',
      img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 103,
      title: 'Wild Nature',
      views: '88.4k',
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 104,
      title: 'Espresso Moments',
      views: '15.9k',
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const toggleFollow = (id) => {
    setSuggestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFollowing: !item.isFollowing } : item
      )
    );
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: 310,
        minWidth: 310,
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: 16,
        borderRadius: 24,
        padding: '22px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        overflowY: 'auto',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* 1. Trending Feeds Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <h4
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.2px',
            }}
          >
            Trending Feeds 🔥
          </h4>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--accent-purple)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/explore')}
          >
            See all
          </span>
        </div>

        {/* 2x2 Grid of Media Thumbnails */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {trendingThumbnails.map((thumb) => (
            <div
              key={thumb.id}
              onClick={() => navigate('/explore')}
              style={{
                position: 'relative',
                borderRadius: 14,
                overflow: 'hidden',
                height: 95,
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
              }}
              className="glow-on-hover"
            >
              <img
                src={thumb.img}
                alt={thumb.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(11, 10, 23, 0.85) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 8,
                }}
              >
                <span
                  style={{
                    color: '#FFF',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  👁️ {thumb.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border-color)' }} />

      {/* 2. Suggestions for You Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <h4
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}
          >
            Suggestions for you ✨
          </h4>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--accent-purple)',
              cursor: 'pointer',
            }}
          >
            Refresh
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestions.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid var(--accent-purple)',
                  }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <h5
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {item.name}
                  </h5>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {item.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(item.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 99,
                  background: item.isFollowing
                    ? 'var(--bg-input)'
                    : 'var(--gradient-primary)',
                  border: item.isFollowing
                    ? '1px solid var(--border-color)'
                    : 'none',
                  color: item.isFollowing
                    ? 'var(--text-muted)'
                    : '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 800,
                  boxShadow: item.isFollowing
                    ? 'none'
                    : '0 2px 8px rgba(139,92,246,0.3)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {item.isFollowing ? 'Following' : '+ Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border-color)' }} />

      {/* 3. Profile Activity Banner & Create Post CTA */}
      <div
        style={{
          background: 'var(--gradient-card-header)',
          border: '1px solid var(--border-color)',
          borderRadius: 18,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              marginLeft: 6,
            }}
          >
            {['Vera', 'Alex', 'Sarah', 'Dev'].map((seed, idx) => (
              <img
                key={seed}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                alt="Active User"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1.5px solid var(--bg-surface)',
                  marginLeft: idx === 0 ? 0 : -8,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--accent-purple)',
              background: 'rgba(139, 92, 246, 0.15)',
              padding: '2px 8px',
              borderRadius: 99,
            }}
          >
            LIVE
          </span>
        </div>

        <div>
          <h4
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: 'var(--text-primary)',
            }}
          >
            24.3k <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Followers</span>
          </h4>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              marginTop: 2,
            }}
          >
            ⚡ Active now on your profile
          </p>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          The perfect time for uploading your new post. Connect with your community right now!
        </p>

        <button
          onClick={onCreatePostClick}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 14,
            background: 'var(--gradient-funky)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 13,
            boxShadow: 'var(--glow-purple)',
            marginTop: 4,
          }}
          className="glow-on-hover"
        >
          ✨ Create New Post
        </button>
      </div>
    </aside>
  );
}
