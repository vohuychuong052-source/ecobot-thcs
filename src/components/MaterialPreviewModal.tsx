import React from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { LearningMaterial } from '../types';

interface MaterialPreviewModalProps {
  material: LearningMaterial | null;
  onClose: () => void;
}

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({
  material,
  onClose,
}) => {
  if (!material) return null;

  const isPdf = material.fileType === 'pdf' || material.fileName.toLowerCase().endsWith('.pdf');
  const isDoc = material.fileType === 'doc' || material.fileType === 'docx';
  const isVideo = material.fileType === 'video';
  const isImage = material.fileType === 'image';

  // For remote or local URLs
  const isLocalAsset = material.url.startsWith('/') || material.url.startsWith('blob:') || material.url.startsWith('data:');
  const googleViewerUrl = isLocalAsset
    ? material.url // Served directly by Vite server
    : `https://docs.google.com/viewer?url=${encodeURIComponent(material.url)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0A192F] text-white border-b border-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-xl">
                {material.title}
              </h3>
              <p className="text-[11px] text-slate-300">
                {material.subject} • {material.grade} • {material.fileSize}
                {material.isOfficial && (
                  <span className="ml-2 text-emerald-400 font-semibold">
                    ✓ Học liệu chính thức Bộ GD&ĐT
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={material.url}
              download={material.fileName}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải về</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Viewer Body */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center">
          {isPdf ? (
            <iframe
              src={googleViewerUrl}
              title={material.title}
              className="w-full h-full border-0"
            />
          ) : isImage ? (
            <div className="max-h-full max-w-full p-4 flex items-center justify-center">
              <img
                src={material.url}
                alt={material.title}
                className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          ) : isVideo ? (
            <video
              src={material.url}
              controls
              className="max-h-[70vh] max-w-full rounded-lg shadow-lg"
            >
              Trình duyệt của bạn không hỗ trợ phát thẻ video.
            </video>
          ) : (
            <div className="text-center p-8 space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-base">
                Tài liệu định dạng Word/Office
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tệp <strong>{material.fileName}</strong> được tạo dưới dạng văn bản Microsoft Word chuẩn UTF-8. Nhấn nút bên dưới để tải về và mở trực tiếp bằng phần mềm Word hoặc Google Docs.
              </p>
              <a
                href={material.url}
                download={material.fileName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all"
              >
                <Download className="w-4 h-4" /> Tải về máy (.doc)
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="truncate">
            Người tải lên: <strong>{material.uploadedBy}</strong> ({material.uploadedAt})
          </span>
          <span className="text-[11px] text-slate-400">
            Xem trực tiếp qua EcoBot Document Viewer
          </span>
        </div>
      </div>
    </div>
  );
};
