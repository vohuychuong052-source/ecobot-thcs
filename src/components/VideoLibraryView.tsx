import React, { useState } from 'react';
import {
  Film,
  Plus,
  Trash2,
  Play,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Tag,
  BookOpen
} from 'lucide-react';
import { VideoItem, UserProfile, GRADE_OPTIONS, SUBJECT_OPTIONS } from '../types';
import { storage } from '../utils/storage';

interface VideoLibraryViewProps {
  currentUser: UserProfile;
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
}

export const VideoLibraryView: React.FC<VideoLibraryViewProps> = ({
  currentUser,
  videos,
  setVideos,
}) => {
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoGradeInput, setVideoGradeInput] = useState<string>('Lớp 8');
  const [videoSubjectInput, setVideoSubjectInput] = useState<string>('Giáo dục công dân');
  const [videoDescInput, setVideoDescInput] = useState('');
  
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  // Chuyển đổi link YouTube thông thường thành link nhúng Embed
  const transformToEmbedUrl = (rawUrl: string): string => {
    let url = rawUrl.trim();
    if (!url) return '';

    // If it's already an embed URL
    if (url.includes('youtube.com/embed/')) return url;

    // Standard youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // Shortened youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    // Shorts youtube.com/shorts/ID
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&/]+)/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // Facebook embed wrapper or standard iframe src
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
    }

    return url;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!videoUrlInput.trim()) {
      setErrorMsg('Vui lòng dán đường dẫn hoặc link nhúng video YouTube / Facebook.');
      return;
    }

    const embedUrl = transformToEmbedUrl(videoUrlInput);
    if (!embedUrl) {
      setErrorMsg('Đường dẫn video không hợp lệ. Vui lòng kiểm tra lại link YouTube.');
      return;
    }

    const title = videoTitleInput.trim() || `Video Sinh thái Lớp học Xanh (${new Date().toLocaleDateString('vi-VN')})`;

    const newVideo: VideoItem = {
      id: 'vid_' + Date.now(),
      title,
      description: videoDescInput.trim() || 'Video tư liệu bài giảng bảo vệ môi trường và lớp học xanh THCS.',
      url: videoUrlInput.trim(),
      embedUrl,
      grade: videoGradeInput,
      subject: videoSubjectInput,
      tag: 'Lớp học Xanh',
      addedBy: currentUser.name,
      addedAt: new Date().toISOString().split('T')[0],
    };

    const updated = storage.addVideo(newVideo);
    setVideos(updated);
    setVideoUrlInput('');
    setVideoTitleInput('');
    setVideoDescInput('');
    setSuccessMsg('Đã thêm video mới vào Thư viện thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteVideo = (id: string) => {
    const updated = storage.deleteVideo(id);
    setVideos(updated);
    if (activeVideo?.id === id) {
      setActiveVideo(null);
    }
  };

  const filteredVideos = videos.filter((v) => {
    if (filterGrade === 'all') return true;
    return v.grade === filterGrade;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-[#0A192F] to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/30">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
          🎬 Thư Viện Video Động (Embed Only)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Thư viện Video Bài giảng & Tuyên truyền Môi trường
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Tích hợp và phát trực tiếp các thước phim khoa học, phóng sự môi trường và bài giảng sinh thái từ YouTube / Facebook phục vụ dạy và học THCS.
        </p>
      </div>

      {/* Input Form: Thêm Video mới theo mục 6 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" />
          Thêm Video mới bằng cách dán đường dẫn / Link nhúng YouTube hoặc Facebook
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Hệ thống sẽ tự động nhận diện và chuyển đổi đường link sang định dạng embed an toàn để phát trực tiếp mượt mà.
        </p>

        <form onSubmit={handleAddVideo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Input URL */}
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Đường dẫn Video (YouTube Watch, YouTu.be, Shorts hoặc Facebook Video):
              </label>
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Khối lớp */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khối lớp:
              </label>
              <select
                value={videoGradeInput}
                onChange={(e) => setVideoGradeInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Môn học */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Môn học:
              </label>
              <select
                value={videoSubjectInput}
                onChange={(e) => setVideoSubjectInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white truncate"
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tiêu đề Video:
              </label>
              <input
                type="text"
                value={videoTitleInput}
                onChange={(e) => setVideoTitleInput(e.target.value)}
                placeholder="Ví dụ: Giảm phát thải khí nhà kính trong trường học THCS..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mô tả ngắn gọn:
              </label>
              <input
                type="text"
                value={videoDescInput}
                onChange={(e) => setVideoDescInput(e.target.value)}
                placeholder="Nội dung chính hoặc thông điệp bài học..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> {successMsg}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Thêm vào Thư viện
            </button>
          </div>
        </form>
      </div>

      {/* Active Video Player (if one is selected to play) */}
      {activeVideo && (
        <div className="bg-slate-900 rounded-2xl p-5 shadow-2xl border border-emerald-500/40 text-white animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">{activeVideo.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-500/30">
                {activeVideo.grade}
              </span>
            </div>
            <button
              onClick={() => setActiveVideo(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
            >
              Thu nhỏ
            </button>
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
            <iframe
              src={activeVideo.embedUrl}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <p className="text-xs text-slate-300 mt-3">{activeVideo.description}</p>
        </div>
      )}

      {/* Videos List Header & Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-emerald-500" />
          Danh sách Video đã lưu ({filteredVideos.length})
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Lọc khối lớp:</span>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="all">Tất cả Khối lớp</option>
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition-all group"
          >
            {/* Embed preview container */}
            <div className="aspect-video w-full bg-slate-900 relative">
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 space-y-2 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  {video.grade}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {video.subject || 'GDCD'}
                </span>
                {video.tag && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    #{video.tag}
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2" title={video.title}>
                {video.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {video.description}
              </p>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-750/50 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 text-[10px]">
                Bởi: {video.addedBy}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-500 transition-colors"
                >
                  <Play className="w-3 h-3 fill-white" /> Phát lớn
                </button>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                  title="Xóa video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
