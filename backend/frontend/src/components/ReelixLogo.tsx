interface ReelixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  animated?: boolean;
}


export default function ReelixLogo({
  size = 'md',
  showTagline = false,
  className = '',
  animated = true,
}: ReelixLogoProps) {
  const letters = ['R', 'e', 'e', 'l', 'i', 'x'];

  const sizeStyles = {
    sm: { text: 'text-xl', icon: 20, gap: 'gap-1.5', tagline: 'text-[9px]' },
    md: { text: 'text-3xl', icon: 28, gap: 'gap-2', tagline: 'text-[11px]' },
    lg: { text: 'text-4xl', icon: 36, gap: 'gap-2.5', tagline: 'text-xs' },
    xl: { text: 'text-5xl sm:text-6xl', icon: 48, gap: 'gap-3', tagline: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="reelix-logo-wrapper group relative" role="banner" aria-label="Reelix Logo">
        {/* Ambient Sparkle Dots */}
        {animated && (
          <>
            <span
              className="reelix-sparkle w-1.5 h-1.5 bg-cyan-400 -top-1 right-2"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="reelix-sparkle w-2 h-2 bg-pink-500 -bottom-1 left-4"
              style={{ animationDelay: '0.7s' }}
            />
            <span
              className="reelix-sparkle w-1.5 h-1.5 bg-purple-400 top-1/2 -right-3"
              style={{ animationDelay: '1.2s' }}
            />
          </>
        )}

        {/* Funky Reel / Play Icon */}
        <div className={`flex items-center justify-center rounded-xl reelix-gradient-bg p-1.5 shadow-lg shadow-pink-500/20 mr-2 transform group-hover:rotate-12 transition-transform duration-300`}>
          <svg
            width={sizeStyles.icon * 0.75}
            height={sizeStyles.icon * 0.75}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="6 3 20 12 6 21 6 3" fill="white" />
          </svg>
        </div>

        {/* Staggered Animated Wordmark */}
        <span
          className={`font-black tracking-tight font-reelix ${sizeStyles.text} reelix-gradient-text reelix-glow select-none flex items-center`}
        >
          {letters.map((char, index) => (
            <span
              key={index}
              className={animated ? `reelix-letter reelix-letter-delay-${index}` : 'inline-block'}
            >
              {char}
            </span>
          ))}
        </span>
      </div>

      {/* Subtitle / Tagline */}
      {showTagline && (
        <p
          className={`font-semibold tracking-[0.25em] text-gray-400 uppercase mt-2 font-reelix ${sizeStyles.tagline} text-center`}
        >
          Watch. Create. Repeat.
        </p>
      )}
    </div>
  );
}
