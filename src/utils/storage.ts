import { UserProfile, VideoItem, GreenActionLog, EducationalResource } from '../types';

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
// DANH SÁCH TÀI KHOẢN MẶC ĐỊNH (CÓ ĐỊNH VĨNH VIỄN TRÊN HỆ THỐNG)
// -------------------------------------------------------------
export const INITIAL_DEMO_USERS: UserProfile[] = [
  // 1. Tài khoản Demo gốc
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

  // 2. Danh sách GIÁO VIÊN CHÍNH THỨC
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

  // 3. Danh sách HỌC SINH CHÍNH THỨC
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
