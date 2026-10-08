import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReelixLogo from '../components/ReelixLogo'

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'rgba(10, 10, 15, 0.9)',
        padding: 40,
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <ReelixLogo size="xl" showTagline />
        </div>
        {error && <p style={{ color: '#FF2A85', marginBottom: 16, fontSize: 14, textAlign: 'center', background: 'rgba(255, 42, 133, 0.1)', padding: 10, borderRadius: 8 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            placeholder="Username or Email"
            value={form.usernameOrEmail}
            onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
            required
            style={{
              padding: '12px 16px',
              background: '#16161f',
              border: '1px solid #2a2a38',
              borderRadius: 10,
              color: '#fff',
              fontSize: 14,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{
              padding: '12px 16px',
              background: '#16161f',
              border: '1px solid #2a2a38',
              borderRadius: 10,
              color: '#fff',
              fontSize: 14,
            }}
          />
          <button type="submit" className="reelix-gradient-bg" style={{
            padding: '14px',
            color: '#fff',
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            marginTop: 8,
            boxShadow: '0 4px 20px rgba(255, 42, 133, 0.3)',
          }}>
            Log in
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#888' }}>
          Don't have an account? <Link to="/register" style={{ color: '#00F2FE', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

