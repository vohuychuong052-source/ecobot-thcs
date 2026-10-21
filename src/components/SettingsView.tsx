import React, { useState, useEffect } from 'react';
import {
  User,
  School,
  BookOpen,
  Key,
  Calendar,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Users,
  Shield,
  Layers,
  ArrowRightLeft,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import {
  UserProfile,
  GRADE_OPTIONS,
  SUBJECT_OPTIONS,
  DEFAULT_SCHOOL,
  DEFAULT_TEACHER,
  DEFAULT_ACADEMIC_YEAR
} from '../types';
import { storage, AppSettings, INITIAL_DEMO_USERS } from '../utils/storage';

interface SettingsViewProps {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  allUsers: UserProfile[];
  setAllUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  setCurrentUser,
  allUsers,
  setAllUsers,
  settings,
  setSettings,
  onShowToast,
}) => {
  // Form profile cá nhân
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState<UserProfile['role']>(currentUser.role);
  const [school, setSchool] = useState(currentUser.school);
  const [grade, setGrade] = useState(currentUser.grade);
  const [subject, setSubject] = useState(currentUser.subject || 'Giáo dục công dân');
  // Đối với tài khoản Giáo viên, bắt buộc có thêm trường ô nhập "Tổ chuyên môn" để trống hoàn toàn để giáo viên tự điền theo mục 3
  const [department, setDepartment] = useState(currentUser.department || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');

  // Form cài đặt hệ thống
  const [academicYear, setAcademicYear] = useState(settings.academicYear || DEFAULT_ACADEMIC_YEAR);
  const [userApiKey, setUserApiKey] = useState(settings.userApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  // Form đăng ký tài khoản mới
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'teacher' | 'student'>('student');
  const [newUserGrade, setNewUserGrade] = useState('Lớp 8');
  const [newUserSubject, setNewUserSubject] = useState('Giáo dục công dân');
  const [newUserDepartment, setNewUserDepartment] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Thông báo & Modal
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  // Đồng bộ khi đổi user
  useEffect(() => {
    setName(currentUser.name);
    setRole(currentUser.role);
    setSchool(currentUser.school);
    setGrade(currentUser.grade);
    setSubject(currentUser.subject || 'Giáo dục công dân');
    setDepartment(currentUser.department || '');
    setEmail(currentUser.email || '');
    setPhone(currentUser.phone || '');
  }, [currentUser]);

  // 1. VIẾT LẠI HÀM XỬ LÝ LƯU THÔNG TIN CÁ NHÂN THEO YÊU CẦU MỤC 1:
  // - Cập nhật 'ecobot_users' trong localStorage
  // - Cập nhật trực tiếp 'ecobot_current_user' trong localStorage
  // - Cập nhật React State 'currentUser' ngay lập tức
  // - Hiển thị thông báo Toast / Banner thành công: "Đã cập nhật và lưu thông tin tài khoản thành công!"
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: UserProfile = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      role,
      school: school.trim() || DEFAULT_SCHOOL,
      grade,
      subject: role === 'teacher' ? subject : undefined,
      department: role === 'teacher' ? department.trim() : '',
      email: email.trim(),
      phone: phone.trim(),
    };

    // Ghi đè bền vững vào 'ecobot_users' và 'ecobot_current_user' trong LocalStorage
    const updatedUsers = storage.updateUserProfile(updatedProfile);

    // Cập nhật React State currentUser & allUsers ngay lập tức để Header, Bảng điều khiển, Hồ sơ đổi mới không cần F5
    setCurrentUser(updatedProfile);
    setAllUsers(updatedUsers);

    // Hiển thị thông báo Toast / Banner theo yêu cầu
    const msg = 'Đã cập nhật và lưu thông tin tài khoản thành công!';
    setSaveSuccessMsg(msg);
    if (onShowToast) {
      onShowToast(msg, 'success');
    }
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Lưu cài đặt hệ thống (Năm học & API Key)
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const newSettings: AppSettings = {
      ...settings,
      academicYear: academicYear.trim() || DEFAULT_ACADEMIC_YEAR,
      userApiKey: userApiKey.trim(),
      schoolName: school.trim() || DEFAULT_SCHOOL,
    };

    storage.saveSettings(newSettings);
    setSettings(newSettings);

    const msg = 'Đã cập nhật năm học và cấu hình API Key vào LocalStorage thành công!';
    setSaveSuccessMsg(msg);
    if (onShowToast) {
      onShowToast(msg, 'success');
    }
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // 2. ĐĂNG KÝ TÀI KHOẢN MỚI THEO MỤC 2:
  // Tự động 'push' tài khoản mới vào mảng 'ecobot_users' và lưu lại vào localStorage
  const handleRegisterNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: newUserName.trim(),
      role: newUserRole,
      school: school.trim() || DEFAULT_SCHOOL,
      grade: newUserGrade,
      subject: newUserRole === 'teacher' ? newUserSubject : undefined,
      department: newUserRole === 'teacher' ? newUserDepartment.trim() : '',
      email: newUserEmail.trim(),
      createdAt: new Date().toISOString(),
    };

    // Lưu vào localStorage 'ecobot_users' và set làm current_user
    const updatedUsers = storage.registerUser(newUser);
    setAllUsers(updatedUsers);
    setCurrentUser(newUser);

    setNewUserName('');
    setNewUserEmail('');
    setNewUserDepartment('');
    setShowRegisterForm(false);

    const msg = `Đã đăng ký tài khoản mới "${newUser.name}" và chuyển sang đăng nhập thành công!`;
    setSaveSuccessMsg(msg);
    if (onShowToast) {
      onShowToast(msg, 'success');
    }
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Xóa tài khoản vĩnh viễn (kèm Modal xác nhận rõ ràng)
  const handleConfirmDelete = () => {
    if (!userToDeleteId) return;

    const { remainingUsers, newCurrent } = storage.deleteUser(userToDeleteId);
    setAllUsers(remainingUsers);
    setCurrentUser(newCurrent);
    setUserToDeleteId(null);
    setDeleteModalOpen(false);

    const msg = 'Đã xóa tài khoản vĩnh viễn khỏi LocalStorage.';
    setSaveSuccessMsg(msg);
    if (onShowToast) {
      onShowToast(msg, 'info');
    }
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Chuyển nhanh giữa 2 tài khoản demo
  const handleSwitchToDemo = (demoId: 'gv_demo' | 'hs_demo') => {
    const found = allUsers.find(u => u.id === demoId);
    if (found) {
      storage.setCurrentUser(found);
      setCurrentUser(found);
      if (onShowToast) {
        onShowToast(`Đã chuyển sang tài khoản ${found.name} (${found.role === 'teacher' ? 'Giáo viên' : 'Học sinh'})`, 'info');
      }
    }
  };

  // Sĩ số thực tế trong hệ thống theo mục 3
  const teacherCount = allUsers.filter(u => u.role === 'teacher').length;
  const studentCount = allUsers.filter(u => u.role === 'student').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-[#0A192F] to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              ⚙️ Quản Trị Hệ Thống & Lưu Trữ Bền Vững (LocalStorage)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Quản lý Tài khoản & Hồ sơ Đơn vị
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Dữ liệu được lưu trữ vĩnh viễn trong <strong>'ecobot_users'</strong> và <strong>'ecobot_current_user'</strong>. Khi chỉnh sửa và bấm <strong>[LƯU THÔNG TIN]</strong>, hệ thống lập tức cập nhật toàn bộ Header, Hồ sơ và Bảng điều khiển mà không cần F5.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSwitchToDemo(currentUser.id === 'gv_demo' ? 'hs_demo' : 'gv_demo')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-emerald-500/50 shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              Chuyển sang: {currentUser.id === 'gv_demo' ? 'Học sinh Lớp 8' : 'GV. Trương Văn Nghĩa'}
            </button>
          </div>
        </div>

        {/* Banner thông báo lưu thành công */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3.5 bg-emerald-950/90 border-2 border-emerald-400 rounded-xl text-emerald-100 text-xs font-semibold flex items-center gap-2.5 shadow-lg animate-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Sĩ số lớp học / Tập thể hiển thị chính xác dựa trên số lượng tài khoản thực tế theo mục 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Tổng tài khoản thực tế (ecobot_users)</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {allUsers.length} <span className="text-xs font-normal text-slate-500">người dùng</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Giáo viên trong hệ thống</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {teacherCount} <span className="text-xs font-normal text-slate-500">giáo viên</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Học sinh đăng ký thực tế</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {studentCount} <span className="text-xs font-normal text-slate-500">học sinh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Chỉnh sửa Hồ sơ cá nhân (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" />
                Hồ sơ Người dùng: <span className="text-emerald-600 dark:text-emerald-400">{currentUser.name}</span>
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                currentUser.role === 'teacher'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {currentUser.role === 'teacher' ? 'Tài khoản Giáo viên' : 'Tài khoản Học sinh'}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Họ tên */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Họ và tên:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ và tên..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                {/* Vai trò */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Vai trò:
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white font-medium"
                  >
                    <option value="teacher">Giáo viên</option>
                    <option value="student">Học sinh</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tên trường */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên trường học:
                  </label>
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <span className="text-[10px] text-slate-400">Mặc định: Trường THCS Nguyễn Đáng</span>
                </div>

                {/* Khối lớp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Khối lớp (THCS):
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white font-medium"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Đối với tài khoản Giáo viên, BẮT BUỘC có thêm trường ô nhập "Tổ chuyên môn" để trống hoàn toàn để giáo viên tự điền theo mục 3 */}
              {role === 'teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50/60 dark:bg-blue-950/25 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50">
                  <div>
                    <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                      Tổ chuyên môn <span className="text-amber-500 font-extrabold">* (Giáo viên tự điền)</span>:
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Để trống cho GV tự điền (VD: Tổ KHXH, Tổ KHTN...)"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                    <span className="text-[10px] text-blue-600 dark:text-blue-300">
                      Tự động đồng bộ vào Kế hoạch bài dạy chuẩn Công văn 5512
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                      Môn học giảng dạy:
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium"
                    >
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email liên hệ:
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@thcsnguyendang.edu.vn"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Số điện thoại:
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0918-xxx-xxx"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Nút [Lưu thông tin] hoạt động chuẩn xác theo mục 1 & 3 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setUserToDeleteId(currentUser.id);
                    setDeleteModalOpen(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa tài khoản này
                </button>

                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> LƯU THÔNG TIN
                </button>
              </div>
            </form>
          </div>

          {/* Cài đặt Năm học & Cấu hình Gemini API Key cá nhân theo mục 8 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              Cấu hình Năm học & Khóa Gemini API Key cá nhân
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Lưu trực tiếp vào LocalStorage ('ecobot_settings') để ưu tiên gọi AI khi soạn Kế hoạch bài dạy 5512.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Năm học linh hoạt thay đổi theo mục 2 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Năm học áp dụng:
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2026-2027"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-center"
                  />
                  <span className="text-[10px] text-slate-400">Có thể điều chỉnh theo từng năm học</span>
                </div>

                {/* Gemini API Key cá nhân (Input type="password") theo mục 8 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Khóa Gemini API Key cá nhân:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      {showApiKey ? 'Ẩn' : 'Hiện'}
                    </button>
                  </div>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                    placeholder="AIzaSy... (Tùy chọn - để trống dùng hệ thống)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400">
                    Ưu tiên gọi AI theo khóa riêng của thầy cô khi soạn giáo án
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> LƯU CÀI ĐẶT
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Quản lý danh sách tài khoản & Đăng ký mới (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Demo Switcher Card */}
          <div className="bg-gradient-to-br from-[#0A192F] to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-emerald-500/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              2 Tài khoản Demo Chính quy
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              Mặc định chỉ có 01 Giáo viên (Trương Văn Nghĩa) và 01 Demo Học sinh (Học sinh Lớp 8):
            </p>

            <div className="space-y-2">
              {INITIAL_DEMO_USERS.map((demo) => {
                const isActive = currentUser.id === demo.id;
                // Get current live state from allUsers
                const liveData = allUsers.find(u => u.id === demo.id) || demo;
                return (
                  <div
                    key={demo.id}
                    onClick={() => handleSwitchToDemo(demo.id as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{liveData.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        demo.role === 'teacher'
                          ? 'bg-blue-900/80 text-blue-300'
                          : 'bg-emerald-900/80 text-emerald-300'
                      }`}>
                        {demo.role === 'teacher' ? 'Giáo viên' : 'Demo Học sinh'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {liveData.school} • {liveData.grade} {liveData.subject ? `• ${liveData.subject}` : ''}
                      {liveData.department ? ` • Tổ: ${liveData.department}` : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Thêm tài khoản mới */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Đăng ký Tài khoản Mới
              </h4>
              <button
                onClick={() => setShowRegisterForm(!showRegisterForm)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                {showRegisterForm ? 'Đóng form' : '+ Thêm người dùng'}
              </button>
            </div>

            {showRegisterForm && (
              <form onSubmit={handleRegisterNewUser} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Họ và tên người dùng:
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Nhập họ và tên..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Vai trò:
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                    >
                      <option value="student">Học sinh</option>
                      <option value="teacher">Giáo viên</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Khối lớp:
                    </label>
                    <select
                      value={newUserGrade}
                      onChange={(e) => setNewUserGrade(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {newUserRole === 'teacher' && (
                  <div className="space-y-2 p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                    <div>
                      <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                        Tổ chuyên môn:
                      </label>
                      <input
                        type="text"
                        value={newUserDepartment}
                        onChange={(e) => setNewUserDepartment(e.target.value)}
                        placeholder="Ví dụ: Tổ Khoa học Tự nhiên..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                        Môn học:
                      </label>
                      <select
                        value={newUserSubject}
                        onChange={(e) => setNewUserSubject(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      >
                        {SUBJECT_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="email@thcsnguyendang.edu.vn"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    Đăng ký & Lưu tài khoản
                  </button>
                </div>
              </form>
            )}

            {/* Danh sách toàn bộ tài khoản */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tất cả tài khoản trong hệ thống ({allUsers.length})
              </span>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                        isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                              Đang đăng nhập
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                          {u.role === 'teacher' ? 'GV' : 'HS'} • {u.grade} {u.department ? `• Tổ: ${u.department}` : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!isCurrent && (
                          <button
                            onClick={() => {
                              storage.setCurrentUser(u);
                              setCurrentUser(u);
                              if (onShowToast) onShowToast(`Đã chuyển sang tài khoản ${u.name}`, 'info');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500"
                          >
                            Đăng nhập
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setUserToDeleteId(u.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                          title="Xóa tài khoản vĩnh viễn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xác nhận Xóa Tài khoản Vĩnh viễn theo mục 3 */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-rose-300 dark:border-rose-900 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-rose-600" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Xác nhận XÓA TÀI KHOẢN VĨNH VIỄN?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bạn đang thực hiện thao tác xóa tài khoản này khỏi hệ thống LocalStorage. Toàn bộ thông tin tài khoản sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30"
              >
                Xác nhận Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
