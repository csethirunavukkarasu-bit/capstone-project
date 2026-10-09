import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post }) {
  const { user } = useAuth();
  
  const [liked, setLiked] = useState(post?.isLiked || false);
  const [likesCount, setLikesCount] = useState(post?.likeCount || post?.likesCount || 28500);
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(16);
  const [showComments, setShowComments] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [shareNotice, setShareNotice] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      text: 'Absolutely stunning view! Love the historical vibes architecture 🏰✨',
      time: '15m ago',
    },
    {
      id: 2,
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Great shot! What camera lens did you use for this clarity?',
      time: '1h ago',
    },
  ]);

  const authorName = post?.user?.name || post?.authorName || 'Masudur Rahman';
  const authorLocation = post?.user?.location || post?.location || 'Bremen, Germany';
  const authorAvatar =
    post?.user?.avatarUrl ||
    post?.authorAvatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const mediaUrl =
    post?.videoUrl ||
    post?.mediaUrl ||
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000&auto=format&fit=crop&q=80';

  const isVideo = post?.videoUrl || post?.type === 'video';

  const captionText =
    post?.description ||
    post?.caption ||
    'Apply for a feature following the link in our bio and we will publish your photos in our account: @travelsfever #Wanderlust #Architecture #Reelix';

  const handleLikeToggle = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 800);
    } else {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMediaDoubleTap = () => {
    if (!liked) {
      handleLikeToggle();
    } else {
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 800);
    }
  };

  const handleSaveToggle = () => {
    setSaved((prev) => !prev);
    setSavedCount((prev) => (saved ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2500);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: user?.name || user?.username || 'You',
      avatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`,
      text: commentText,
      time: 'Just now',
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText('');
    setShowComments(true);
  };

  const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num;
  };

  return (
    <article
      className="glass-panel glow-on-hover"
      style={{
        borderRadius: 24,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 20,
      }}
    >
      {/* 1. Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar-story-ring" style={{ width: 44, height: 44, padding: 2 }}>
            <img
              src={authorAvatar}
              alt={authorName}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--bg-surface)',
              }}
            />
          </div>

          <div>
            <h4
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {authorName}
            </h4>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginTop: 2,
              }}
            >
              {authorLocation}
            </p>
          </div>
        </div>

        <button
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            width: 34,
            height: 34,
            borderRadius: '50%',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          •••
        </button>
      </div>

      {/* 2. Media Container (Double Tap to Like) */}
      <div
        onDoubleClick={handleMediaDoubleTap}
        style={{
          position: 'relative',
          borderRadius: 18,
          overflow: 'hidden',
          background: '#000',
          maxHeight: 460,
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            style={{ width: '100%', maxHeight: 460, objectFit: 'cover' }}
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Post content"
            style={{
              width: '100%',
              maxHeight: 460,
              objectFit: 'cover',
            }}
          />
        )}

        {/* Double-tap Heart Popup Animation Overlay */}
        {showHeartOverlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              background: 'rgba(0, 0, 0, 0.25)',
            }}
          >
            <span
              className="heart-pop"
              style={{
                fontSize: 96,
                filter: 'drop-shadow(0 0 25px rgba(236, 72, 153, 0.8))',
              }}
            >
              💖
            </span>
          </div>
        )}
      </div>

      {/* 3. Action Buttons Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            style={{
              background: liked
                ? 'rgba(236, 72, 153, 0.15)'
                : 'var(--bg-input)',
              border: `1px solid ${liked ? '#EC4899' : 'var(--border-color)'}`,
              color: liked ? '#EC4899' : 'var(--text-primary)',
              padding: '8px 14px',
              borderRadius: 99,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
            }}
            className={liked ? 'heart-pop' : ''}
          >
            <span style={{ fontSize: 16 }}>{liked ? '❤️' : '🤍'}</span>
            <span>{formatNumber(likesCount)} Like</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments((prev) => !prev)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '8px 14px',
              borderRadius: 99,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            <span style={{ fontSize: 16 }}>💬</span>
            <span>{comments.length} Comment</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '8px 14px',
              borderRadius: 99,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 16 }}>📢</span>
            <span>134 Share</span>
          </button>
        </div>

        {/* Save Bookmark Button */}
        <button
          onClick={handleSaveToggle}
          style={{
            background: saved ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-input)',
            border: `1px solid ${saved ? 'var(--accent-purple)' : 'var(--border-color)'}`,
            color: saved ? 'var(--accent-purple)' : 'var(--text-primary)',
            padding: '8px 14px',
            borderRadius: 99,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          <span style={{ fontSize: 16 }}>{saved ? '🔖' : '📑'}</span>
          <span>{savedCount} Saved</span>
        </button>
      </div>

      {shareNotice && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--accent-cyan)',
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(6, 182, 212, 0.15)',
          }}
        >
          🔗 Post link copied to clipboard!
        </div>
      )}

      {/* 4. Caption Text */}
      <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>
        <span style={{ fontWeight: 800, marginRight: 8, color: 'var(--accent-purple)' }}>
          {authorName}
        </span>
        {captionText}
      </div>

      {/* 5. Interactive Comments Drawer */}
      {showComments && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 12,
            background: 'var(--bg-input)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
          }}
        >
          <h5 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)' }}>
            Comments ({comments.length})
          </h5>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {comments.map((c) => (
              <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <img
                  src={c.avatar}
                  alt={c.author}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ flex: 1, background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
                      {c.author}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Quick Comment Input Bar */}
      <form
        onSubmit={handleAddComment}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingTop: 8,
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <img
          src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`}
          alt="Current User"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1.5px solid var(--accent-purple)',
          }}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 99,
            padding: '4px 14px',
          }}
        >
          <input
            type="text"
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: 13,
              padding: '8px 0',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer', fontSize: 16 }}>📎</span>
            <span style={{ cursor: 'pointer', fontSize: 16 }}>😊</span>
            <span style={{ cursor: 'pointer', fontSize: 16 }}>🖼️</span>
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: 'var(--gradient-primary)',
            color: '#FFF',
            border: 'none',
            borderRadius: 99,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 800,
            boxShadow: 'var(--glow-purple)',
          }}
        >
          Post
        </button>
      </form>
    </article>
  );
}
