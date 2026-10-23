import React, { useState } from 'react';
import { UserProfile } from '../types';
import { INITIAL_DEMO_USERS, DEFAULT_SCHOOL } from '../utils/storage';

interface SettingsViewProps {
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  academicYear: string;
  onSaveAcademicYear: (year: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onSwitchUser,
  apiKey,
  onSaveApiKey,
  academicYear,
  onSaveAcademicYear,
}) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempYear, setTempYear] = useState(academicYear);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    onSaveApiKey(tempApiKey);
    onSaveAcademicYear(tempYear);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cài đặt & Quản lý Tài khoản</h2>
          <p className="text-slate-500 text-sm">Cấu hình năm học, Khóa API cá nhân và Chuyển đổi danh sách Tài khoản chính thức</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cấu hình chung */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              🔑 Cấu hình Năm học & Khóa Gemini API Key cá nhân
            </h3>
            <p className="text-slate-500 text-xs">
              Lưu trực tiếp vào LocalStorage ('ecobot_settings') để ưu tiên gọi AI khi soạn Kế hoạch bài dạy 5512.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Năm học áp dụng:</label>
                <input
                  type="text"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-600">Khóa Gemini API Key cá nhân:</label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    {showKey ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="AIzaSy... (Tùy chọn - để trống dùng hệ thống)"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess && (
                <span className="text-xs font-medium text-emerald-600 animate-pulse">
                  ✓ Đã lưu cài đặt thành công!
                </span>
              )}
              <button
                onClick={handleSaveSettings}
                className="ml-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                💾 LƯU CÀI ĐẶT
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách Tài khoản & Nhãn phân loại chuẩn */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#0A192F] to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-emerald-500/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              👥 Danh sách Tài khoản Hệ thống
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Chọn tài khoản làm việc trực tiếp:
            </p>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {INITIAL_DEMO_USERS.map((userItem) => {
                const isActive = currentUser.id === userItem.id;
                // LOGIC PHÂN LOẠI NHÃN CHUẨN XÁC:
                const isDemoAccount = userItem.id === 'gv_demo' || userItem.id === 'hs_demo';
                const badgeText = isDemoAccount
                  ? (userItem.role === 'teacher' ? 'Demo Giáo viên' : 'Demo Học sinh')
                  : (userItem.role === 'teacher' ? 'Giáo viên' : 'Học sinh');

                return (
                  <div
                    key={userItem.id}
                    onClick={() => onSwitchUser(userItem)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-white">{userItem.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isDemoAccount
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : userItem.role === 'teacher'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {badgeText}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <p>{userItem.school || DEFAULT_SCHOOL} • {userItem.grade}</p>
                      {userItem.subject && <p>Chuyên môn: {userItem.subject}</p>}
                      <p className="text-slate-500 text-[10px]">{userItem.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
