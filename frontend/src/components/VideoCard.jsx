import { Link } from 'react-router-dom'

export default function VideoCard({ video }) {
  const formatCount = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Link to={`/video/${video.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
      <div style={{
        background: '#111',
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{
          width: '100%',
          aspectRatio: '9/16',
          background: '#222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#666', fontSize: 14 }}>No thumbnail</span>
          )}
        </div>
        <div style={{ padding: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {video.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>{video.user?.displayName || video.user?.username}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#888' }}>
            <span>{formatCount(video.viewCount)} views</span>
            <span>{formatCount(video.likeCount)} likes</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
