import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  File,
  ShieldCheck,
  Plus
} from 'lucide-react';
import {
  LearningMaterial,
  UserProfile,
  GRADE_OPTIONS,
  SUBJECT_OPTIONS
} from '../types';
import { storage } from '../utils/storage';
import { MaterialPreviewModal } from './MaterialPreviewModal';

interface LearningMaterialsViewProps {
  currentUser: UserProfile;
  materials: LearningMaterial[];
  setMaterials: React.Dispatch<React.SetStateAction<LearningMaterial[]>>;
}

export const LearningMaterialsView: React.FC<LearningMaterialsViewProps> = ({
  currentUser,
  materials,
  setMaterials,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [isDragging, setIsDragging] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<LearningMaterial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý upload file kéo thả & chọn file
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      let fileType: LearningMaterial['fileType'] = 'other';
      if (ext === 'pdf') fileType = 'pdf';
      else if (['doc', 'docx'].includes(ext)) fileType = 'doc';
      else if (['xls', 'xlsx'].includes(ext)) fileType = 'xls';
      else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) fileType = 'image';
      else if (['mp4', 'webm', 'mov'].includes(ext)) fileType = 'video';

      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        const newMat: LearningMaterial = {
          id: 'user_mat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: fileType === 'doc' ? 'Kế hoạch bài dạy' : 'Tài liệu tham khảo',
          subject: currentUser.subject || 'Giáo dục công dân',
          grade: currentUser.grade || 'Lớp 8',
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          fileType,
          url: resultUrl,
          uploadedBy: currentUser.name,
          uploadedAt: new Date().toISOString().split('T')[0],
          isOfficial: false,
        };

        const updated = storage.addFile(newMat);
        setMaterials(updated);
        setUploadSuccessMessage(`Đã tải lên tệp "${file.name}" vào Kho học liệu thành công!`);
        setTimeout(() => setUploadSuccessMessage(''), 3500);
      };

      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = (id: string) => {
    const updated = storage.deleteFile(id);
    setMaterials(updated);
    setDeleteConfirmId(null);
  };

  // Lọc tài liệu
  const filteredMaterials = materials.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = filterGrade === 'all' || m.grade === filterGrade;
    const matchSubject = filterSubject === 'all' || m.subject === filterSubject;
    const matchCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchSearch && matchGrade && matchSubject && matchCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-rose-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      case 'image':
        return <FileImage className="w-6 h-6 text-amber-500" />;
      case 'video':
        return <FileVideo className="w-6 h-6 text-purple-500" />;
      default:
        return <File className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-[#0A192F] to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              📁 Kho Học Liệu Số & Thư Viện Chuyên Môn
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kho Học liệu Động & Sách Giáo Khoa THCS
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Tích hợp đầy đủ sách giáo khoa GDCD, Ngữ văn THCS, Công văn 5512, Công văn 7991 của Bộ GD&ĐT. Hỗ trợ xem trực tiếp và lưu trữ bền vững.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Tải lên tài liệu mới
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4"
          />
        </div>

        {uploadSuccessMessage && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Drag & Drop Zone theo mục 5 */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-emerald-400'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white">
          Kéo & Thả tệp học liệu vào đây hoặc nhấp để chọn tệp từ thiết bị
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
          Hỗ trợ định dạng: <strong>PDF, Word (.doc, .docx), Excel (.xlsx), Hình ảnh, Video MP4</strong>. Tự động lưu bền vững vào hệ thống lưu trữ LocalStorage.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài liệu, SGK, công văn..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Grade */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="all">Tất cả Khối lớp</option>
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Subject */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 max-w-[160px] truncate"
          >
            <option value="all">Tất cả Môn học</option>
            {SUBJECT_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="all">Tất cả Thể loại</option>
            <option value="Sách giáo khoa">Sách giáo khoa</option>
            <option value="Văn bản hướng dẫn">Văn bản hướng dẫn</option>
            <option value="Kế hoạch bài dạy">Kế hoạch bài dạy</option>
            <option value="Tài liệu tham khảo">Tài liệu tham khảo</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 shrink-0">
                  {getFileIcon(item.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                      {item.grade}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                    {item.isOfficial && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Chính thức
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-1 line-clamp-2" title={item.title}>
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div className="truncate">Tệp: <span className="text-slate-600 dark:text-slate-300">{item.fileName}</span></div>
                <div className="flex items-center justify-between text-[10px]">
                  <span>Môn: <strong>{item.subject}</strong></span>
                  <span>{item.fileSize}</span>
                </div>
              </div>
            </div>

            {/* Actions: Preview, Download, Delete */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {item.uploadedBy}
              </span>

              <div className="flex items-center gap-1.5">
                {/* Xem trực tiếp (Preview) theo mục 5 */}
                <button
                  onClick={() => setPreviewMaterial(item)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
                  title="Xem trước trực tiếp trên trang"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem</span>
                </button>

                {/* Tải về */}
                <a
                  href={item.url}
                  download={item.fileName}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Tải tệp về máy"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>

                {/* Xóa học liệu (nếu tài liệu sai/không cần thiết) */}
                {!item.isOfficial && (
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Không tìm thấy học liệu phù hợp với bộ lọc hiện tại
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterGrade('all');
              setFilterSubject('all');
              setFilterCategory('all');
            }}
            className="mt-2 text-xs text-emerald-600 font-bold hover:underline"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Xác nhận xóa tài liệu?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tài liệu này sẽ bị xóa khỏi kho học liệu và bộ nhớ máy tính. Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Preview Modal */}
      <MaterialPreviewModal
        material={previewMaterial}
        onClose={() => setPreviewMaterial(null)}
      />
    </div>
  );
};
