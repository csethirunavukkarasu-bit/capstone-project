import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LogoOpener from './components/LogoOpener'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import VideoDetail from './pages/VideoDetail'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [showOpener, setShowOpener] = useState(true);

  const isFeedPage = location.pathname === '/';

  const triggerOpener = () => {
    setShowOpener(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      {showOpener && <LogoOpener onComplete={() => setShowOpener(false)} />}
      
      {user && !isFeedPage && <Navbar onLogoClick={triggerOpener} />}
      
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogoClick={triggerOpener} />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onLogoClick={triggerOpener} />} />
        <Route path="/" element={<ProtectedRoute><Feed onLogoClick={triggerOpener} /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/studio" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/video/:id" element={<ProtectedRoute><VideoDetail /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
