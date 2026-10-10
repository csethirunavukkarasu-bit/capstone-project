import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import VideoCard from '../components/VideoCard'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/users/${username}`)
        setProfile(res.data.data)
        setFollowing(res.data.data.isFollowing)
        setVideos(res.data.data.videos?.content || [])
      } catch (err) {
        console.error('Failed to load profile', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [username])

  const handleFollow = async () => {
    try {
      if (following) {
        await api.delete(`/users/${profile.id}/follow`)
      } else {
        await api.post(`/users/${profile.id}/follow`)
      }
      setFollowing(!following)
      setProfile(prev => ({
        ...prev,
        followerCount: following ? prev.followerCount - 1 : prev.followerCount + 1,
      }))
    } catch (err) {
      console.error('Follow action failed', err)
    }
  }

  if (loading) return <div style={{ paddingTop: 80, textAlign: 'center', color: '#888' }}>Loading...</div>
  if (!profile) return <div style={{ paddingTop: 80, textAlign: 'center', color: '#888' }}>User not found</div>

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: '#000' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px' }}>
        <div style={{
          background: '#111',
          borderRadius: 12,
          padding: 40,
          marginBottom: 24,
          border: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            color: '#666',
            overflow: 'hidden',
          }}>
            {profile.profilePictureUrl ? (
              <img src={profile.profilePictureUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profile.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>{profile.displayName || profile.username}</h1>
            <p style={{ color: '#888', marginBottom: 12 }}>@{profile.username}</p>
            {profile.bio && <p style={{ color: '#ccc', marginBottom: 16 }}>{profile.bio}</p>}
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <div><strong>{profile.followerCount}</strong> <span style={{ color: '#888' }}>Followers</span></div>
              <div><strong>{profile.followingCount}</strong> <span style={{ color: '#888' }}>Following</span></div>
            </div>
            {!profile.isSelf && (
              <button onClick={handleFollow} style={{
                padding: '10px 24px',
                background: following ? '#333' : '#fe2c55',
                color: '#fff',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
              }}>
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Videos</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}>
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        {videos.length === 0 && <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>No videos yet</p>}
      </div>
    </div>
  )
}
