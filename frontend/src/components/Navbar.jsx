import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReelixLogo from './ReelixLogo'

export default function Navbar({ onLogoClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000,
    }}>
      <div style={{ cursor: 'pointer' }} onClick={onLogoClick}>
        <ReelixLogo size="sm" animated={true} />
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Home</Link>
        <Link to="/studio" style={{
          color: '#FFF',
          fontSize: 13,
          fontWeight: 800,
          padding: '8px 18px',
          borderRadius: 99,
          background: 'var(--gradient-funky)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: 'var(--glow-purple)',
        }}>
          <span>+</span> Studio
        </Link>
        <Link to={`/profile/${user?.username}`} style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          {user?.displayName || user?.username}
        </Link>
        <button onClick={handleLogout} style={{
          background: 'var(--bg-input)',
          color: 'var(--text-primary)',
          padding: '7px 14px',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          border: '1px solid var(--border-color)',
        }}>
          Logout
        </button>
      </div>
    </nav>
  )
}
