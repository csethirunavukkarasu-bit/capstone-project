import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { videosApi } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Please <a href="/login" className="text-pink-400 underline">log in</a> to upload.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify({ title, description, category, tags }));
    try {
      const res = await videosApi.upload(formData);
      navigate(`/video/${res.data.id}`);
    } catch (err: unknown) {

      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-pink-500 transition"
          >
            {preview ? (
              <video src={preview} controls className="max-h-64 mx-auto rounded" />
            ) : (
              <div>
                <svg className="mx-auto mb-2" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                <p className="text-gray-400">Tap to select a video</p>
              </div>
            )}
            <input ref={inputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
          </div>
          <input className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <input className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-pink-500 focus:outline-none" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <button type="submit" disabled={uploading || !file} className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-700 rounded-lg font-semibold transition">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
}
