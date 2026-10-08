import { useEffect, useState } from 'react';
import ReelixLogo from './ReelixLogo';
import { playBrandOpenerSound } from '../utils/WebAudioOpener';

export default function LogoOpener({ onComplete }) {
  const [stage, setStage] = useState('initial'); // initial -> active -> burst -> fadeOut
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    // Play sound effect if not muted
    if (!muted) {
      playBrandOpenerSound();
    }

    const t1 = setTimeout(() => setStage('active'), 200);
    const t2 = setTimeout(() => setStage('burst'), 1200);
    const t3 = setTimeout(() => setStage('fadeOut'), 2700);
    const t4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [muted, onComplete]);

  const handleSkip = () => {
    setStage('fadeOut');
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#070612',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: stage === 'fadeOut' ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: stage === 'fadeOut' ? 'none' : 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)',
          top: '20%',
          left: '25%',
          filter: 'blur(60px)',
          animation: 'orbFloat 6s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 450,
          height: 450,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          bottom: '20%',
          right: '25%',
          filter: 'blur(60px)',
          animation: 'orbFloat 8s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Center 3D Logo Container with Perspective */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            transform:
              stage === 'initial'
                ? 'scale(0.4) rotateX(25deg) rotateY(-20deg) translateZ(-150px)'
                : stage === 'active'
                ? 'scale(1.2) rotateX(8deg) rotateY(-5deg) translateZ(30px)'
                : 'scale(1) rotateX(0deg) rotateY(0deg) translateZ(0px)',
            opacity: stage === 'initial' ? 0 : 1,
            transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease',
            filter: stage === 'burst' ? 'drop-shadow(0 0 45px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 60px rgba(6, 182, 212, 0.6))' : 'none',
          }}
        >
          <ReelixLogo size="hero" showTagline={false} animated={true} />
        </div>

        {/* Tagline Reveal */}
        <div
          style={{
            marginTop: 28,
            opacity: stage === 'burst' || stage === 'fadeOut' ? 1 : 0,
            transform: stage === 'burst' || stage === 'fadeOut' ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.6s ease 0.3s',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '0.45em',
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
            }}
          >
            WATCH. CREATE. REPEAT.
          </span>
        </div>
      </div>

      {/* Top Right Controls: Mute Toggle & Skip Button */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setMuted((prev) => !prev)}
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
          style={{
            padding: '8px 14px',
            borderRadius: 99,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFF',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {muted ? '🔇 Muted' : '🔊 Sound ON'}
        </button>

        <button
          onClick={handleSkip}
          style={{
            padding: '8px 16px',
            borderRadius: 99,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            color: '#FFF',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Skip ▶
        </button>
      </div>

      <style>{`
        @keyframes orbFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -40px) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
