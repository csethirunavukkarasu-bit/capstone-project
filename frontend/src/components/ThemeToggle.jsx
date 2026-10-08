import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ showLabel = true, compact = false }) {
  const { toggleTheme, isDark } = useTheme();


  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? 6 : 10,
        padding: compact ? '6px 12px' : '8px 16px',
        borderRadius: 99,
        background: isDark
          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)'
          : 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
        border: `1.5px solid ${isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(124, 58, 237, 0.3)'}`,
        color: isDark ? '#E9D5FF' : '#4C1D95',
        fontSize: compact ? 12 : 14,
        fontWeight: 700,
        boxShadow: isDark
          ? '0 0 12px rgba(139, 92, 246, 0.25)'
          : '0 2px 10px rgba(124, 58, 237, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      className="glow-on-hover"
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? 20 : 24,
          height: compact ? 20 : 24,
          borderRadius: '50%',
          background: isDark ? '#8B5CF6' : '#FFB703',
          color: isDark ? '#FFF' : '#1A153B',
          fontSize: compact ? 11 : 13,
          boxShadow: isDark
            ? '0 0 8px #8B5CF6'
            : '0 0 8px #FFB703',
          transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'transform 0.4s ease, background 0.3s ease',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
      {showLabel && (
        <span style={{ letterSpacing: '0.3px' }}>
          {isDark ? 'Dark Theme' : 'Light Theme'}
        </span>
      )}
    </button>
  );
}
