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
  }
  // --- THÊM GIÁO VIÊN MỚI ---
    {
      id: 'gv_01',
      name: 'Nguyễn Thị Hồng Điệp',
      role: 'teacher',
      school: DEFAULT_SCHOOL,
      grade: 'Khối 8',
      subject: 'Môn Ngữ văn',
      department: 'Tổ Ngữ văn',
      email: 'nguyenthihongdiep@thcsnguyendang.edu.vn',
      phone: '0912345678',
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
      email: 'nguyenthingọyen@thcsnguyendang.edu.vn',
      phone: '0919028832',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'gv_03',
      name: 'Thạch Thị Phươne',
      role: 'teacher',
      school: DEFAULT_SCHOOL,
      grade: 'Khối 7',
      subject: 'Môn Ngữ văn',
      department: 'Tổ Ngữ văn',
      email: 'thachthiphuone@thcsnguyendang.edu.vn',
      phone: '0398289792',
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
      email: 'nguyenthicamgiang@thcsnguyendang.edu.vn',
      phone: '0986828671',
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
      email: 'vovandep@thcsnguyendang.edu.vn',
      phone: '0912364793',
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
      email: 'nguyenkimdong@thcsnguyendang.edu.vn',
      phone: '0913156782',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'gv_07',
      name: 'Lê Thị Sớm',
      role: 'teacher',
      school: DEFAULT_SCHOOL,
      grade: 'Khối 9',
      subject: 'Môn Ngữ văn',
      department: 'Tổ Ngữ văn',
      email: 'lethisom@thcsnguyendang.edu.vn',
      phone: '0912237818',
      createdAt: '2026-09-01T08:00:00Z',
    },
    // --- THÊM HỌC SINH MỚI ---
    {
      id: 'hs_01',
      name: 'Trần Kim Anh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'trankimanh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_02',
      name: 'Nguyễn Ngọc Lành',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'nguyenngoclanh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_03',
      name: 'Hồ Phước Toản',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'hophuoctoan@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_04',
      name: 'Nguyễn An Nhiên',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'nguyenannhien@thcsnguyendang.edu.vn',
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
    },
    {
      id: 'hs_07',
      name: 'Cam Hoàng Ái',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'camhoangai@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_08',
      name: 'Thạch Si Phas',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'thachsiphas@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_09',
      name: 'Vũ Hoàng',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'vuhoang@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_10',
      name: 'Bùi Hoài Hận',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 8/1',
      department: '',
      email: 'buihoaihan@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_11',
      name: 'Nguyễn Thanh Bình',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'nguyenthanbinh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_12',
      name: 'Hà Thanh Vũ',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'hathanhvu@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
        {
      id: 'hs_13',
      name: 'Sơn Thanh Tú',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'sonthanhtu@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },{
      id: 'hs_14',
      name: 'Kim Thị Nga',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'kimthinga@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_15',
      name: 'Trần Kim Ân',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'trankiman@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_16',
      name: 'La Thiên Bảo',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'lathienbao@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_17',
      name: 'Cao Thanh Bình',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'caothanhbinh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_18',
      name: 'Kim Thị Sanh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'kimthisanh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_19',
      name: 'Trần Trường An',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'trantruongan@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_20',
      name: 'Lê chí Hiếu',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 7/4',
      department: '',
      email: 'lechihieu@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_21',
      name: 'Lê Trung Dũng',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'letrungdung@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_22',
      name: 'Hoàng Thị Lanh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'hoangthilanh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_23',
      name: 'Kim Sa',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'kimsa@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_24',
      name: 'Nguyễn Thị Sen',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'nguyensen@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_25',
      name: 'Hàn Hạnh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'hanhanh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_26',
      name: 'Nông Đức Phú',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'nongphu@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_27',
      name: 'Lê Văn Nam',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'lenam@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_28',
      name: 'Cam Văn Ngọt',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'camngot@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_29',
      name: 'Thái Hoàng',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'thaihoang@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_30',
      name: 'Sĩ Quốc Minh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'quocminh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_31',
      name: 'La Quốc Hà',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'quocha@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    }, 
    {
      id: 'hs_32',
      name: 'Hồng Thiên Bảo',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'thienbao@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    }, {
      id: 'hs_33',
      name: 'Sĩ Như Huỳnh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'sinhuhuynh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    }, 
    {
      id: 'hs_34',
      name: 'Trần Hồng Lụa',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'tranhonglua@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    }, 
    {
      id: 'hs_35',
      name: 'Ngũ Bảo Ngọc',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 6/3',
      department: '',
      email: 'baongoc@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_36',
      name: 'Sơn Văn',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'sonvan@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_37',
      name: 'Ngân Phương Lan',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'nganphuonglan@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_38',
      name: 'Nguyễn Hải Minh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'haiminh@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_39',
      name: 'Lê Trung Hưng',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'letrunghung@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_40',
      name: 'Sơn Yên',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'sonyen@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_41',
      name: 'La Ngọc Diệp',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'Langocdiep@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_42',
      name: 'Lê Trí Tín',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'letritin@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_43',
      name: 'Hồng Văn Bảo',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'hongvanbao@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_44',
      name: 'Tạ Phước An',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'taphuocan@thcsnguyendang.edu.vn',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'hs_45',
      name: 'Bùi Hồng Minh',
      role: 'student',
      school: DEFAULT_SCHOOL,
      grade: 'Lớp 9/3',
      department: '',
      email: 'buihongminh@thcsnguyendang.edu.vn',
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
    title: 'Tìm hiểu về tác hại của RÁC THẢI NHỰA trong 6 phút ',
    description: 'Ô nhiễm nhựa.',
    url: 'https://www.youtube.com/watch?v=BujzV_R60us',
    embedUrl: 'https://www.youtube.com/watch?v=BujzV_R60us',
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
    embedUrl: 'https://www.youtube.com/watch?v=SlS--5M9Ypw',
    grade: 'Lớp 9',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  }
  {
    id: 'vid_4',
    title: 'Những người trẻ lan tỏa phong trào dọn rác',
    description: 'Chiến dịch dọn dẹp rác thải trên các dòng sông.',
    url: 'https://www.youtube.com/watch?v=1_St0l7GkDQ&t=5s',
    embedUrl: 'https://www.youtube.com/watch?v=1_St0l7GkDQ&t=5s',
    grade: 'Lớp 9',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  }
  {
    id: 'vid_5',
    title: 'Một hành động nhỏ - ý nghĩa lớn',
    description: 'Dọn rác thải và phân loại rác thải nhựa.',
    url: 'https://www.youtube.com/watch?v=bzu8_OfEIY4',
    embedUrl: 'https://www.youtube.com/watch?v=bzu8_OfEIY4',
    grade: 'Lớp 7',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  }
  {
    id: 'vid_6',
    title: 'Sáng Tạo Xanh',
    description: 'Dùng thân chuối để làm hộp đựng.',
    url: 'https://www.youtube.com/watch?v=fffAanh38EY',
    embedUrl: 'https://www.youtube.com/watch?v=fffAanh38EY',
    grade: 'Lớp 7',
    subject: 'Giáo dục công dân',
    tag: 'Tiết kiệm năng lượng',
    addedBy: 'Trương Văn Nghĩa',
    addedAt: '2026-09-04',
  }
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
