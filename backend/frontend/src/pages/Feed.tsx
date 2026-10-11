import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feedApi } from '../api';
import type { VideoDto, Page } from '../types';
import ReelixLogo from '../components/ReelixLogo';

type Tab = 'latest' | 'trending' | 'following';

export default function Feed() {
  const [tab, setTab] = useState<Tab>('latest');
  const [page, setPage] = useState(0);
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setVideos([]);
    setPage(0);
    setHasMore(true);
  }, [tab]);

  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);
    const fetcher = tab === 'latest' ? feedApi.latest : tab === 'trending' ? feedApi.trending : feedApi.following;
    fetcher(page, 10)
      .then((res) => {
        const pageData = res.data as Page<VideoDto>;
        setVideos((prev) => (page === 0 ? pageData.content : [...prev, ...pageData.content]));
        setHasMore(!pageData.last);
      })
      .catch(() => {/* ignore */})
      .finally(() => setLoading(false));
  }, [tab, page]);

  const loadMore = () => {
    if (!loading && hasMore) setPage((p) => p + 1);
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 pt-3 pb-1 flex items-center justify-between">
          <Link to="/" className="inline-block">
            <ReelixLogo size="sm" />
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
            LIVE
          </span>
        </div>
        <div className="max-w-lg mx-auto flex">
          {(['latest', 'trending', 'following'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold capitalize transition ${
                tab === t ? 'text-white border-b-2 border-pink-500' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>


      <div className="max-w-lg mx-auto">
        {videos.map((video) => (
          <Link key={video.id} to={`/video/${video.id}`} className="block border-b border-white/5">
            <div className="flex items-start gap-3 p-3">
              <img src={video.user.profilePictureUrl || '/avatar.png'} alt="" className="w-10 h-10 rounded-full bg-gray-800 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm truncate">{video.user.displayName}</span>
                  <span className="text-gray-500 text-xs">@{video.user.username}</span>
                </div>
                <p className="text-white text-sm mt-1 line-clamp-2">{video.title}</p>
                <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                  <span>{video.viewCount} views</span>
                  <span>{video.likeCount} likes</span>
                  <span>{video.commentCount} comments</span>
                </div>
              </div>
            </div>
            <div className="relative bg-gray-900 aspect-video">
              <img src={video.thumbnailUrl || ''} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
              </span>
            </div>
          </Link>
        ))}
        {loading && <div className="text-center text-gray-400 py-4">Loading...</div>}
        {!loading && hasMore && (
          <button onClick={loadMore} className="w-full py-3 text-pink-400 text-sm font-semibold">
            Load more
          </button>
        )}
        {!hasMore && videos.length > 0 && <div className="text-center text-gray-500 py-4 text-sm">No more videos</div>}
        {!loading && videos.length === 0 && <div className="text-center text-gray-400 py-12">No videos yet</div>}
      </div>
    </div>
  );
}
