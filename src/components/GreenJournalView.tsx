import React, { useState } from 'react';
import {
  Award,
  Printer,
  Plus,
  Zap,
  ShoppingBag,
  Bike,
  TreeDeciduous,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Star
} from 'lucide-react';
import { GreenActionLog, UserProfile, DEFAULT_SCHOOL } from '../types';
import { storage } from '../utils/storage';

interface GreenJournalViewProps {
  currentUser: UserProfile;
  logs: GreenActionLog[];
  setLogs: React.Dispatch<React.SetStateAction<GreenActionLog[]>>;
  academicYear: string;
}

export const GreenJournalView: React.FC<GreenJournalViewProps> = ({
  currentUser,
  logs,
  setLogs,
  academicYear,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionType, setActionType] = useState<GreenActionLog['actionType']>('electricity');
  const [actionDesc, setActionDesc] = useState('');
  const [savedCo2Input, setSavedCo2Input] = useState<number>(0.5);

  const [activeTab, setActiveTab] = useState<'journal' | 'certificate' | 'rubrics'>('journal');

  // Thống kê tiến trình
  const totalSavedCo2 = Number(logs.reduce((acc, l) => acc + (l.savedCO2Kg || 0), 0).toFixed(2));
  const totalPoints = logs.reduce((acc, l) => acc + (l.points || 0), 0);

  // Huy hiệu Xanh tự động cấp
  const badges = [
    {
      id: 'badge_elec',
      name: 'Chiến Binh Tắt Điện',
      icon: Zap,
      desc: 'Tích cực tắt thiết bị điện khi kết thúc tiết học',
      unlocked: logs.some(l => l.actionType === 'electricity'),
      color: 'from-amber-400 to-yellow-600',
    },
    {
      id: 'badge_plastic',
      name: 'Đại Sứ Giảm Nhựa',
      icon: ShoppingBag,
      desc: 'Từ chối đồ nhựa dùng một lần và mang bình nước cá nhân',
      unlocked: logs.some(l => l.actionType === 'plastic'),
      color: 'from-rose-400 to-red-600',
    },
    {
      id: 'badge_transport',
      name: 'Kiện Tướng Đi Lại Xanh',
      icon: Bike,
      desc: 'Đi bộ, đi xe đạp hoặc xe điện đến trường',
      unlocked: logs.some(l => l.actionType === 'transport'),
      color: 'from-blue-400 to-indigo-600',
    },
    {
      id: 'badge_tree',
      name: 'Người Gieo Mầm Xanh',
      icon: TreeDeciduous,
      desc: 'Chăm sóc bồn hoa, cây cảnh lớp học và sân trường',
      unlocked: logs.some(l => l.actionType === 'tree' || l.actionType === 'recycle'),
      color: 'from-emerald-400 to-green-600',
    },
    {
      id: 'badge_star',
      name: 'Ngôi Sao Sáng Tạo 2026',
      icon: Star,
      desc: 'Đạt trên 50 điểm sinh thái và có ít nhất 3 hành động xanh',
      unlocked: totalPoints >= 50 && logs.length >= 3,
      color: 'from-purple-500 to-pink-600',
    }
  ];

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;

    let points = 20;
    if (savedCo2Input >= 1) points = 35;
    if (savedCo2Input >= 2) points = 50;

    const newLog: GreenActionLog = {
      id: 'log_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      actionType,
      title: actionTitle.trim(),
      description: actionDesc.trim() || 'Hành động xanh tích cực bảo vệ môi trường trường học.',
      savedCO2Kg: Number(savedCo2Input.toFixed(2)),
      points,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = storage.addLog(newLog);
    setLogs(updated);
    setActionTitle('');
    setActionDesc('');
    setSavedCo2Input(0.5);
    setShowAddModal(false);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (No Print) */}
      <div className="no-print bg-gradient-to-r from-emerald-800 via-[#0A192F] to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              🌿 Nhật Ký Xanh & Chứng Nhận Vinh Danh 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tiến trình Rèn luyện & Chứng nhận Tiên phong Xanh
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Ghi nhận thói quen sinh thái, tự động cấp Huy hiệu Xanh và xuất Giấy chứng nhận danh giá chuẩn in ấn A4 ngang cho học sinh và giáo viên.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Ghi nhận Hành động Xanh
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-700/60">
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'journal'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            📋 Nhật ký & Huy hiệu ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'certificate'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            Giấy chứng nhận Vinh danh 2026
          </button>
          <button
            onClick={() => setActiveTab('rubrics')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'rubrics'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            📊 Đánh giá Rubrics Sinh thái
          </button>
        </div>
      </div>

      {/* TAB 1: JOURNAL & BADGES */}
      {activeTab === 'journal' && (
        <div className="no-print space-y-6 animate-in fade-in">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400">CO2e đã giảm thiểu</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {totalSavedCo2} <span className="text-xs font-normal text-slate-500">kg CO2e</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400">Điểm Sinh thái Tích lũy</span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {totalPoints} <span className="text-xs font-normal text-slate-500">điểm</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400">Huy hiệu đã mở khóa</span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {badges.filter(b => b.unlocked).length} / {badges.length}
                </div>
              </div>
            </div>
          </div>

          {/* Badges Display */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white text-base mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Hệ thống Huy hiệu Xanh Lớp học EcoBot
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      b.unlocked
                        ? 'bg-slate-50 dark:bg-slate-750 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-100/60 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center shadow-md mb-2 bg-gradient-to-br ${
                        b.unlocked ? b.color + ' text-white' : 'from-slate-300 to-slate-400 text-slate-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {b.name}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {b.desc}
                    </p>
                    <span
                      className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        b.unlocked
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {b.unlocked ? '✓ Đã đạt được' : 'Chưa mở khóa'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Log History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Lịch sử Hoạt động Xanh ({logs.length})
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                + Ghi thêm việc tốt
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/80">
              {logs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {log.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>Bởi: <strong>{log.userName}</strong></span>
                        <span>•</span>
                        <span>Ngày: {log.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      -{log.savedCO2Kg} kg CO2e
                    </span>
                    <span className="block text-[11px] text-amber-500 font-bold mt-0.5">
                      +{log.points} điểm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICATE (IN / XUẤT PDF CHUẨN IN ẤN THEO MỤC 8) */}
      {activeTab === 'certificate' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Action Toolbar (no print) */}
          <div className="no-print bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Mẫu Chứng nhận Lớp học Xanh & Đại sứ Môi trường 2026
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sử dụng lệnh in chuẩn trình duyệt để lưu dạng <strong>PDF khổ A4 nằm ngang</strong> không lỗi font chữ Unicode.
              </p>
            </div>
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Printer className="w-4 h-4" /> In / Xuất PDF Chứng nhận
            </button>
          </div>

          {/* THE CERTIFICATE (Formatted for both screen preview and @media print) */}
          <div className="print-container bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border-8 border-double border-emerald-800 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
            {/* Background Corner Decors */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-amber-600 m-2 pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-amber-600 m-2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-amber-600 m-2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-amber-600 m-2 pointer-events-none" />

            {/* National Header */}
            <div className="text-center space-y-1 mb-6">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                Độc lập - Tự do - Hạnh phúc
              </p>
              <div className="w-24 h-0.5 bg-amber-600 mx-auto mt-1" />
            </div>

            {/* Event & Certificate Title */}
            <div className="text-center my-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                🌟 NGÀY HỘI NHÀ GIÁO SÁNG TẠO 2026 - VISEF AWARD 🌟
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-emerald-900 font-serif">
                GIẤY CHỨNG NHẬN
              </h2>
              <p className="text-sm sm:text-base font-bold text-amber-800 tracking-wide uppercase">
                DANH HIỆU: ĐẠI SỨ TIÊN PHONG LỚP HỌC XANH & GIẢM THIỂU CARBON
              </p>
            </div>

            {/* Recipient Info */}
            <div className="text-center my-6 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 italic">Trân trọng trao tặng cho:</p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-wide border-b-2 border-dashed border-emerald-600 inline-block px-6 pb-1">
                {currentUser.name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                {currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'} • {currentUser.grade || 'Cấp THCS'}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                Đơn vị: {currentUser.school || DEFAULT_SCHOOL}
              </p>
            </div>

            {/* Citation */}
            <div className="my-6 text-center max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
              Đã có thành tích xuất sắc và đóng góp tích cực trong chương trình chuyển đổi số giáo dục môi trường,
              ứng dụng mô phỏng <strong>EcoBot</strong> để cắt giảm thành công{' '}
              <strong className="text-emerald-700 text-base">{totalSavedCo2 > 0 ? totalSavedCo2 : '12.8'} kg CO2e</strong>{' '}
              và lan tỏa lối sống sinh thái xanh trong năm học <strong>{academicYear}</strong>.
            </div>

            {/* Signatures & Seal */}
            <div className="mt-8 pt-6 grid grid-cols-2 text-center text-xs sm:text-sm">
              <div className="space-y-1">
                <p className="font-semibold text-slate-600">ĐẠI DIỆN HỘI ĐỒNG GIÁM KHẢO</p>
                <p className="text-[11px] text-slate-400 italic">Ngày hội Nhà giáo Sáng tạo 2026</p>
                <div className="h-16 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-red-600 text-red-600 flex flex-col items-center justify-center text-[9px] font-bold rotate-[-12deg] shadow-sm">
                    <span>ECOBOT</span>
                    <span>2026</span>
                    <span className="text-[7px]">CHỨNG THỰC</span>
                  </div>
                </div>
                <p className="font-bold text-slate-800">Ban Tổ Chức Cuộc Thi</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-600">THỦ TRƯỞNG ĐƠN VỊ</p>
                <p className="text-[11px] text-slate-400 italic">{currentUser.school || DEFAULT_SCHOOL}</p>
                <div className="h-16 flex items-center justify-center">
                  <div className="font-serif italic text-emerald-800 text-lg font-bold">
                    Trương Văn Nghĩa
                  </div>
                </div>
                <p className="font-bold text-slate-800">Hiệu trưởng / Đại diện trường</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RUBRICS ĐÁNH GIÁ SINH THÁI */}
      {activeTab === 'rubrics' && (
        <div className="no-print bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Bảng Tiêu chí Rubrics Đánh giá Giáo dục Lớp học Xanh THCS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xây dựng theo định hướng phát triển phẩm chất và năng lực học sinh (Chương trình GDPT 2018).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200">
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold w-1/5">Tiêu chí</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold w-1/5 text-slate-500">Mức 1: Bắt đầu (1-2đ)</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold w-1/5 text-blue-600 dark:text-blue-400">Mức 2: Đạt (3-5đ)</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold w-1/5 text-emerald-600 dark:text-emerald-400">Mức 3: Khá (6-8đ)</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold w-1/5 text-purple-600 dark:text-purple-400">Mức 4: Tiên phong (9-10đ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white">
                    1. Tiết kiệm Điện & Năng lượng
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Hay quên tắt đèn, quạt khi rời lớp.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Tắt thiết bị khi được nhắc nhở.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Tự giác tắt điện, sử dụng ánh sáng tự nhiên.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-purple-600 dark:text-purple-300">Chủ động kiểm tra toàn phòng học, tham mưu giải pháp tiết kiệm điện.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white">
                    2. Giảm thiểu Rác thải Nhựa
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Vẫn sử dụng nhiều ly nhựa, túi nilon.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Giảm bớt đồ nhựa, phân loại rác cơ bản.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Luôn dùng bình nước cá nhân, không xả rác bừa bãi.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-purple-600 dark:text-purple-300">Đạt danh hiệu Zero-Plastic, tái chế đồ dùng học tập sáng tạo.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white">
                    3. Giao thông Đi lại Xanh
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">100% nhờ chở xe máy xăng cự ly gần.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Thỉnh thoảng đi bộ hoặc xe đạp điện.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Thường xuyên đạp xe, đi bộ đến trường.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-purple-600 dark:text-purple-300">Dẫn đầu phong trào đi học bằng phương tiện xanh của lớp.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white">
                    4. Sử dụng công cụ số EcoBot
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Chưa biết tính toán lượng phát thải.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Biết nhập số liệu tính carbon cá nhân.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">Theo dõi nhật ký đều đặn hàng tuần.</td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-purple-600 dark:text-purple-300">Hướng dẫn bạn bè sử dụng EcoBot, đề xuất dự án lớp học xanh.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Green Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Ghi nhận Hành động Xanh mới
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nhóm hành động:
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                >
                  <option value="electricity">⚡ Tiết kiệm điện năng</option>
                  <option value="plastic">🥤 Giảm rác thải nhựa</option>
                  <option value="transport">🚲 Giao thông xanh (Xe đạp / Đi bộ)</option>
                  <option value="tree">🌳 Trồng & Chăm sóc cây xanh</option>
                  <option value="recycle">♻️ Phân loại rác & Tái chế</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên việc làm cụ thể:
                </label>
                <input
                  type="text"
                  required
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder="Ví dụ: Tắt điều hòa sớm 15 phút trước giờ tan học..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả chi tiết:
                </label>
                <textarea
                  rows={2}
                  value={actionDesc}
                  onChange={(e) => setActionDesc(e.target.value)}
                  placeholder="Ghi chú thêm về kết quả và bạn bè cùng tham gia..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ước tính kg CO2e cắt giảm được:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.1"
                    value={savedCo2Input}
                    onChange={(e) => setSavedCo2Input(Math.max(0.1, Number(e.target.value) || 0.1))}
                    className="w-28 px-3 py-1.5 text-xs font-bold text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                  <span className="text-xs text-slate-500">kg CO2e</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                >
                  Ghi vào Nhật ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
