import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Zap,
  TrendingDown,
  BookOpen,
  Film,
  Award,
  ArrowRight,
  Calculator,
  Download,
  Eye,
  Play,
  FileText,
  Calendar,
  CheckCircle2,
  TreeDeciduous,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import {
  UserProfile,
  LearningMaterial,
  VideoItem,
  GreenActionLog,
  CarbonData,
  DEFAULT_SCHOOL,
  DEFAULT_SAMPLE_PLAN_INFO
} from '../types';
import { MaterialPreviewModal } from './MaterialPreviewModal';

interface DashboardViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  materials: LearningMaterial[];
  videos: VideoItem[];
  logs: GreenActionLog[];
  carbonData: CarbonData;
  academicYear: string;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  allUsers,
  materials,
  videos,
  logs,
  carbonData,
  academicYear,
  onNavigateTab,
}) => {
  const [selectedPreviewMaterial, setSelectedPreviewMaterial] = useState<LearningMaterial | null>(null);

  // Thống kê chính xác dựa trên dữ liệu thực tế
  const teacherCount = allUsers.filter(u => u.role === 'teacher').length;
  const studentCount = allUsers.filter(u => u.role === 'student').length;
  const totalCo2Weekly = carbonData.totalKgCO2e || 0;
  const totalSavedCo2 = Number(logs.reduce((acc, l) => acc + (l.savedCO2Kg || 0), 0).toFixed(2));
  const totalPoints = logs.reduce((acc, l) => acc + (l.points || 0), 0);

  // Danh sách các tài liệu, hình ảnh, video mới nhất ở khu vực bên phải màn hình theo mục 5
  const recentMaterials = materials.slice(0, 5);
  const recentVideos = videos.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                🌱 Hệ sinh thái Lớp học Xanh EcoBot
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                Năm học: {academicYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Chào mừng, <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">{currentUser.name}</span>!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Dự án chuyển đổi số phục vụ <strong>Ngày hội Nhà giáo Sáng tạo 2026</strong>. Đồng hành cùng <strong>{currentUser.school || DEFAULT_SCHOOL}</strong> trong mô phỏng dấu chân carbon và trợ lý AI soạn kế hoạch bài dạy chuẩn Công văn 5512.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                {currentUser.role === 'teacher' ? '👨‍🏫 Giáo viên' : '🎓 Học sinh'}: <strong>{currentUser.grade}</strong>
              </span>
              {currentUser.department && (
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-blue-300">
                  Tổ: <strong>{currentUser.department}</strong>
                </span>
              )}
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-emerald-300">
                Mẫu: {DEFAULT_SAMPLE_PLAN_INFO}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('calculator')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" /> Mô phỏng Dấu chân Carbon
            </button>
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> 1-Click: AI Soạn Kế hoạch Bài dạy
            </button>
          </div>
        </div>
      </div>

      {/* 4 Overview Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Sĩ số thực tế */}
        <div
          onClick={() => onNavigateTab('settings')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-500 transition-colors">
              Sĩ số hệ thống thực tế
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {allUsers.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {teacherCount} Giáo viên • {studentCount} Học sinh
          </p>
        </div>

        {/* Stat 2: Dấu chân Carbon tuần */}
        <div
          onClick={() => onNavigateTab('calculator')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-500 transition-colors">
              Dấu chân tuần hiện tại
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalCo2Weekly} <span className="text-xs font-normal text-slate-400">kg CO2e</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalCo2Weekly > 0 ? `Ước tính ${(totalCo2Weekly * 52).toFixed(1)} kg / năm` : 'Chưa nhập phát thải'}
          </p>
        </div>

        {/* Stat 3: CO2 đã giảm */}
        <div
          onClick={() => onNavigateTab('journal')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-500 transition-colors">
              CO2e đã giảm thiểu
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {totalSavedCo2} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Tích lũy: {totalPoints} điểm rèn luyện
          </p>
        </div>

        {/* Stat 4: Kho học liệu & SGK */}
        <div
          onClick={() => onNavigateTab('materials')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-500 transition-colors">
              Kho Học liệu & Video
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-purple-600 dark:text-purple-400">
            {materials.length} <span className="text-xs font-normal text-slate-400">tệp</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {videos.length} Video giáo dục sinh thái
          </p>
        </div>
      </div>

      {/* Main Grid: Left side Features & Right side Recent Uploads according to Prompt 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Features & Eco Insights (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Real-time Carbon Status Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Mô phỏng Phát thải Học đường Thời gian thực
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Công thức tính: Điện (0.8 kg/kWh) • Nhựa (0.075 kg/SP) • Xe xăng (0.08 kg/km)
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('calculator')}
                className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
              >
                Mở bảng tính <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-center">
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block">
                  Điện năng
                </span>
                <span className="text-lg font-black text-amber-700 dark:text-amber-400">
                  {carbonData.electricityKwh || 0} kWh
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({(carbonData.electricityKwh * 0.8).toFixed(2)} kg CO2e)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 text-center">
                <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 block">
                  Rác nhựa dùng 1 lần
                </span>
                <span className="text-lg font-black text-rose-700 dark:text-rose-400">
                  {carbonData.singleUsePlasticCount || 0} món
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({(carbonData.singleUsePlasticCount * 0.075).toFixed(2)} kg CO2e)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 text-center">
                <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300 block">
                  Giao thông xăng
                </span>
                <span className="text-lg font-black text-blue-700 dark:text-blue-400">
                  {carbonData.petrolMotorbikeKm || 0} km
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({(carbonData.petrolMotorbikeKm * 0.08).toFixed(2)} kg CO2e)
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Mục tiêu Lớp học Xanh: Đưa mức phát thải dưới 5 kg CO2e/tuần để nhận Huy hiệu Danh dự 2026!
              </span>
              <button
                onClick={() => onNavigateTab('journal')}
                className="font-bold underline shrink-0 hover:text-emerald-950"
              >
                Xem Chứng nhận
              </button>
            </div>
          </div>

          {/* Quick AI Lesson Planner Shortcut */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Trợ lý AI Công văn 5512
              </span>
              <h4 className="text-base font-bold text-white">
                Soạn Kế hoạch Bài dạy Chuẩn 11 Môn THCS
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                Xuất file Word (.doc) chuẩn UTF-8 không giới hạn độ dài, mở trực tiếp bằng MS Word không lỗi dấu.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('planner')}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs whitespace-nowrap shadow transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Bắt đầu Soạn bài
            </button>
          </div>
        </div>

        {/* Right Column: BỔ SUNG MỤC TRỰC QUAN HIỂN THỊ NHANH DANH SÁCH TÀI LIỆU, HÌNH ẢNH, VIDEO MỚI TẢI LÊN NẰM Ở KHU VỰC BÊN PHẢI MÀN HÌNH THEO MỤC 5 (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Mục trực quan Tài liệu mới tải lên */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                  Tài liệu & SGK mới cập nhật
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('materials')}
                className="text-[11px] text-emerald-600 font-bold hover:underline"
              >
                Xem tất cả ({materials.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 hover:bg-emerald-50/50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate" title={mat.title}>
                        {mat.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {mat.subject} • {mat.grade} • {mat.fileSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Xem trực tiếp nhanh */}
                    <button
                      onClick={() => setSelectedPreviewMaterial(mat)}
                      className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors"
                      title="Xem trực tiếp tài liệu"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {/* Tải về nhanh */}
                    <a
                      href={mat.url}
                      download={mat.fileName}
                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      title="Tải về máy"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mục trực quan Video sinh thái mới */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                  Video Sinh thái mới nhất
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('videos')}
                className="text-[11px] text-purple-600 font-bold hover:underline"
              >
                Xem kho ({videos.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => onNavigateTab('videos')}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-750 hover:bg-purple-50/50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-14 h-10 rounded-lg bg-slate-900 text-purple-400 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                    <Play className="w-4 h-4 fill-purple-400" />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                      {vid.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {vid.grade} • {vid.subject || 'GDCD'} • Bởi {vid.addedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview Tài liệu từ Dashboard */}
      <MaterialPreviewModal
        material={selectedPreviewMaterial}
        onClose={() => setSelectedPreviewMaterial(null)}
      />
    </div>
  );
};
