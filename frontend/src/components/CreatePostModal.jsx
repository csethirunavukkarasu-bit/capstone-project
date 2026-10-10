import { useState } from 'react';
import { api } from '../services/api';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !file) {
      setError('Please add a caption or select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title || caption.slice(0, 30));
        formData.append('description', caption);

        const res = await api.post('/videos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (onPostCreated) onPostCreated(res.data.data);
      } else {
        // Fallback or demo post creation
        if (onPostCreated) {
          onPostCreated({
            id: Date.now(),
            title: title || 'New Reelix Post',
            description: caption,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
            user: { username: 'Current User', name: 'Current User' },
            likeCount: 0,
            commentCount: 0,
            createdAt: new Date().toISOString(),
          });
        }
      }
      onClose();
      setTitle('');
      setCaption('');
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(11, 10, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 540,
          borderRadius: 24,
          padding: 28,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-main)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 16,
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>✨</span>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
              Create New Post
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Title / Headline
            </label>
            <input
              type="text"
              placeholder="Give your post a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Caption & Hashtags
            </label>
            <textarea
              rows={3}
              placeholder="What's on your mind? #Creative #Funky #Reelix"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: 14,
                resize: 'none',
              }}
            />
          </div>

          {/* Media Upload Area */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Media (Video or Image)
            </label>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: previewUrl ? 12 : 28,
                borderRadius: 16,
                border: '2px dashed var(--accent-purple)',
                background: 'var(--bg-input)',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {previewUrl ? (
                <div style={{ position: 'relative', width: '100%', maxHeight: 180, borderRadius: 12, overflow: 'hidden' }}>
                  <img src={previewUrl} alt="Upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 32 }}>📁</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Drag & drop media file or <span style={{ color: 'var(--accent-purple)' }}>Browse</span>
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Supports MP4, MOV, JPG, PNG (Max 50MB)
                  </span>
                </>
              )}
              <input type="file" accept="video/*,image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 14,
                background: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 14,
                background: 'var(--gradient-funky)',
                color: '#FFF',
                fontWeight: 800,
                fontSize: 14,
                boxShadow: 'var(--glow-purple)',
                opacity: uploading ? 0.7 : 1,
              }}
            >
              {uploading ? 'Publishing...' : '🚀 Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
