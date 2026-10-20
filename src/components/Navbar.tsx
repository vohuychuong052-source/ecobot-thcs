import React, { useState } from 'react';
import {
  Sprout,
  Award,
  Sun,
  Moon,
  User,
  Users,
  BookOpen,
  Calculator,
  Film,
  FileText,
  FileCheck2,
  Settings,
  ChevronDown,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  academicYear: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSwitchUser,
  darkMode,
  setDarkMode,
  academicYear,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { id: 'calculator', label: 'Mô phỏng Dấu chân Carbon', icon: Calculator },
    { id: 'planner', label: 'AI Soạn Giáo án 5512', icon: Sparkles },
    { id: 'materials', label: 'Kho Học liệu', icon: BookOpen },
    { id: 'videos', label: 'Thư viện Video', icon: Film },
    { id: 'journal', label: 'Nhật ký & Chứng nhận', icon: Award },
    { id: 'settings', label: 'Tài khoản & Cài đặt', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A192F] text-white shadow-xl border-b border-emerald-900/40 no-print">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-[#0A192F] to-blue-900 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-emerald-700/30">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            🌱 Sản phẩm dự thi
          </span>
          <span className="font-medium text-slate-200">
            Ngày hội Nhà giáo Sáng tạo 2026 | {currentUser.school}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="hidden sm:inline bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30 text-blue-300 font-medium">
            Năm học: {academicYear}
          </span>
          <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
            <Award className="w-3.5 h-3.5" /> 2026 AI in Education & VISEF Award
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-400 bg-clip-text text-transparent">
                  EcoBot
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Lớp Học Xanh
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Mô phỏng Dấu chân Carbon & Giáo án 5512 THCS
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Dark/Light Mode & User Profile */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors border border-slate-700/60"
              title={darkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-emerald-500/30 transition-all text-left shadow-sm"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  currentUser.role === 'teacher'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}>
                  {currentUser.role === 'teacher' ? 'GV' : 'HS'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    {currentUser.name}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      currentUser.role === 'teacher'
                        ? 'bg-blue-900/60 text-blue-300 border border-blue-600/40'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/40'
                    }`}>
                      {currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {currentUser.grade || 'THCS'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Tài khoản hiện tại
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5">{currentUser.name}</p>
                    <p className="text-xs text-emerald-400">{currentUser.school}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {currentUser.role === 'teacher'
                        ? `Giáo viên • ${currentUser.subject || 'GDCD'} • ${currentUser.department ? `Tổ: ${currentUser.department}` : '[Chưa nhập Tổ chuyên môn]'}`
                        : `Học sinh • ${currentUser.grade}`}
                    </p>
                  </div>

                  <div className="py-2">
                    <p className="px-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Chuyển nhanh tài khoản ({allUsers.length})
                    </p>
                    <div className="space-y-1">
                      {allUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u.id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-emerald-600/30 text-emerald-300 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-2 h-2 rounded-full ${
                              u.role === 'teacher' ? 'bg-blue-400' : 'bg-emerald-400'
                            }`} />
                            <span className="truncate">{u.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {u.role === 'teacher' ? 'GV' : 'HS'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Chỉnh sửa hồ sơ / Cài đặt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Nav Links Row */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
