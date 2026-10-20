export type Role = 'teacher' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  school: string;
  grade: string;
  subject?: string;
  department?: string; // Bắt buộc cho giáo viên, ban đầu để trống cho GV tự điền
  email?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CarbonData {
  electricityKwh: number;
  singleUsePlasticCount: number;
  petrolMotorbikeKm: number;
  electricBikeKm: number;
  busKm: number;
  bicycleWalkingKm: number;
  totalKgCO2e: number;
  updatedAt: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  category: string; // e.g. "Sách giáo khoa", "Văn bản hướng dẫn", "Kế hoạch bài dạy", "Tài liệu chuyên đề"
  subject: string;
  grade: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'image' | 'video' | 'other';
  url: string; // local public url or data URL
  uploadedBy: string;
  uploadedAt: string;
  isOfficial?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  embedUrl: string;
  grade: string;
  subject?: string;
  tag?: string;
  addedBy: string;
  addedAt: string;
}

export interface GreenActionLog {
  id: string;
  userId: string;
  userName: string;
  actionType: 'electricity' | 'plastic' | 'transport' | 'tree' | 'recycle';
  title: string;
  description: string;
  savedCO2Kg: number;
  points: number;
  date: string;
}

export interface LessonPlan5512 {
  id: string;
  schoolName: string;
  department: string;
  teacherName: string;
  academicYear: string;
  subject: string;
  grade: string;
  topic: string;
  periodCount: number;
  createdAt: string;
  content: string; // Markdown or detailed text conforming to Official Công văn 5512
}

export const GRADE_OPTIONS = ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"] as const;

export const SUBJECT_OPTIONS = [
  "Giáo dục công dân",
  "Khoa học Tự nhiên",
  "Ngữ văn",
  "Toán học",
  "Tiếng Anh",
  "Lịch sử và Địa lý",
  "Tin học",
  "Công nghệ",
  "Nghệ thuật (Âm nhạc/Mỹ thuật)",
  "Hoạt động trải nghiệm, hướng nghiệp",
  "Giáo dục thể chất"
] as const;

export const DEFAULT_SCHOOL = "Trường THCS Nguyễn Đáng";
export const DEFAULT_TEACHER = "Trương Văn Nghĩa";
export const DEFAULT_ACADEMIC_YEAR = "2026-2027";
export const DEFAULT_SAMPLE_PLAN_INFO = "Khối: Lớp 9 | Môn: Giáo dục Công dân THCS";
