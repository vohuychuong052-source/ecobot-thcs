import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  BookOpen,
  School,
  User,
  Clock,
  Layers,
  FileText,
  AlertCircle,
  ExternalLink,
  Save
} from 'lucide-react';
import {
  UserProfile,
  GRADE_OPTIONS,
  SUBJECT_OPTIONS,
  DEFAULT_SCHOOL,
  DEFAULT_TEACHER,
  DEFAULT_ACADEMIC_YEAR,
  DEFAULT_SAMPLE_PLAN_INFO,
  LearningMaterial
} from '../types';
import { exportToWordDocument } from '../utils/wordExport';
import { storage } from '../utils/storage';

interface LessonPlannerViewProps {
  currentUser: UserProfile;
  academicYear: string;
  onMaterialAdded?: (material: LearningMaterial) => void;
}

export const LessonPlannerView: React.FC<LessonPlannerViewProps> = ({
  currentUser,
  academicYear,
  onMaterialAdded,
}) => {
  // Cố định thông tin ban đầu theo mục 2 & 7
  // Kế hoạch bài dạy mẫu: "Khối: Lớp 9 | Môn: Giáo dục Công dân THCS"
  const [selectedGrade, setSelectedGrade] = useState<string>('Lớp 9');
  const [selectedSubject, setSelectedSubject] = useState<string>('Giáo dục công dân');
  const [schoolName, setSchoolName] = useState<string>(currentUser.school || DEFAULT_SCHOOL);
  const [teacherName, setTeacherName] = useState<string>(currentUser.name || DEFAULT_TEACHER);
  // Dòng "Tổ chuyên môn" để trống hoàn toàn để giáo viên tự nhập tên tổ của mình theo mục 3 & 7
  const [department, setDepartment] = useState<string>(currentUser.department || '');
  const [topic, setTopic] = useState<string>('Bảo vệ môi trường và tài nguyên thiên nhiên (Tích hợp mô phỏng Dấu chân Carbon)');
  const [periodCount, setPeriodCount] = useState<number>(2);
  const [environmentalFocus, setEnvironmentalFocus] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToRepo, setSavedToRepo] = useState<boolean>(false);

  // Đồng bộ thông tin khi currentUser được cập nhật từ Cài đặt/Hồ sơ
  React.useEffect(() => {
    setSchoolName(currentUser.school || DEFAULT_SCHOOL);
    setTeacherName(currentUser.name || DEFAULT_TEACHER);
    setDepartment(currentUser.department || '');
  }, [currentUser]);

  // Danh mục chủ đề mẫu gợi ý tích hợp theo 11 môn THCS
  const sampleTopics: Record<string, string[]> = {
    'Giáo dục công dân': [
      'Bảo vệ môi trường và tài nguyên thiên nhiên (Tích hợp mô phỏng Dấu chân Carbon)',
      'Tiêu dùng thông minh và giảm thiểu rác thải nhựa học đường',
      'Sống có lý tưởng và trách nhiệm bảo vệ môi trường của công dân',
      'Bảo tồn di sản văn hóa và thiên nhiên Việt Nam'
    ],
    'Khoa học Tự nhiên': [
      'Năng lượng tái tạo và giải pháp giảm phát thải khí nhà kính',
      'Đa dạng sinh học và các biện pháp bảo tồn hệ sinh thái',
      'Không khí và ô nhiễm không khí - Đo lường bụi mịn PM2.5',
      'Biến đổi khí hậu toàn cầu và sự ấm lên của Trái Đất'
    ],
    'Ngữ văn': [
      'Văn bản thông tin: "Trái Đất - Cái nôi của sự sống" & "Thủy tiên tháng Một"',
      'Nghị luận xã hội về lối sống xanh và bảo vệ hành tinh',
      'Tập làm bài thơ bốn chữ / năm chữ về thiên nhiên quê hương',
      'Văn bản thông tin: "Hành tinh của chúng ta" (David Attenborough)'
    ],
    'Địa lý / Lịch sử': [
      'Biến đổi khí hậu và tác động đến đồng bằng sông Cửu Long',
      'Bảo vệ tài nguyên khoáng sản và rừng đầu nguồn Việt Nam',
    ],
    'Tin học': [
      'Ứng dụng Trí tuệ nhân tạo (AI) và IoT trong quản lý năng lượng xanh',
      'Thiết kế bảng tính mô phỏng và vẽ biểu đồ tiêu thụ điện lớp học',
    ],
    'Công nghệ': [
      'Mô hình nông nghiệp xanh, tuần hoàn và trồng cây không đất',
      'Hệ thống điện năng lượng mặt trời áp mái tại trường học',
    ],
    'Hoạt động trải nghiệm, hướng nghiệp': [
      'Dự án "Trường học Không rác thải nhựa - Green School 2026"',
      'Xây dựng câu lạc bộ Tuyên truyền viên Sinh thái EcoBot',
    ]
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    setSavedToRepo(false);

    try {
      const userSettings = storage.getSettings();
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: selectedGrade,
          topic,
          periodCount,
          schoolName,
          teacherName,
          department: department.trim(),
          academicYear,
          environmentalFocus,
          userApiKey: userSettings.userApiKey || '',
        }),
      });

      const data = await response.json();
      if (data.success && data.content) {
        setGeneratedPlan(data.content);
        setIsAiGenerated(data.isAiGenerated);
      } else {
        throw new Error(data.error || 'Lỗi tạo kế hoạch bài dạy');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback generator directly in client if server is unreachable
      const fallbackText = generateClientFallbackPlan();
      setGeneratedPlan(fallbackText);
      setIsAiGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  const generateClientFallbackPlan = () => {
    const dept = department ? department : '...................................................';
    return `# KẾ HOẠCH BÀI DẠY (CHUẨN CÔNG VĂN 5512/BGDĐT-GDTrH)
**TRƯỜNG:** ${schoolName}  
**TỔ CHUYÊN MÔN:** ${dept}  
**HỌ VÀ TÊN GIÁO VIÊN:** ${teacherName}  
**NĂM HỌC:** ${academicYear}  

---

### BÀI DẠY: ${topic.toUpperCase()}
**MÔN:** ${selectedSubject} | **KHỐI:** ${selectedGrade}  
**Thời lượng:** ${periodCount} tiết  

---

## I. MỤC TIÊU BÀI HỌC

### 1. Về kiến thức
- Học sinh phân tích và nắm vững các khái niệm, quy luật và nội dung cốt lõi của bài học: **${topic}** theo chuẩn chương trình GDPT 2018.
- Hiểu rõ mối liên hệ giữa lý thuyết bài học và ý thức bảo vệ môi trường, giảm phát thải carbon (CO2e) trong học đường và đời sống.
- Vận dụng phần mềm mô phỏng **EcoBot** để đo lường, đánh giá thực trạng tiêu thụ tài nguyên tại trường THCS Nguyễn Đáng.

### 2. Về năng lực
**a) Năng lực chung:**
- **Năng lực tự chủ và tự học:** Tự giác nghiên cứu SGK, tài liệu tham khảo và chuẩn bị số liệu trước buổi học.
- **Năng lực giao tiếp và hợp tác:** Phối hợp nhóm hiệu quả, lắng nghe và phản biện khoa học khi thảo luận về dự án sinh thái.
- **Năng lực giải quyết vấn đề và sáng tạo:** Đề xuất được các giải pháp cải tiến môi trường học đường có tính khả thi cao.

**b) Năng lực đặc thù môn ${selectedSubject}:**
- Rèn luyện năng lực tư duy, xử lý tình huống và vận dụng kiến thức chuyên môn của bộ môn ${selectedSubject} cấp THCS.

### 3. Về phẩm chất
- **Yêu nước & Trách nhiệm:** Nâng cao lòng yêu thiên nhiên đất nước, có tinh thần trách nhiệm bảo vệ môi trường và ứng phó biến đổi khí hậu.
- **Chăm chỉ & Trung thực:** Thu thập số liệu kiểm kê carbon trung thực, kiên trì theo dõi tiến trình giảm phát thải.

---

## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU

### 1. Đối với giáo viên
- Máy tính, máy chiếu tương tác kết nối Internet.
- Nền tảng số **EcoBot - Hệ sinh thái Lớp học Xanh & Mô phỏng Dấu chân Carbon**.
- Sách giáo khoa ${selectedSubject} ${selectedGrade}, Kế hoạch bài dạy, phiếu học tập số 1 & 2.
- Video tình huống về biến đổi khí hậu và rác thải nhựa học đường.

### 2. Đối với học sinh
- Sách giáo khoa ${selectedSubject} ${selectedGrade}, vở ghi chép, bút dạ, bảng nhóm.
- Số liệu khảo sát thực tế của lớp: Số kWh điện tiêu thụ/tuần, số chai nhựa/ly nhựa dùng một lần.

---

## III. TIẾN TRÌNH DẠY HỌC

### HOẠT ĐỘNG 1: MỞ ĐẦU / KHỞI ĐỘNG (7 - 10 phút)
**a. Mục tiêu:** Tạo tâm thế hứng khởi, kích thích nhu cầu khám phá bài học "${topic}".  
**b. Nội dung:** Quan sát video/hình ảnh thực tế và trả lời câu hỏi dẫn dắt về tác động môi trường.  
**c. Sản phẩm:** Ý kiến phản hồi nhanh của học sinh trên bảng nhóm hoặc công cụ tương tác.  
**d. Tổ chức thực hiện:**
- **Bước 1 (Chuyển giao nhiệm vụ):** Giáo viên chiếu tình huống: *"Mỗi ngày lớp học chúng ta tiêu thụ bao nhiêu điện năng và tạo ra bao nhiêu rác thải nhựa?"* Yêu cầu thảo luận cặp đôi trong 2 phút.
- **Bước 2 (Thực hiện nhiệm vụ):** Học sinh trao đổi, đối chiếu thói quen sinh hoạt tại lớp.
- **Bước 3 (Báo cáo, thảo luận):** 2 - 3 học sinh phát biểu, chỉ ra các nguyên nhân gây lãng phí.
- **Bước 4 (Kết luận, nhận định):** Giáo viên nhận xét, định hướng vào bài học mới.

---

### HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (20 - 25 phút)
**a. Mục tiêu:** Làm chủ các kiến thức trọng tâm của bài; hiểu sâu sắc các khái niệm và nguyên lý bài học.  
**b. Nội dung:** Nghiên cứu SGK, giải quyết nhiệm vụ phiếu học tập và thực hành phân tích trên EcoBot.  
**c. Sản phẩm:** Sơ đồ tư duy kiến thức bài học và bảng phân tích dữ liệu phát thải.  
**d. Tổ chức thực hiện:**
- **Bước 1 (Chuyển giao nhiệm vụ):** Chia lớp thành 4 nhóm chuyên gia. Giao nhiệm vụ tìm hiểu các mạch nội dung theo SGK và tích hợp công cụ tính toán carbon (Điện: 0.8 kg CO2e/kWh, Nhựa: 0.075 kg CO2e/SP, Đi lại).
- **Bước 2 (Thực hiện nhiệm vụ):** Học sinh làm việc nhóm, đọc văn bản, thảo luận và hoàn thành phiếu học tập. Giáo viên theo dõi, hướng dẫn kịp thời.
- **Bước 3 (Báo cáo, thảo luận):** Đại diện các nhóm báo cáo sản phẩm, các nhóm khác nhận xét, bổ sung.
- **Bước 4 (Kết luận, nhận định):** Giáo viên chuẩn hóa kiến thức, ghi chép nội dung chính lên bảng.

---

### HOẠT ĐỘNG 3: LUYỆN TẬP (8 - 10 phút)
**a. Mục tiêu:** Củng cố kiến thức, rèn luyện kỹ năng giải quyết bài tập và tình huống thực tiễn.  
**b. Nội dung:** Hoàn thành 4 câu hỏi trắc nghiệm định hướng năng lực và 1 bài tập tình huống thực tế.  
**c. Sản phẩm:** Đáp án chính xác và lời giải thích có căn cứ khoa học của học sinh.  
**d. Tổ chức thực hiện:**
- **Bước 1:** Giáo viên phát đề bài / câu hỏi tương tác.
- **Bước 2:** Học sinh suy nghĩ độc lập trong 3 phút, ghi đáp án vào vở.
- **Bước 3:** Tổ chức chữa bài, khuyến khích học sinh giải thích phương án đúng/sai.
- **Bước 4:** Giáo viên chốt kiến thức và biểu dương học sinh có kết quả tốt.

---

### HOẠT ĐỘNG 4: VẬN DỤNG & DỰ ÁN XANH (5 - 7 phút)
**a. Mục tiêu:** Vận dụng kiến thức bài học vào đời sống thực tế tại trường THCS Nguyễn Đáng và gia đình.  
**b. Nội dung:** Thực hiện cam kết "Tuần lễ Lớp học Xanh", theo dõi chỉ số carbon trên EcoBot.  
**c. Sản phẩm:** Bản ghi Nhật ký Xanh và kế hoạch hành động giảm phát thải của cá nhân/tổ.  
**d. Tổ chức thực hiện:**
- **Bước 1:** Giáo viên hướng dẫn nhiệm vụ thực hành ở nhà và ngoài giờ lên lớp.
- **Bước 2 & 3:** Học sinh cam kết hành động, tích điểm rèn luyện nhận Huy hiệu Xanh 2026.
- **Bước 4:** Giáo viên dặn dò chuẩn bị cho tiết học tiếp theo.

---

## IV. BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRICS)

| Tiêu chí | Mức 1: Cần cố gắng (1 - 2đ) | Mức 2: Đạt (3 - 5đ) | Mức 3: Khá (6 - 8đ) | Mức 4: Tiên phong Xanh (9 - 10đ) |
| :--- | :--- | :--- | :--- | :--- |
| **Nhận thức kiến thức** | Chưa rõ nội dung bài. | Hiểu kiến thức cơ bản. | Nắm chắc, liên hệ đúng. | Phân tích sâu sắc, sáng tạo. |
| **Kỹ năng hợp tác** | Thụ động trong nhóm. | Có tham gia cơ bản. | Tích cực, chủ động. | Dẫn dắt, truyền cảm hứng. |
| **Hành động sinh thái** | Chưa có giải pháp. | Thực hiện khi nhắc nhở. | Duy trì đều đặn. | Tiên phong, lan tỏa toàn trường. |

*Kế hoạch bài dạy chuẩn hóa theo Công văn 5512/BGDĐT-GDTrH - Ngày hội Nhà giáo Sáng tạo 2026.*`;
  };

  // Xuất file Word (.doc) chuẩn UTF-8 không giới hạn độ dài theo mục 5
  const handleExportWord = () => {
    if (!generatedPlan) return;
    const title = `${topic} - Kế hoạch bài dạy 5512 (${selectedSubject} ${selectedGrade})`;
    
    // Convert markdown to clean, structured HTML for MS Word
    let formattedHtml = generatedPlan
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid #ccc; margin: 12pt 0;">')
      .replace(/^- (.*$)/gim, '<li>$1</li>');

    // Wrap list items
    formattedHtml = formattedHtml.replace(/(<li>.*?<\/li>(\s*<br\s*\/?>)?)+/gis, (match) => {
      return `<ul>${match.replace(/<br\s*\/?>/gi, '')}</ul>`;
    });

    // Handle markdown tables
    if (formattedHtml.includes('|')) {
      const lines = formattedHtml.split('\n');
      let inTable = false;
      let tableHtml = '<table>';
      const newLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
          if (!inTable) {
            inTable = true;
            tableHtml = '<table>';
          }
          if (line.includes('---')) {
            // separator, ignore
            continue;
          }
          const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          const isHeader = !tableHtml.includes('<tbody>');
          if (isHeader) {
            tableHtml += '<thead><tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr></thead><tbody>';
          } else {
            tableHtml += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
          }
        } else {
          if (inTable) {
            inTable = false;
            tableHtml += '</tbody></table>';
            newLines.push(tableHtml);
          }
          newLines.push(lines[i]);
        }
      }
      if (inTable) {
        tableHtml += '</tbody></table>';
        newLines.push(tableHtml);
      }
      formattedHtml = newLines.join('\n');
    }

    // Line breaks for remaining text
    formattedHtml = formattedHtml
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<table') || trimmed.startsWith('<hr')) {
          return line;
        }
        return `<p>${trimmed}</p>`;
      })
      .join('\n');

    exportToWordDocument(
      `Ke_Hoach_Bai_Day_${selectedSubject}_${selectedGrade}_${topic.slice(0, 30)}`,
      title,
      formattedHtml
    );
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToMaterials = () => {
    if (!generatedPlan) return;
    const newMaterial: LearningMaterial = {
      id: 'plan_' + Date.now(),
      title: `[Giáo án 5512] ${topic} (${selectedSubject} ${selectedGrade})`,
      category: 'Kế hoạch bài dạy',
      subject: selectedSubject,
      grade: selectedGrade,
      fileName: `Ke_Hoach_Bai_Day_${selectedSubject}_${selectedGrade}.doc`,
      fileSize: `${Math.round(generatedPlan.length / 1024 * 10) / 10} KB`,
      fileType: 'doc',
      url: '#', // inline content
      uploadedBy: teacherName,
      uploadedAt: new Date().toISOString().split('T')[0],
      isOfficial: false,
    };
    storage.addFile(newMaterial);
    storage.savePlan({
      id: newMaterial.id,
      title: newMaterial.title,
      subject: selectedSubject,
      grade: selectedGrade,
      teacherName,
      department,
      content: generatedPlan,
      createdAt: new Date().toISOString(),
    });
    setSavedToRepo(true);
    if (onMaterialAdded) onMaterialAdded(newMaterial);
    setTimeout(() => setSavedToRepo(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-blue-950 to-emerald-900 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" /> Chuẩn Công văn 5512/BGDĐT-GDTrH & GDPT 2018
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Soạn Kế hoạch Bài dạy (Giáo án Chuẩn 5512)
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Tích hợp đầy đủ 11 môn học THCS, cấu trúc 4 hoạt động sư phạm chính quy, tự động lồng ghép giáo dục Lớp học Xanh & Mô phỏng Dấu chân Carbon.
            </p>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-blue-500/30 text-xs space-y-1">
            <div className="text-slate-400">Đơn vị mặc định:</div>
            <div className="font-bold text-emerald-400">{schoolName}</div>
            <div className="text-slate-300">Giáo viên: <strong>{teacherName}</strong> | Năm học: <strong>{academicYear}</strong></div>
          </div>
        </div>
      </div>

      {/* Configuration Form & Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Layers className="w-4 h-4 text-emerald-500" /> Thông tin Kế hoạch bài dạy
            </h3>

            {/* Khối lớp (Mảng khối lớp duy nhất THCS theo mục 2) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khối lớp (THCS):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {GRADE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedGrade === g
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Môn học (Đầy đủ 11 môn THCS theo mục 7) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Môn học (11 môn GDPT 2018):
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Tổ chuyên môn: Bắt buộc để trống hoàn toàn để giáo viên tự điền */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tổ chuyên môn <span className="text-amber-500 font-normal">(Giáo viên tự nhập theo trường)</span>:
              </label>
              <input
                type="text"
                value={department}
                placeholder="Nhập tên tổ chuyên môn (Ví dụ: Tổ Khoa học Xã hội, Tổ Tự nhiên...)"
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tên bài học */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên bài dạy / Chủ đề:
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Nhập tên bài học cần soạn..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              
              {/* Gợi ý bài học theo môn */}
              {sampleTopics[selectedSubject] && (
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-medium text-slate-400">Gợi ý chủ đề tích hợp:</span>
                  <div className="flex flex-wrap gap-1">
                    {sampleTopics[selectedSubject].map((st, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setTopic(st)}
                        className="text-[10px] text-left px-2 py-1 bg-slate-100 dark:bg-slate-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 rounded-md transition-colors"
                      >
                        • {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thời lượng & Tùy chọn */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thời lượng:
                </label>
                <select
                  value={periodCount}
                  onChange={(e) => setPeriodCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                >
                  <option value={1}>1 Tiết (45 phút)</option>
                  <option value={2}>2 Tiết (90 phút)</option>
                  <option value={3}>3 Tiết (Chuyên đề)</option>
                  <option value={4}>4 Tiết (Dự án STEM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tích hợp Lớp học Xanh:
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={environmentalFocus}
                    onChange={(e) => setEnvironmentalFocus(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600"
                  />
                  <span>Mô phỏng EcoBot</span>
                </label>
              </div>
            </div>

            {/* Nút 1-Click AI Soạn Kế hoạch bài dạy */}
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading || !topic.trim()
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-emerald-600/30 hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI đang biên soạn giáo án chuẩn 5512...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>1-Click: AI Soạn Kế hoạch Bài dạy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Plan Output Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[650px]">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                  Văn bản Kế hoạch bài dạy (Công văn 5512)
                </span>
                {generatedPlan && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isAiGenerated
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {isAiGenerated ? '✨ Gemini AI' : '📋 Chuẩn 5512'}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {generatedPlan && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    title="Sao chép toàn bộ văn bản"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={handleSaveToMaterials}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold border border-emerald-300 dark:border-emerald-700 transition-colors"
                    title="Lưu vào Kho học liệu"
                  >
                    {savedToRepo ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{savedToRepo ? 'Đã lưu kho' : 'Lưu vào Kho'}</span>
                  </button>

                  {/* NÚT QUAN TRỌNG: XUẤT FILE WORD (.doc) KHÔNG GIỚI HẠN ĐỘ DÀI THEO MỤC 5 */}
                  <button
                    onClick={handleExportWord}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                    title="Xuất trực tiếp thành file Microsoft Word (.doc) chuẩn mã hóa UTF-8"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất File Word (.doc)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto mt-4 pr-1 text-slate-800 dark:text-slate-200">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center p-6">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                      EcoBot AI đang khởi tạo Kế hoạch bài dạy chi tiết...
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                      Đang xử lý mục tiêu năng lực, thiết bị dạy học, 4 hoạt động sư phạm chuẩn Công văn 5512 và bảng đánh giá Rubrics...
                    </p>
                  </div>
                </div>
              ) : generatedPlan ? (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-3 font-sans">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-[11px] text-blue-800 dark:text-blue-300 flex items-center justify-between">
                    <span>
                      📄 Giáo án chuẩn hoá hoàn chỉnh • Sẵn sàng giảng dạy hoặc tải về chỉnh sửa trên <strong>Microsoft Word</strong>.
                    </span>
                    <button
                      onClick={handleExportWord}
                      className="font-bold text-blue-700 dark:text-blue-300 underline hover:text-blue-900"
                    >
                      Tải về (.doc) ngay
                    </button>
                  </div>

                  <pre className="whitespace-pre-wrap font-sans text-xs bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    {generatedPlan}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                      Chưa có Kế hoạch bài dạy nào được tạo
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Chọn khối lớp, môn học trong danh sách 11 môn GDPT 2018 và nhấn <strong>"1-Click: AI Soạn Kế hoạch Bài dạy"</strong> để bắt đầu tạo giáo án chuẩn Công văn 5512.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
