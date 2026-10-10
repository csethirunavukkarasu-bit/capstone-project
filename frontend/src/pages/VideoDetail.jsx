import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function VideoDetail() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const res = await api.get(`/videos/${id}`)
        setVideo(res.data.data)
        setLiked(res.data.data.isLiked)
        setLikeCount(res.data.data.likeCount)
        loadComments()
      } catch (err) {
        console.error('Failed to load video', err)
      } finally {
        setLoading(false)
      }
    }
    loadVideo()
  }, [id])

  const loadComments = async () => {
    try {
      const res = await api.get(`/videos/${id}/comments?page=0&size=20`)
      setComments(res.data.data?.content || res.data.data || [])
    } catch (err) {
      console.error('Failed to load comments', err)
    }
  }

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/videos/${id}/like`)
        setLiked(false)
        setLikeCount(prev => prev - 1)
      } else {
        await api.post(`/videos/${id}/like`)
        setLiked(true)
        setLikeCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('Like action failed', err)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      await api.post(`/videos/${id}/comments`, { content: commentText })
      setCommentText('')
      loadComments()
    } catch (err) {
      console.error('Comment failed', err)
    }
  }

  const formatCount = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  if (loading) return <div style={{ paddingTop: 80, textAlign: 'center', color: '#888' }}>Loading...</div>
  if (!video) return <div style={{ paddingTop: 80, textAlign: 'center', color: '#888' }}>Video not found</div>

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: '#000' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
        <div style={{
          background: '#111',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 24,
          border: '1px solid #333',
        }}>
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {video.videoUrl ? (
              <video src={video.videoUrl} controls style={{ width: '100%', maxHeight: '70vh' }} />
            ) : (
              <span style={{ color: '#666' }}>Video unavailable</span>
            )}
          </div>
          <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 20, marginBottom: 12 }}>{video.title}</h1>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, color: '#888', fontSize: 14 }}>
              <span>{formatCount(video.viewCount)} views</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button onClick={handleLike} style={{
                padding: '10px 20px',
                background: liked ? '#fe2c55' : '#333',
                color: '#fff',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {liked ? '♥' : '♡'} {formatCount(likeCount)}
              </button>
            </div>
            {video.description && <p style={{ color: '#ccc', lineHeight: 1.6 }}>{video.description}</p>}
          </div>
        </div>

        <div style={{ background: '#111', borderRadius: 12, padding: 24, border: '1px solid #333', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Comments</h2>
          <form onSubmit={handleComment} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: '#222',
                border: '1px solid #333',
                borderRadius: 8,
                color: '#fff',
                fontSize: 14,
              }}
            />
            <button type="submit" style={{
              padding: '10px 20px',
              background: '#fe2c55',
              color: '#fff',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
            }}>
              Post
            </button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.map(comment => (
              <div key={comment.id} style={{ borderBottom: '1px solid #222', paddingBottom: 16 }}>
                <Link to={`/profile/${comment.user?.username}`} style={{ color: '#fe2c55', fontWeight: 600, fontSize: 14 }}>
                  {comment.user?.displayName || comment.user?.username}
                </Link>
                <p style={{ color: '#ccc', marginTop: 4, fontSize: 14 }}>{comment.content}</p>
                <span style={{ color: '#666', fontSize: 12, marginTop: 4, display: 'block' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
          {comments.length === 0 && <p style={{ color: '#888', fontSize: 14 }}>No comments yet</p>}
        </div>
      </div>
    </div>
  )
}
