import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function LeftSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname;

  const currentUserName = user?.name || user?.username || 'Vera Cherry';
  const currentUserLocation = user?.location || 'Bremen, Germany';

  const currentUserAvatar = user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Vera'}`;

  const navItems = [
    { label: 'Feed', path: '/', icon: '🔥', badge: null },
    { label: 'Explore', path: '/explore', icon: '🧭', badge: 'NEW' },
    { label: 'My Favorites', path: '/favorites', icon: '🔖', badge: null },
    { label: 'Direct', path: '/direct', icon: '✈️', badge: '4' },
    { label: 'Reels TV', path: '/studio', icon: '📺', badge: null },
    { label: 'Stats', path: '/stats', icon: '📊', badge: null },
    { label: 'Settings', path: '/settings', icon: '⚙️', badge: null },
  ];

  const handleNavClick = (path) => {
    if (path === '/' || path === '/studio') {
      navigate(path);
    } else {
      // Gentle notification for demo routes
      navigate(path);
    }
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: 270,
        minWidth: 270,
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: 16,
        borderRadius: 24,
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflowY: 'auto',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* User Mini Profile Header */}
      <div
        onClick={() => navigate(`/profile/${user?.username || 'veracherry'}`)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingBottom: 16,
          borderBottom: '1px solid var(--border-color)',
          cursor: 'pointer',
        }}
      >
        <div className="avatar-story-ring" style={{ marginBottom: 10 }}>
          <img
            src={currentUserAvatar}
            alt={currentUserName}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--bg-surface)',
              background: 'var(--bg-canvas)',
            }}
          />
        </div>

        <h3
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          {currentUserName}
        </h3>
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginTop: 3,
          }}
        >
          {currentUserLocation}
        </p>

        {/* Profile Stats Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            marginTop: 16,
            padding: '10px 4px',
            background: 'var(--bg-input)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 900,
                color: 'var(--accent-purple)',
              }}
            >
              578
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: 0.5,
              }}
            >
              POSTS
            </span>
          </div>

          <div style={{ width: 1, background: 'var(--border-color)' }} />

          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 900,
                color: 'var(--accent-blue)',
              }}
            >
              37.2k
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: 0.5,
              }}
            >
              FOLLOWERS
            </span>
          </div>

          <div style={{ width: 1, background: 'var(--border-color)' }} />

          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'block',
                fontSize: 14,
                fontWeight: 900,
                color: 'var(--accent-cyan)',
              }}
            >
              989
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: 0.5,
              }}
            >
              FOLLOWING
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activePath === item.path || (item.path === '/' && activePath === '/');
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.path)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 16px',
                borderRadius: 14,
                background: isActive
                  ? 'var(--gradient-primary)'
                  : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: 14,
                textAlign: 'left',
                boxShadow: isActive ? 'var(--glow-purple)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className={isActive ? '' : 'glow-on-hover'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  style={{
                    background: isActive ? '#FFFFFF' : 'var(--gradient-funky)',
                    color: isActive ? 'var(--accent-purple)' : '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 99,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Switcher & Logout */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingTop: 12,
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <ThemeToggle showLabel={true} compact={false} />

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            borderRadius: 14,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#EF4444',
            fontWeight: 700,
            fontSize: 13,
            transition: 'all 0.2s ease',
          }}
        >
          <span>🚪</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
