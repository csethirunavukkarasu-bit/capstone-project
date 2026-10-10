import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const PRESET_MUSIC = [
  { id: 'none', name: 'Original Audio Only', url: '' },
  { id: 'pop', name: 'Upbeat Pop Beat', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
  { id: 'electronic', name: 'Cyberpunk Synthwave', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a14b56.mp3' },
  { id: 'chill', name: 'Lofi Chill Hop', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' }
];

const FILTERS = [
  { id: 'none', name: 'Normal', filterStr: 'none' },
  { id: 'cyberpunk', name: 'Cyberpunk', filterStr: 'contrast(130%) saturate(180%) hue-rotate(190deg)' },
  { id: 'vintage', name: 'Vintage Warm', filterStr: 'sepia(40%) contrast(110%) brightness(105%)' },
  { id: 'sepia', name: 'Sepia', filterStr: 'sepia(100%)' },
  { id: 'grayscale', name: 'B&W Mono', filterStr: 'grayscale(100%)' },
  { id: 'contrast', name: 'High Contrast', filterStr: 'contrast(160%) brightness(95%)' },
  { id: 'sunset', name: 'Sunset Glow', filterStr: 'saturate(200%) hue-rotate(-20deg) brightness(110%)' }
];

export default function VideoStudio() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState(0)
  
  // Edit Controls State
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [selectedMusic, setSelectedMusic] = useState('none')
  const [musicVolume, setMusicVolume] = useState(0.5)
  const [videoVolume, setVideoVolume] = useState(1.0)
  
  // Text Overlay State
  const [overlayText, setOverlayText] = useState('')
  const [textColor, setTextColor] = useState('#ffffff')
  const [textPos, setTextPos] = useState('center') // top, center, bottom
  const [textSize, setTextSize] = useState(24)
  
  // Form Metadata
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Entertainment',
    tags: 'short, creator, studio',
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  
  const videoRef = useRef(null)
  const bgAudioRef = useRef(null)
  const navigate = useNavigate()

  // Handle Video Selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      const url = URL.createObjectURL(selected)
      setVideoUrl(url)
      if (!form.title) {
        setForm(prev => ({ ...prev, title: selected.name.replace(/\.[^/.]+$/, "") }))
      }
    }
  }

  // Handle Video Metadata Loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vidDuration = videoRef.current.duration || 0
      setDuration(vidDuration)
      setStartTime(0)
      setEndTime(vidDuration)
    }
  }

  // Sync Video Trim Boundaries
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime >= endTime && endTime > 0) {
        videoRef.current.currentTime = startTime
      }
    }
  }

  // Update Playback Speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  // Update Video & Music Audio Volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = videoVolume
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = musicVolume
    }
  }, [videoVolume, musicVolume])

  // Submit & Publish
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!file) {
      setError('Please upload a video to edit and publish.')
      return
    }
    setUploading(true)

    try {
      const data = new FormData()
      data.append('file', file)
      
      const editMetadata = {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags,
        edits: {
          trimStart: startTime,
          trimEnd: endTime,
          filter: selectedFilter,
          speed: playbackSpeed,
          musicTrack: selectedMusic,
          textOverlay: {
            text: overlayText,
            color: textColor,
            position: textPos,
            size: textSize
          }
        }
      }
      data.append('metadata', JSON.stringify(editMetadata))

      const res = await api.post('/videos/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      if (res.data && res.data.data) {
        navigate(`/video/${res.data.data.id}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish video. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const currentFilterObj = FILTERS.find(f => f.id === selectedFilter) || FILTERS[0]
  const currentMusicObj = PRESET_MUSIC.find(m => m.id === selectedMusic)

  return (
    <div style={{ paddingTop: 75, minHeight: '100vh', background: '#0a0a0c', color: '#fff', paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, background: 'linear-gradient(45deg, #fe2c55, #ff6b81)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Short Video Studio & Editor
            </h1>
            <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: 14 }}>
              Upload, trim, add music, filters, and text overlay before publishing.
            </p>
          </div>
          {file && (
            <button
              onClick={() => { setFile(null); setVideoUrl(''); }}
              style={{
                background: '#222',
                border: '1px solid #444',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Change Video
            </button>
          )}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(254, 44, 85, 0.15)', border: '1px solid #fe2c55', color: '#fe2c55', borderRadius: 8, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Step 1: Upload Dropzone if no video selected */}
        {!file ? (
          <div style={{
            background: '#121216',
            border: '2px dashed #333',
            borderRadius: 16,
            padding: '60px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border 0.2s ease',
          }}>
            <input
              type="file"
              accept="video/*"
              id="video-input"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="video-input" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(254,44,85,0.1)', color: '#fe2c55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: 28 }}>
                🎬
              </div>
              <h2 style={{ fontSize: 20, marginBottom: 8, fontWeight: 600 }}>Select Video to Edit & Publish</h2>
              <p style={{ color: '#888', fontSize: 14, maxWidth: 400, margin: '0 auto 20px auto' }}>
                Supports MP4, WebM, MOV. High quality short-form video editor with real-time effects.
              </p>
              <span style={{
                background: '#fe2c55',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: 24,
                fontWeight: 600,
                fontSize: 15,
                display: 'inline-block'
              }}>
                Select File
              </span>
            </label>
          </div>
        ) : (
          /* Step 2: Main Studio Studio Workspace */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            
            {/* Left Column: Video Preview & Interactive Tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Video Player Canvas Card */}
              <div style={{
                background: '#121216',
                borderRadius: 16,
                border: '1px solid #222',
                padding: 16,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                minHeight: 420,
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', width: '100%', maxHeight: 480, display: 'flex', justifyContent: 'center' }}>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 460,
                      borderRadius: 12,
                      filter: currentFilterObj.filterStr,
                      objectFit: 'contain'
                    }}
                  />
                  
                  {/* Dynamic Text Overlay */}
                  {overlayText && (
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: textPos === 'top' ? '15%' : textPos === 'center' ? '45%' : '80%',
                      color: textColor,
                      fontSize: `${textSize}px`,
                      fontWeight: 800,
                      textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.9)',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '6px 16px',
                      borderRadius: 8,
                      backdropFilter: 'blur(4px)',
                      pointerEvents: 'none',
                      textAlign: 'center',
                      maxWidth: '85%'
                    }}>
                      {overlayText}
                    </div>
                  )}
                </div>

                {/* Hidden Background Audio Player for Preset Music */}
                {currentMusicObj && currentMusicObj.url && (
                  <audio ref={bgAudioRef} src={currentMusicObj.url} autoPlay loop />
                )}
              </div>

              {/* Editing Controls Tab Suite */}
              <div style={{ background: '#121216', borderRadius: 16, border: '1px solid #222', padding: 20 }}>
                <h3 style={{ fontSize: 16, marginTop: 0, marginBottom: 16, color: '#eee', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚡ Editor Controls
                </h3>

                {/* Trim Video Section */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: '#aaa' }}>Trim Range</span>
                    <span style={{ color: '#fe2c55', fontWeight: 600 }}>
                      {startTime.toFixed(1)}s - {endTime.toFixed(1)}s (Duration: {(endTime - startTime).toFixed(1)}s)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <label style={{ fontSize: 12, color: '#777' }}>Start</label>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={startTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (val < endTime) {
                          setStartTime(val)
                          if (videoRef.current) videoRef.current.currentTime = val
                        }
                      }}
                      style={{ flex: 1, accentColor: '#fe2c55' }}
                    />
                    <label style={{ fontSize: 12, color: '#777' }}>End</label>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={endTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (val > startTime) {
                          setEndTime(val)
                        }
                      }}
                      style={{ flex: 1, accentColor: '#fe2c55' }}
                    />
                  </div>
                </div>

                {/* Filters Section */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#aaa', marginBottom: 10 }}>Color & Visual Filter</label>
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                    {FILTERS.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFilter(f.id)}
                        style={{
                          background: selectedFilter === f.id ? '#fe2c55' : '#1c1c22',
                          color: '#fff',
                          border: selectedFilter === f.id ? '1px solid #fe2c55' : '1px solid #333',
                          padding: '6px 14px',
                          borderRadius: 20,
                          fontSize: 13,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Playback Speed Section */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#aaa', marginBottom: 10 }}>Playback Speed</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(spd => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPlaybackSpeed(spd)}
                        style={{
                          flex: 1,
                          background: playbackSpeed === spd ? 'rgba(254,44,85,0.2)' : '#1c1c22',
                          color: playbackSpeed === spd ? '#fe2c55' : '#ccc',
                          border: playbackSpeed === spd ? '1px solid #fe2c55' : '1px solid #333',
                          padding: '6px 0',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Music Overlay & Audio Mix */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, color: '#aaa', marginBottom: 10 }}>Music & Audio Overlay</label>
                  <select
                    value={selectedMusic}
                    onChange={(e) => setSelectedMusic(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1c1c22',
                      border: '1px solid #333',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 14,
                      marginBottom: 10
                    }}
                  >
                    {PRESET_MUSIC.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>

                  {selectedMusic !== 'none' && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Music Volume</label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={musicVolume}
                          onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: '#fe2c55' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Video Audio</label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={videoVolume}
                          onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: '#fe2c55' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Overlay Tool */}
                <div>
                  <label style={{ display: 'block', fontSize: 14, color: '#aaa', marginBottom: 10 }}>Add Text Overlay</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Type overlay text..."
                      value={overlayText}
                      onChange={(e) => setOverlayText(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: '#1c1c22',
                        border: '1px solid #333',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14
                      }}
                    />
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{
                        width: 44,
                        height: 42,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title="Text Color"
                    />
                  </div>

                  {overlayText && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <select
                        value={textPos}
                        onChange={(e) => setTextPos(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#1c1c22',
                          border: '1px solid #333',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: 13
                        }}
                      >
                        <option value="top">Top Position</option>
                        <option value="center">Center Position</option>
                        <option value="bottom">Bottom Position</option>
                      </select>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#888' }}>Size</span>
                        <input
                          type="number"
                          min={14}
                          max={48}
                          value={textSize}
                          onChange={(e) => setTextSize(parseInt(e.target.value) || 24)}
                          style={{
                            width: 60,
                            padding: '6px 8px',
                            background: '#1c1c22',
                            border: '1px solid #333',
                            borderRadius: 8,
                            color: '#fff',
                            fontSize: 13
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Right Column: Publish Details Sidebar */}
            <div>
              <div style={{ background: '#121216', borderRadius: 16, border: '1px solid #222', padding: 20, position: 'sticky', top: 90 }}>
                <h3 style={{ fontSize: 18, marginTop: 0, marginBottom: 20, fontWeight: 700 }}>
                  Publish Video
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6 }}>Title</label>
                    <input
                      type="text"
                      placeholder="Give your short video a catchy title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#1c1c22',
                        border: '1px solid #333',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6 }}>Description</label>
                    <textarea
                      placeholder="Describe your video, mention creators, etc."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#1c1c22',
                        border: '1px solid #333',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14,
                        resize: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6 }}>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#1c1c22',
                        border: '1px solid #333',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="Entertainment">Entertainment</option>
                      <option value="Music">Music</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Education">Education</option>
                      <option value="Tech">Tech</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6 }}>Tags / Hashtags</label>
                    <input
                      type="text"
                      placeholder="e.g. viral, dance, tech"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#1c1c22',
                        border: '1px solid #333',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Edit Summary Badge */}
                  <div style={{ background: '#1a1a22', borderRadius: 8, padding: 12, border: '1px dashed #333', fontSize: 12, color: '#888' }}>
                    <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Summary of Edits:</div>
                    • Trim: {startTime.toFixed(1)}s - {endTime.toFixed(1)}s<br />
                    • Speed: {playbackSpeed}x | Filter: {currentFilterObj.name}<br />
                    • Music: {currentMusicObj?.name || 'None'}
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    style={{
                      marginTop: 10,
                      padding: '14px',
                      background: uploading ? '#666' : 'linear-gradient(45deg, #fe2c55, #ff6b81)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 15px rgba(254, 44, 85, 0.4)',
                      transition: 'transform 0.1s ease'
                    }}
                  >
                    {uploading ? 'Processing & Publishing...' : '🚀 Export & Publish'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
