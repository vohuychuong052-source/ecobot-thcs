import {
  UserProfile,
  LearningMaterial,
  VideoItem,
  GreenActionLog,
  CarbonData,
  DEFAULT_SCHOOL,
  DEFAULT_TEACHER,
  DEFAULT_ACADEMIC_YEAR
} from '../types';

export const STORAGE_KEYS = {
  USERS: 'ecobot_users',
  CURRENT_USER: 'ecobot_current_user',
  FILES: 'ecobot_files',
  VIDEOS: 'ecobot_videos',
  LOGS: 'ecobot_logs',
  SETTINGS: 'ecobot_settings',
  CARBON: 'ecobot_carbon',
  SAVED_PLANS: 'ecobot_saved_plans',
};

// Safe localStorage setter to prevent QuotaExceededError crashes
function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    console.warn(`[Storage] Failed to save key "${key}" to localStorage:`, e?.message);
    return false;
  }
}

// Khởi tạo ĐÚNG VÀ CHỈ 2 TÀI KHOẢN DEMO theo yêu cầu
export const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    id: 'gv_demo',
    name: DEFAULT_TEACHER, // "Trương Văn Nghĩa"
    role: 'teacher',
    school: DEFAULT_SCHOOL, // "Trường THCS Nguyễn Đáng"
    grade: 'Khối 8',
    subject: 'Giáo dục Công dân',
    department: '', // Bắt buộc để trống hoàn toàn cho giáo viên tự điền
    email: 'truongvannghia@thcsnguyendang.edu.vn',
    phone: '0918-xxx-xxx',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'hs_demo',
    name: 'Học sinh Lớp 8',
    role: 'student',
    school: DEFAULT_SCHOOL,
    grade: 'Lớp 8',
    department: '',
    email: 'hocsinh.lop8@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
            
];

// Khởi tạo kho học liệu sẵn có từ 16 tệp sách giáo khoa & văn bản hướng dẫn chính thức trong workspace
export const OFFICIAL_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat_5512',
    title: 'Công văn 5512/BGDĐT-GDTrH - Xây dựng Kế hoạch bài dạy chuẩn',
    category: 'Văn bản hướng dẫn',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 9',
    fileName: '2._Cong_van_5512_336723d6.pdf',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/2._Cong_van_5512_336723d6.pdf',
    uploadedBy: 'Bộ Giáo dục và Đào tạo',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_7991',
    title: 'Công văn 7991/BGDĐT - Hướng dẫn kiểm tra đánh giá định kỳ GDPT',
    category: 'Văn bản hướng dẫn',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 8',
    fileName: '1._Cong-van-7991-huong-dan-ktdgdk_19eb0979.pdf',
    fileSize: '890 KB',
    fileType: 'pdf',
    url: '/assets/aistudio/1._Cong-van-7991-huong-dan-ktdgdk_19eb0979.pdf',
    uploadedBy: 'Bộ Giáo dục và Đào tạo',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_phu_luc_1',
    title: 'Phụ lục 1: Khung Kế hoạch dạy học môn học của Tổ chuyên môn',
    category: 'Văn bản hướng dẫn',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 9',
    fileName: '1_phu_luc_1_khung_ke_hoach_day_hoc_mon_hoc_71020219_1f0d940d.pdf',
    fileSize: '750 KB',
    fileType: 'pdf',
    url: '/assets/aistudio/1_phu_luc_1_khung_ke_hoach_day_hoc_mon_hoc_71020219_1f0d940d.pdf',
    uploadedBy: 'Bộ Giáo dục và Đào tạo',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_khung_nang_luc',
    title: 'Hướng dẫn triển khai Khung năng lực số & GD bảo vệ môi trường 2025-2026',
    category: 'Văn bản hướng dẫn',
    subject: 'Khoa học Tự nhiên',
    grade: 'Lớp 8',
    fileName: '23456bgddthuong-dan-trien-khai-thuc-hien_219202522_1c1a1bb1.pdf',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/23456bgddthuong-dan-trien-khai-thuc-hien_219202522_1c1a1bb1.pdf',
    uploadedBy: 'Bộ Giáo dục và Đào tạo',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_sgk_gdcd_6',
    title: 'SGK Giáo dục Công dân Lớp 6 - GDPT 2018 (Bài: Tiết kiệm & Môi trường)',
    category: 'Sách giáo khoa',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 6',
    fileName: 'thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-6-thong-nhat_d51b21b1.pdf',
    fileSize: '18.5 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-6-thong-nhat_d51b21b1.pdf',
    uploadedBy: 'Nhà xuất bản Giáo dục',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_sgk_gdcd_7',
    title: 'SGK Giáo dục Công dân Lớp 7 - GDPT 2018 (Bài: Bảo tồn di sản & Thiên nhiên)',
    category: 'Sách giáo khoa',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 7',
    fileName: 'thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-7-thong-nhat_915e2d8a.pdf',
    fileSize: '19.2 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-7-thong-nhat_915e2d8a.pdf',
    uploadedBy: 'Nhà xuất bản Giáo dục',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_sgk_gdcd_8',
    title: 'SGK Giáo dục Công dân Lớp 8 - GDPT 2018 (Bài: Bảo vệ môi trường & Tài nguyên)',
    category: 'Sách giáo khoa',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 8',
    fileName: 'thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-8-thong-nhat_fc21b034.pdf',
    fileSize: '21.0 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-8-thong-nhat_fc21b034.pdf',
    uploadedBy: 'Nhà xuất bản Giáo dục',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_sgk_gdcd_9',
    title: 'SGK Giáo dục Công dân Lớp 9 - GDPT 2018 (Bài: Trách nhiệm với cộng đồng & Sinh thái)',
    category: 'Sách giáo khoa',
    subject: 'Giáo dục công dân',
    grade: 'Lớp 9',
    fileName: 'thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-9-thong-nhat_8af0393d.pdf',
    fileSize: '22.4 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/thuvienhoclieu.com-SGK-Giao-Duc-Cong-Dan-Lop-9-thong-nhat_8af0393d.pdf',
    uploadedBy: 'Nhà xuất bản Giáo dục',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_sgk_van_9_t1',
    title: 'SGK Ngữ văn Lớp 9 Tập 1 - GDPT 2018',
    category: 'Sách giáo khoa',
    subject: 'Ngữ văn',
    grade: 'Lớp 9',
    fileName: 'thuvienhoclieu.com-SGK-Ngu-Van-Lop-9-thong-nhat-tap-1_5b6bb8de.pdf',
    fileSize: '24.1 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/thuvienhoclieu.com-SGK-Ngu-Van-Lop-9-thong-nhat-tap-1_5b6bb8de.pdf',
    uploadedBy: 'Nhà xuất bản Giáo dục',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  },
  {
    id: 'mat_sgk_van_9_t2',
    title: 'SGK Ngữ văn Lớp 9 Tập 2 - GDPT 2018 (Chủ đề Mẹ Thiên nhiên & Sinh thái)',
    category: 'Sách giáo khoa',
    subject: 'Ngữ văn',
    grade: 'Lớp 9',
    fileName: 'thuvienhoclieu.com-SGK-Ngu-Van-Lop-9-thong-nhat-tap-2_1725b80e.pdf',
    fileSize: '23.8 MB',
    fileType: 'pdf',
    url: '/assets/aistudio/thuvienhoclieu.com-SGK-Ngu-Van-Lop-9-thong-nhat-tap-2_1725b80e.pdf',
    uploadedBy: 'Nhà xuất bản Giáo dục',
    uploadedAt: '2026-09-01',
    isOfficial: true,
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid_1',
    title: 'Mô phỏng Dấu chân Carbon & Biến đổi Khí hậu tại Việt Nam',
    description: 'Video trực quan giải thích khái niệm dấu chân carbon cá nhân và lớp học THCS.',
    url: 'https://www.youtube.com/watch?v=8q7_aV8eLUE',
    embedUrl: 'https://www.youtube.com/embed/8q7_aV8eLUE',
    grade: 'Lớp 8',
    subject: 'Khoa học Tự nhiên',
    tag: 'Dấu chân Carbon',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-02',
  },
  {
    id: 'vid_2',
    title: 'Tìm hiểu về tác hại của RÁC THẢI NHỰA trong 6 phút',
    description: 'Ô nhiễm nhựa.',
    url: 'https://www.youtube.com/watch?v=BujzV_R60us',
    embedUrl: 'https://www.youtube.com/embed/BujzV_R60us',
    grade: 'Lớp 6',
    subject: 'Giáo dục công dân',
    tag: 'Lớp học Xanh',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-03',
  },
  {
    id: 'vid_3',
    title: 'Tuổi trẻ Vĩnh Long chung tay bảo vệ môi trường',
    description: 'Chiến dịch dọn dẹp rác thải.',
    url: 'https://www.youtube.com/watch?v=SlS--5M9Ypw',
    embedUrl: 'https://www.youtube.com/embed/SlS--5M9Ypw',
    grade: 'Lớp 9',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  },
  {
    id: 'vid_4',
    title: 'Những người trẻ lan tỏa phong trào dọn rác',
    description: 'Chiến dịch dọn dẹp rác thải trên các dòng sông.',
    url: 'https://www.youtube.com/watch?v=u2eftLb8zto',
    embedUrl: 'https://www.youtube.com/embed/u2eftLb8zto',
    grade: 'Lớp 9',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  },
  {
    id: 'vid_5',
    title: 'Một hành động nhỏ - ý nghĩa lớn',
    description: 'Dọn rác thải và phân loại rác thải nhựa.',
    url: 'https://www.youtube.com/watch?v=bzu8_OfEIY4',
    embedUrl: 'https://www.youtube.com/embed/bzu8_OfEIY4',
    grade: 'Lớp 7',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  },
  {
    id: 'vid_6',
    title: 'Sáng Tạo Xanh',
    description: 'Ô nhiễm môi trường.',
    url: 'https://www.youtube.com/watch?v=-Zo4hHk-dH4',
    embedUrl: 'https://www.youtube.com/embed/-Zo4hHk-dH4',
    grade: 'Lớp 7',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  },
  {
    id: 'vid_7',
    title: 'TÍN CHỈ CARBON – Loại tiền tệ mới trong kỷ nguyên ngập tràn ô nhiễm?',
    description: 'Biến đổikhí hậu.',
    url: 'https://www.youtube.com/watch?v=38_g7yBqrlM',
    embedUrl: 'https://www.youtube.com/embed/38_g7yBqrlM',
    grade: 'Lớp 7',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  },
];

export const INITIAL_LOGS: GreenActionLog[] = [
  {
    id: 'log_1',
    userId: 'gv_demo',
    userName: 'Trương Văn Nghĩa',
    actionType: 'electricity',
    title: 'Tắt quạt và đèn khi kết thúc tiết học 5',
    description: 'Nhắc nhở học sinh tắt toàn bộ 4 quạt trần và 6 bóng đèn tuýp trước khi ra về.',
    savedCO2Kg: 0.64,
    points: 25,
    date: '2026-10-18',
  },
  {
    id: 'log_2',
    userId: 'hs_demo',
    userName: 'Học sinh Lớp 8',
    actionType: 'transport',
    title: 'Đi bộ và đi xe đạp đến trường cả tuần',
    description: 'Không nhờ phụ huynh chở bằng xe máy xăng, giảm phát thải giao thông.',
    savedCO2Kg: 1.6,
    points: 40,
    date: '2026-10-19',
  },
  {
    id: 'log_3',
    userId: 'hs_demo',
    userName: 'Học sinh Lớp 8',
    actionType: 'plastic',
    title: 'Dùng bình nước cá nhân & Hộp ăn trưa inox',
    description: 'Từ chối 5 chai nhựa và 5 hộp xốp dùng một lần tại căn tin.',
    savedCO2Kg: 0.75,
    points: 30,
    date: '2026-10-20',
  }
];

export interface AppSettings {
  academicYear: string;
  userApiKey: string;
  schoolName: string;
  theme: 'light' | 'dark';
}

export const storage = {
  // USERS
  getUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DEMO_USERS));
        return INITIAL_DEMO_USERS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DEMO_USERS));
        return INITIAL_DEMO_USERS;
      }

      // Ensure demo accounts are always present if missing
      const hasTeacher = parsed.some(u => u.id === 'gv_demo');
      const hasStudent = parsed.some(u => u.id === 'hs_demo');
      if (!hasTeacher || !hasStudent) {
        const merged = [...parsed];
        if (!hasTeacher) merged.unshift(INITIAL_DEMO_USERS[0]);
        if (!hasStudent) merged.splice(1, 0, INITIAL_DEMO_USERS[1]);
        safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
        return merged;
      }

      return parsed;
    } catch {
      return INITIAL_DEMO_USERS;
    }
  },

  saveUsers(users: UserProfile[]) {
    safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): UserProfile {
    const users = this.getUsers();
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        // If stored as JSON object
        if (stored.trim().startsWith('{')) {
          const parsed = JSON.parse(stored);
          const found = users.find(u => u.id === parsed.id);
          if (found) return found;
          return parsed;
        } else {
          // If stored as raw string ID
          const found = users.find(u => u.id === stored.trim());
          if (found) return found;
        }
      }
    } catch {
      // fallback
    }

    // Default to teacher demo
    const defaultUser = users[0] || INITIAL_DEMO_USERS[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  },

  setCurrentUser(userOrId: string | UserProfile) {
    if (typeof userOrId === 'string') {
      const users = this.getUsers();
      const found = users.find(u => u.id === userOrId);
      if (found) {
        safeSetItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
      } else {
        safeSetItem(STORAGE_KEYS.CURRENT_USER, userOrId);
      }
    } else {
      safeSetItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userOrId));
    }
  },

  updateUserProfile(updatedProfile: UserProfile): UserProfile[] {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedProfile.id);

    // Ensure department is always a string
    const normalized: UserProfile = {
      ...updatedProfile,
      department: updatedProfile.role === 'teacher' ? (updatedProfile.department || '') : '',
    };

    if (index !== -1) {
      users[index] = { ...users[index], ...normalized };
    } else {
      users.push(normalized);
    }

    // 1. Lập tức cập nhật thông tin mới vào mảng danh sách người dùng 'ecobot_users' trong localStorage
    this.saveUsers(users);

    // 2. Cập nhật trực tiếp thông tin vào tài khoản hiện tại đang đăng nhập 'ecobot_current_user' trong localStorage
    this.setCurrentUser(normalized);

    return users;
  },

  registerUser(newUser: UserProfile): UserProfile[] {
    const users = this.getUsers();
    const normalized: UserProfile = {
      ...newUser,
      department: newUser.role === 'teacher' ? (newUser.department || '') : '',
    };
    users.push(normalized);

    this.saveUsers(users);
    this.setCurrentUser(normalized);
    return users;
  },

  deleteUser(userId: string): { remainingUsers: UserProfile[]; newCurrent: UserProfile } {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId);
    if (users.length === 0) {
      users = [...INITIAL_DEMO_USERS];
    }
    this.saveUsers(users);
    const newCurrent = users[0];
    this.setCurrentUser(newCurrent);
    return { remainingUsers: users, newCurrent };
  },

  // FILES (LEARNING MATERIALS)
  getFiles(): LearningMaterial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FILES);
      if (!data) {
        safeSetItem(STORAGE_KEYS.FILES, JSON.stringify(OFFICIAL_MATERIALS));
        return OFFICIAL_MATERIALS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        safeSetItem(STORAGE_KEYS.FILES, JSON.stringify(OFFICIAL_MATERIALS));
        return OFFICIAL_MATERIALS;
      }
      return parsed;
    } catch {
      return OFFICIAL_MATERIALS;
    }
  },

  saveFiles(files: LearningMaterial[]) {
    // Attempt to save full list
    let success = safeSetItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    if (!success) {
      // If quota exceeded due to large base64, strip data URL for older uploads
      const trimmed = files.map(f => {
        if (!f.isOfficial && f.url.startsWith('data:') && f.url.length > 50000) {
          return { ...f, url: '#' };
        }
        return f;
      });
      safeSetItem(STORAGE_KEYS.FILES, JSON.stringify(trimmed));
    }
  },

  addFile(file: LearningMaterial): LearningMaterial[] {
    const files = [file, ...this.getFiles()];
    this.saveFiles(files);
    return files;
  },

  deleteFile(fileId: string): LearningMaterial[] {
    const files = this.getFiles().filter(f => f.id !== fileId);
    this.saveFiles(files);
    return files;
  },

  // VIDEOS
  getVideos(): VideoItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (!data) {
        safeSetItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
        return INITIAL_VIDEOS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        safeSetItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
        return INITIAL_VIDEOS;
      }
      return parsed;
    } catch {
      return INITIAL_VIDEOS;
    }
  },

  saveVideos(videos: VideoItem[]) {
    safeSetItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  },

  addVideo(video: VideoItem): VideoItem[] {
    const videos = [video, ...this.getVideos()];
    this.saveVideos(videos);
    return videos;
  },

  deleteVideo(videoId: string): VideoItem[] {
    const videos = this.getVideos().filter(v => v.id !== videoId);
    this.saveVideos(videos);
    return videos;
  },

  // CARBON DATA
  getCarbonData(): CarbonData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARBON);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return {
      electricityKwh: 0,
      singleUsePlasticCount: 0,
      petrolMotorbikeKm: 0,
      electricBikeKm: 0,
      busKm: 0,
      bicycleWalkingKm: 0,
      totalKgCO2e: 0,
      updatedAt: new Date().toISOString(),
    };
  },

  saveCarbonData(data: CarbonData) {
    safeSetItem(STORAGE_KEYS.CARBON, JSON.stringify(data));
  },

  // GREEN ACTION LOGS
  getLogs(): GreenActionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (!data) {
        safeSetItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
        return INITIAL_LOGS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        safeSetItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
        return INITIAL_LOGS;
      }
      return parsed;
    } catch {
      return INITIAL_LOGS;
    }
  },

  addLog(log: GreenActionLog): GreenActionLog[] {
    const logs = [log, ...this.getLogs()];
    safeSetItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return logs;
  },

  // SETTINGS
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const defaults: AppSettings = {
      academicYear: DEFAULT_ACADEMIC_YEAR,
      userApiKey: '',
      schoolName: DEFAULT_SCHOOL,
      theme: 'light',
    };
    safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaults));
    return defaults;
  },

  saveSettings(settings: AppSettings) {
    safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // SAVED LESSON PLANS
  getSavedPlans(): any[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PLANS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePlan(plan: any) {
    const plans = [plan, ...this.getSavedPlans()];
    safeSetItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(plans));
  }
};
