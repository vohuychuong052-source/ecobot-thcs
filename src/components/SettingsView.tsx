import React, { useState, useEffect } from 'react';
import { VideoItem, UserProfile } from '../types';
import { INITIAL_VIDEOS } from '../utils/storage';

interface VideoLibraryViewProps {
  currentUser: UserProfile;
}

export const VideoLibraryView: React.FC<VideoLibraryViewProps> = ({ currentUser }) => {
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('ecobot_videos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VIDEOS;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [grade, setGrade] = useState('Khối 8');
  const [subject, setSubject] = useState('Giáo dục công dân');
  const [tag, setTag] = useState('Môi trường');

  useEffect(() => {
    localStorage.setItem('ecobot_videos', JSON.stringify(videos));
  }, [videos]);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    // Tự động chuyển đổi link Youtube thông thường thành link Embed
    let embedUrl = url;
    if (url.includes('watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const newVideo: VideoItem = {
      id: 'vid_' + Date.now(),
      title,
      description,
      url,
      embedUrl,
      grade,
      subject,
      tag,
      addedBy: currentUser.name,
      addedAt: new Date().toISOString().split('T')[0],
    };

    setVideos([newVideo, ...videos]);
    setTitle('');
    setDescription('');
    setUrl('');
    setIsAddModalOpen(false);
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm('Thầy có chắc chắn muốn xóa video này khỏi thư viện không?')) {
      setVideos(videos.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Thư viện Video & Tài liệu</h2>
          <p className="text-slate-500 text-sm">Kho học liệu số phục vụ giảng dạy và giáo dục môi trường</p>
        </div>
        {currentUser.role === 'teacher' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            ➕ Thêm Video Mới
          </button>
        )}
      </div>

      {/* Modal Thêm Video Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Thêm Video Bài Giảng Mới</h3>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tiêu đề video:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Tiết kiệm điện năng học đường..."
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Đường dẫn YouTube (URL):</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Khối lớp:</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  >
                    <option value="Khối 6">Khối 6</option>
                    <option value="Khối 7">Khối 7</option>
                    <option value="Khối 8">Khối 8</option>
                    <option value="Khối 9">Khối 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Môn học:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mô tả chi tiết:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700"
                >
                  Lưu Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Danh sách Video hiển thị */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-video bg-slate-100 relative">
              {vid.embedUrl ? (
                <iframe
                  src={vid.embedUrl}
                  title={vid.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs">Không có video</div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {vid.grade} • {vid.subject}
                  </span>
                  <span className="text-[10px] text-slate-400">{vid.addedAt}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{vid.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{vid.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Đăng bởi: {vid.addedBy}</span>
                {currentUser.role === 'teacher' && (
                  <button
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    🗑️ Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
