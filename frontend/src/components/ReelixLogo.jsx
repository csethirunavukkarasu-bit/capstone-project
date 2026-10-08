export default function ReelixLogo({
  size = 'md',
  showTagline = false,
  onClick,
  className = '',
  animated = true,
}) {
  const normalizedSize =
    {
      sm: 'sm',
      small: 'sm',
      md: 'md',
      medium: 'md',
      lg: 'lg',
      large: 'lg',
      xl: 'xl',
      hero: 'hero',
    }[size] || 'md';

  const dimensions = {
    sm: { width: 140, height: 48 },
    md: { width: 190, height: 64 },
    lg: { width: 260, height: 88 },
    xl: { width: 340, height: 115 },
    hero: { width: 480, height: 160 },
  }[normalizedSize];

  return (
    <div
      onClick={onClick}
      className={`reelix-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 380 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.45)) drop-shadow(0 0 28px rgba(6, 182, 212, 0.3))',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <defs>
          {/* Main 3D Purple-Blue Gradients */}
          <linearGradient id="reelixPurpleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="30%" stopColor="#A855F7" />
            <stop offset="65%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="reelixCyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          <linearGradient id="reelixFilmstripGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Filmstrip Ribbon Swoosh Orbit at Base */}
        <g className={animated ? 'pulse-glow' : ''}>
          <path
            d="M 15 95 C 40 120, 140 125, 235 98 C 300 80, 340 65, 365 72"
            stroke="url(#reelixFilmstripGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Filmstrip Sprocket Holes */}
          <path
            d="M 28 98 L 33 100 M 45 103 L 50 105 M 62 107 L 67 109 M 79 110 L 84 111 M 97 111 L 102 111"
            stroke="#121029"
            strokeWidth="4"
            strokeLinecap="square"
          />
        </g>

        {/* 2. Stylized Capital "R" with Film Reels & Camera Lens */}
        <g transform="translate(15, 8)">
          {/* Dual Camera Reels on top of R */}
          <circle cx="28" cy="18" r="12" fill="url(#reelixPurpleBlueGrad)" />
          <circle cx="28" cy="18" r="5" fill="#0B0A17" />
          <circle cx="50" cy="14" r="14" fill="url(#reelixCyanBlueGrad)" />
          <circle cx="50" cy="14" r="6" fill="#0B0A17" />

          {/* Camera Lens Triangle pointing right on top right of R */}
          <polygon points="76,16 92,26 76,36" fill="#06B6D4" filter="url(#neonGlow)" />

          {/* Main "R" Body */}
          <path
            d="M 20 28 L 60 28 C 76 28, 86 38, 86 52 C 86 64, 76 74, 60 74 L 42 74 L 68 108 L 48 108 L 24 74 L 20 74 Z"
            fill="url(#reelixPurpleBlueGrad)"
            rx="6"
          />

          {/* Play Triangle Inside "R" Loop */}
          <polygon points="42,42 58,51 42,60" fill="#00F2FE" filter="url(#neonGlow)" />
        </g>

        {/* 3. Wordmark Letters "E E L i X" */}
        <g transform="translate(108, 38)" fill="url(#reelixPurpleBlueGrad)">
          {/* First E */}
          <path d="M 0 5 L 26 5 L 26 17 L 12 17 L 12 28 L 24 28 L 24 39 L 12 39 L 12 51 L 28 51 L 28 63 L 0 63 Z" rx="4" />

          {/* Second E */}
          <path d="M 34 5 L 60 5 L 60 17 L 46 17 L 46 28 L 58 28 L 58 39 L 46 39 L 46 51 L 62 51 L 62 63 L 34 63 Z" rx="4" />

          {/* L */}
          <path d="M 68 5 L 80 5 L 80 51 L 96 51 L 96 63 L 68 63 Z" rx="4" />

          {/* i with glowing dot */}
          <g>
            <circle cx="106" cy="12" r="6" fill="#38BDF8" filter="url(#neonGlow)" />
            <path d="M 100 24 L 112 24 L 112 63 L 100 63 Z" rx="3" />
          </g>

          {/* X with Diagonal Swoosh & Neon Light Burst */}
          <g transform="translate(122, 0)">
            {/* Base X shape */}
            <path
              d="M 4 8 L 22 34 L 4 63 L 17 63 L 30 44 L 43 63 L 56 63 L 38 34 L 54 8 L 41 8 L 30 25 L 18 8 Z"
              fill="url(#reelixCyanBlueGrad)"
            />
            {/* Dynamic Diagonal Overlap Swoosh */}
            <path
              d="M -5 50 C 15 35, 40 20, 62 5 L 52 -2 C 30 15, 8 30, -12 42 Z"
              fill="#06B6D4"
              filter="url(#neonGlow)"
            />
            {/* 3 Neon Burst Rays at top right of X */}
            <g stroke="#EC4899" strokeWidth="3.5" strokeLinecap="round" filter="url(#neonGlow)">
              <line x1="58" y1="-8" x2="63" y2="-17" />
              <line x1="66" y1="-2" x2="74" y2="-8" />
              <line x1="68" y1="8" x2="77" y2="6" />
            </g>
          </g>
        </g>
      </svg>

      {showTagline && (
        <span
          style={{
            fontSize: normalizedSize === 'sm' ? 9 : 11,
            fontWeight: 800,
            letterSpacing: '0.3em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          Watch. Create. Repeat.
        </span>
      )}
    </div>
  );
}
