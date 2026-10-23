import { UserProfile, VideoItem, GreenActionLog } from '../types';

export const DEFAULT_SCHOOL = 'Trường THCS Nguyễn Đáng';
export const DEFAULT_TEACHER = 'Trương Văn Nghĩa';

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`LocalStorage write failed for key "${key}":`, e);
    return false;
  }
}

// -------------------------------------------------------------
// 1. DANH SÁCH TÀI KHOẢN HỆ THỐNG (CỐ ĐỊNH VĨNH VIỄN)
// -------------------------------------------------------------
export const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    id: 'gv_demo',
    name: DEFAULT_TEACHER,
    role: 'teacher',
    school: DEFAULT_SCHOOL,
    grade: 'Khối 8',
    subject: 'Giáo dục Công dân',
    department: '',
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
  {
    id: 'gv_01',
    name: 'Nguyễn Thị Hồng Điệp',
    role: 'teacher',
    school: DEFAULT_SCHOOL,
    grade: 'Khối 8',
    subject: 'Môn Ngữ văn',
    department: 'Tổ Ngữ văn',
    email: 'hongdiep@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'gv_02',
    name: 'Nguyễn Thị Ngọc Yến',
    role: 'teacher',
    school: DEFAULT_SCHOOL,
    grade: 'Khối 6',
    subject: 'Môn Ngữ văn',
    department: 'Tổ Ngữ văn',
    email: 'ngocyen@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'gv_03',
    name: 'Thạch Thị Phương',
    role: 'teacher',
    school: DEFAULT_SCHOOL,
    grade: 'Khối 7',
    subject: 'Môn Ngữ văn',
    department: 'Tổ Ngữ văn',
    email: 'thachthiphuong@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'gv_04',
    name: 'Nguyễn Thị Cẩm Giang',
    role: 'teacher',
    school: DEFAULT_SCHOOL,
    grade: 'Khối 7',
    subject: 'Môn Ngữ văn',
    department: 'Tổ Ngữ văn',
    email: 'camgiang@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'gv_05',
    name: 'Võ Văn Đệ',
    role: 'teacher',
    school: DEFAULT_SCHOOL,
    grade: 'Khối 9',
    subject: 'Môn Ngữ văn',
    department: 'Tổ Ngữ văn',
    email: 'vovande@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'gv_06',
    name: 'Nguyễn Kim Đồng',
    role: 'teacher',
    school: DEFAULT_SCHOOL,
    grade: 'Khối 7',
    subject: 'Môn Ngữ văn',
    department: 'Tổ Ngữ văn',
    email: 'kimdong@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'hs_01',
    name: 'Nguyễn Văn An',
    role: 'student',
    school: DEFAULT_SCHOOL,
    grade: 'Lớp 8/1',
    department: '',
    email: 'nguyenvanan@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'hs_05',
    name: 'Sĩ Hồng Hoa',
    role: 'student',
    school: DEFAULT_SCHOOL,
    grade: 'Lớp 8/1',
    department: '',
    email: 'sihonghoa@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'hs_06',
    name: 'La Văn Hậu',
    role: 'student',
    school: DEFAULT_SCHOOL,
    grade: 'Lớp 8/1',
    department: '',
    email: 'lavanhau@thcsnguyendang.edu.vn',
    createdAt: '2026-09-01T08:00:00Z',
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid_1',
    title: 'Giáo dục bảo vệ môi trường trong trường THCS',
    description: 'Tài liệu video hướng dẫn các hoạt động xanh trong nhà trường.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    grade: 'Khối 8',
    subject: 'Giáo dục công dân',
    tag: 'Môi trường',
    addedBy: DEFAULT_TEACHER,
    addedAt: '2026-09-01',
  },
  {
    id: 'vid_3',
    title: 'Hành động nhỏ vì Hành tinh Xanh - Tiết kiệm điện năng học đường',
    description: 'Chiến dịch tắt thiết bị điện khi ra khỏi lớp học và sử dụng ánh sáng tự nhiên.',
    url: 'https://www.youtube.com/watch?v=V01Q3xjS1Ek',
    embedUrl: 'https://www.youtube.com/embed/V01Q3xjS1Ek',
    grade: 'Lớp 7',
    subject: 'Công nghệ',
    tag: 'Tiết kiệm năng lượng',
    addedBy: DEFAULT_TEACHER,
    addedAt: '2026-09-04',
  }
];

export const INITIAL_LOGS: GreenActionLog[] = [
  {
    id: 'log_1',
    userId: 'gv_demo',
    userName: DEFAULT_TEACHER,
    actionType: 'electricity',
    title: 'Tắt quạt và đèn khi kết thúc tiết học 5',
    description: 'Nhắc nhở học sinh tắt toàn bộ 4 quạt trần và 6 bóng đèn tuýp trước khi ra về.',
    impactKm: 0.5,
    timestamp: '2026-09-05T11:30:00Z',
  }
];

// -------------------------------------------------------------
// 3. ĐỐI TƯỢNG STORAGE AN TOÀN TUYỆT ĐỐI (TRÁNH MỌI LỖI RUNTIME)
// -------------------------------------------------------------
export const storage = {
  getUsers: (): UserProfile[] => {
    try {
      const saved = localStorage.getItem('ecobot_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_USERS;
  },
  saveUsers: (users: UserProfile[]) => {
    safeSetItem('ecobot_users', JSON.stringify(users));
  },
  getLogs: (): GreenActionLog[] => {
    try {
      const saved = localStorage.getItem('ecobot_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LOGS;
  },
  saveLogs: (logs: GreenActionLog[]) => {
    safeSetItem('ecobot_logs', JSON.stringify(logs));
  },
  getVideos: (): VideoItem[] => {
    try {
      const saved = localStorage.getItem('ecobot_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VIDEOS;
  },
  saveVideos: (videos: VideoItem[]) => {
    safeSetItem('ecobot_videos', JSON.stringify(videos));
  },
  getCurrentUser: (): UserProfile => {
    try {
      const saved = localStorage.getItem('ecobot_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_USERS[0];
  },
  setCurrentUser: (user: UserProfile) => {
    if (user) {
      safeSetItem('ecobot_current_user', JSON.stringify(user));
    }
  }
};
