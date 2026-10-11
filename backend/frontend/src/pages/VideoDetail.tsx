import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videosApi, socialApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import type { VideoDto, CommentDto, EngagementPredictionDto, Page } from '../types';


export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [video, setVideo] = useState<VideoDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [prediction, setPrediction] = useState<EngagementPredictionDto | null>(null);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      videosApi.getById(id),
      socialApi.getComments(id, 0, 50),
      videosApi.getAiPrediction(id),
    ])
      .then(([vRes, cRes, pRes]) => {
        const v = vRes.data as VideoDto;
        setVideo(v);
        setLiked(v.isLiked);
        setComments((cRes.data as Page<CommentDto>).content);
        setPrediction(pRes.data);
      })
      .catch(() => {/* ignore */})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!video || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [video]);

  const handleLike = async () => {
    if (!id) return;
    try {
      if (liked) {
        await socialApi.unlike(id);
        setLiked(false);
        setVideo((v) => v ? { ...v, likeCount: v.likeCount - 1 } : null);
      } else {
        await socialApi.like(id);
        setLiked(true);
        setVideo((v) => v ? { ...v, likeCount: v.likeCount + 1 } : null);
      }
    } catch { /* ignore */ }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await socialApi.addComment(id, { content: commentText });
      setComments((prev) => [res.data, ...prev]);
      setCommentText('');
      setVideo((v) => v ? { ...v, commentCount: v.commentCount + 1 } : null);
    } catch { /* ignore */ }
    finally { setCommentLoading(false); }
  };

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!video) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Video not found</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative max-w-lg mx-auto">
        <Link to="/" className="absolute top-4 left-4 z-10 bg-black/50 rounded-full p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </Link>
        <div className="relative bg-black aspect-[9/16] max-h-[70vh]">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            controls
            playsInline
            loop
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Link to={`/user/${video.user.username}`}>
              <img src={video.user.profilePictureUrl || '/avatar.png'} alt="" className="w-10 h-10 rounded-full bg-gray-800 object-cover" />
            </Link>
            <div>
              <Link to={`/user/${video.user.username}`} className="font-semibold text-sm block">{video.user.displayName}</Link>
              <span className="text-gray-400 text-xs">@{video.user.username}</span>
            </div>
          </div>

          <h2 className="font-semibold text-lg">{video.title}</h2>
          {video.description && <p className="text-gray-300 text-sm">{video.description}</p>}

          <div className="flex items-center gap-6">
            <button onClick={handleLike} className={`flex items-center gap-1 ${liked ? 'text-pink-500' : 'text-gray-400'}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              <span className="text-sm">{formatNumber(video.likeCount)}</span>
            </button>
            <span className="flex items-center gap-1 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              <span className="text-sm">{formatNumber(video.commentCount)}</span>
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              <span className="text-sm">{formatNumber(video.viewCount)}</span>
            </span>
          </div>

          {prediction && (
            <div className="bg-gray-900 rounded-lg p-3 space-y-1">
              <h3 className="text-sm font-semibold text-pink-400">AI Engagement Prediction</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div>Predicted Views: {formatNumber(prediction.predictedViews)}</div>
                <div>Like Ratio: {(prediction.predictedLikeRatio * 100).toFixed(1)}%</div>
                <div>Completion: {(prediction.predictedCompletionRate * 100).toFixed(1)}%</div>
                <div>Viral Score: {prediction.viralScore.toFixed(1)}</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Comments</h3>
            {user && (
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 text-sm focus:border-pink-500 focus:outline-none"
                />
                <button type="submit" disabled={commentLoading} className="px-4 py-2 bg-pink-500 rounded-lg text-sm font-semibold disabled:bg-pink-700">
                  Post
                </button>
              </form>
            )}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <img src={c.user.profilePictureUrl || '/avatar.png'} alt="" className="w-8 h-8 rounded-full bg-gray-800 object-cover flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold">{c.user.displayName}</span>
                    <p className="text-sm text-gray-300">{c.content}</p>
                    <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-gray-500 text-sm">No comments yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
