import { useEffect } from 'react';

export default function StoryViewerModal({ story, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [story, onClose]);

  if (!story) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(11, 10, 23, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          height: 680,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: 'var(--glow-purple)',
          border: '1px solid var(--border-color)',
          background: '#000',
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            height: 3,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 99,
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'var(--gradient-funky)',
              width: '100%',
              animation: 'storyProgress 6s linear forwards',
            }}
          />
        </div>

        {/* Author Header */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={story.avatar}
              alt={story.name}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '2px solid var(--accent-purple)',
                objectFit: 'cover',
              }}
            />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#FFF' }}>
                {story.name}
              </h4>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                {story.time}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              color: '#FFF',
              border: 'none',
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Story Image Media */}
        <img
          src={story.media}
          alt={story.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Footer Interaction Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 10,
          }}
        >
          <input
            type="text"
            placeholder={`Reply to ${story.name}...`}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 99,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#FFF',
              fontSize: 13,
            }}
          />
          <button
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              color: '#FFF',
              border: 'none',
              fontSize: 18,
              boxShadow: '0 4px 15px rgba(139,92,246,0.5)',
            }}
          >
            ❤️
          </button>
        </div>
      </div>

      <style>{`
        @keyframes storyProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
