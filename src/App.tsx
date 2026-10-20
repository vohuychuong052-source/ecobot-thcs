import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  LearningMaterial,
  VideoItem,
  GreenActionLog,
  CarbonData,
  DEFAULT_SCHOOL,
  DEFAULT_TEACHER,
  DEFAULT_ACADEMIC_YEAR
} from './types';
import { storage, AppSettings } from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CarbonCalculatorView } from './components/CarbonCalculatorView';
import { LessonPlannerView } from './components/LessonPlannerView';
import { LearningMaterialsView } from './components/LearningMaterialsView';
import { VideoLibraryView } from './components/VideoLibraryView';
import { GreenJournalView } from './components/GreenJournalView';
import { SettingsView } from './components/SettingsView';
import { Sprout, Award, ShieldCheck, CheckCircle, Info, AlertCircle, X } from 'lucide-react';

export default function App() {
  // 1. Quản lý dữ liệu bền vững qua LocalStorage theo mục 3 & 4
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => storage.getUsers());
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storage.getCurrentUser());
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => storage.getFiles());
  const [videos, setVideos] = useState<VideoItem[]>(() => storage.getVideos());
  const [logs, setLogs] = useState<GreenActionLog[]>(() => storage.getLogs());
  const [carbonData, setCarbonData] = useState<CarbonData>(() => storage.getCarbonData());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return settings.theme === 'dark' || false;
  });

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Đồng bộ lại từ LocalStorage khi ứng dụng mount hoặc khi có thay đổi từ tab khác
  useEffect(() => {
    const handleStorageChange = () => {
      setAllUsers(storage.getUsers());
      setCurrentUser(storage.getCurrentUser());
      setMaterials(storage.getFiles());
      setVideos(storage.getVideos());
      setLogs(storage.getLogs());
      setCarbonData(storage.getCarbonData());
      setSettings(storage.getSettings());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Áp dụng class dark vào html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const updatedSettings = { ...settings, theme: darkMode ? ('dark' as const) : ('light' as const) };
    storage.saveSettings(updatedSettings);
  }, [darkMode]);

  // Handler chuyển đổi người dùng
  const handleSwitchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      storage.setCurrentUser(target);
      setCurrentUser(target);
      showToast(`Đã chuyển sang tài khoản ${target.name} (${target.role === 'teacher' ? 'Giáo viên' : 'Học sinh'})`, 'info');
    }
  };

  const reloadLogsAndCarbon = () => {
    setLogs(storage.getLogs());
    setCarbonData(storage.getCarbonData());
  };

  const handleMaterialAdded = (newMat: LearningMaterial) => {
    setMaterials(prev => [newMat, ...prev]);
    showToast(`Đã thêm tệp "${newMat.title}" vào Kho học liệu!`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors font-sans">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 no-print">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/60 shadow-emerald-900/30'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-200 border-rose-500/60 shadow-rose-900/30'
              : 'bg-blue-950/95 text-blue-200 border-blue-500/60 shadow-blue-900/30'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="max-w-xs">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white ml-1 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        academicYear={settings.academicYear || DEFAULT_ACADEMIC_YEAR}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            allUsers={allUsers}
            materials={materials}
            videos={videos}
            logs={logs}
            carbonData={carbonData}
            academicYear={settings.academicYear || DEFAULT_ACADEMIC_YEAR}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'calculator' && (
          <CarbonCalculatorView
            currentUser={currentUser}
            onSavedLog={reloadLogsAndCarbon}
            onNavigateToJournal={() => setActiveTab('journal')}
          />
        )}

        {activeTab === 'planner' && (
          <LessonPlannerView
            currentUser={currentUser}
            academicYear={settings.academicYear || DEFAULT_ACADEMIC_YEAR}
            onMaterialAdded={handleMaterialAdded}
          />
        )}

        {activeTab === 'materials' && (
          <LearningMaterialsView
            currentUser={currentUser}
            materials={materials}
            setMaterials={setMaterials}
          />
        )}

        {activeTab === 'videos' && (
          <VideoLibraryView
            currentUser={currentUser}
            videos={videos}
            setVideos={setVideos}
          />
        )}

        {activeTab === 'journal' && (
          <GreenJournalView
            currentUser={currentUser}
            logs={logs}
            setLogs={setLogs}
            academicYear={settings.academicYear || DEFAULT_ACADEMIC_YEAR}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            allUsers={allUsers}
            setAllUsers={setAllUsers}
            settings={settings}
            setSettings={setSettings}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-[#0A192F] text-slate-400 py-8 border-t border-emerald-900/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                EcoBot - Hệ sinh thái Lớp học Xanh & Mô phỏng Dấu chân Carbon
              </p>
              <p className="text-[11px] text-slate-400">
                Sản phẩm phục vụ cuộc thi <strong>"Ngày hội Nhà giáo Sáng tạo 2026"</strong> tại Việt Nam
              </p>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-slate-200 font-semibold">
              {currentUser.school || DEFAULT_SCHOOL} (phường Trường Long Hoà, tỉnh Vĩnh Long)
            </p>
            <p className="text-[11px] text-slate-400">
              Giáo viên thực hiện: <strong>{DEFAULT_TEACHER}</strong> • Năm học: <strong>{settings.academicYear || DEFAULT_ACADEMIC_YEAR}</strong>
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center justify-center md:justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Dữ liệu lưu trữ bền vững trên LocalStorage • Chuẩn GDPT 2018 & CV 5512
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
