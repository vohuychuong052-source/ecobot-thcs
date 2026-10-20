import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API: AI Generate Lesson Plan (Official Công văn 5512 / GDPT 2018)
  app.post('/api/generate-lesson-plan', async (req, res) => {
    try {
      const {
        subject = 'Giáo dục công dân',
        grade = 'Lớp 9',
        topic = 'Bảo vệ môi trường và ứng phó biến đổi khí hậu',
        periodCount = 2,
        userApiKey,
        department = '',
        teacherName = 'Trương Văn Nghĩa',
        schoolName = 'Trường THCS Nguyễn Đáng',
        academicYear = '2026-2027',
        environmentalFocus = true,
      } = req.body;

      const apiKeyToUse = (typeof userApiKey === 'string' && userApiKey.trim())
        ? userApiKey.trim()
        : (process.env.GEMINI_API_KEY || '');

      let generatedMarkdown = '';
      let isAiGenerated = false;

      if (apiKeyToUse) {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKeyToUse,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const prompt = `Bạn là chuyên gia sư phạm THCS cấp quốc gia Việt Nam, am hiểu sâu sắc Chương trình Giáo dục Phổ thông 2018 (GDPT 2018) và Công văn số 5512/BGDĐT-GDTrH của Bộ Giáo dục và Đào tạo về xây dựng Kế hoạch bài dạy.

Hãy biên soạn một Kế hoạch bài dạy (Giáo án) CHI TIẾT, ĐẦY ĐỦ, CHUYÊN SÂU cho:
- Môn học: ${subject}
- Khối lớp: ${grade} (Cấp THCS)
- Tên bài học / Chủ đề: "${topic}"
- Thời lượng: ${periodCount} tiết
- Trường: ${schoolName}
- Giáo viên thực hiện: ${teacherName}
- Tổ chuyên môn: ${department || '[Tổ chuyên môn: Giáo viên tự điền]'}
- Năm học: ${academicYear}
${environmentalFocus ? '- Yêu cầu đặc thù: Tích hợp định hướng Lớp học Xanh, bảo vệ môi trường, giảm dấu chân carbon và ứng dụng công nghệ sinh thái số EcoBot.' : ''}

KẾ HOẠCH BÀI DẠY BẮT BUỘC PHẢI TUÂN THỦ ĐÚNG CẤU TRÚC 5512 VỚI ĐỘ DÀI CHI TIẾT VÀ ĐẦY ĐỦ:
1. TIÊU ĐỀ ĐẦU TRANG THEO QUY CHUẨN CÔNG VĂN 5512
2. I. MỤC TIÊU BÀI HỌC:
   1. Kiến thức
   2. Năng lực (Năng lực chung: Tự chủ - tự học, Giao tiếp - hợp tác, Giải quyết vấn đề & sáng tạo; Năng lực đặc thù của môn học)
   3. Phẩm chất (Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm với cộng đồng và môi trường)
3. II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:
   1. Đối với giáo viên (kèm thiết bị công nghệ, phần mềm mô phỏng EcoBot, SGK, máy chiếu...)
   2. Đối với học sinh (sản phẩm tái chế, sổ tay hành động xanh...)
4. III. TIẾN TRÌNH DẠY HỌC (GỒM ĐỦ 4 HOẠT ĐỘNG CHUẨN CÔNG VĂN 5512, MỖI HOẠT ĐỘNG PHẢI ĐỦ 4 MỤC: a. Mục tiêu, b. Nội dung, c. Sản phẩm, d. Tổ chức thực hiện [Bước 1: Chuyển giao nhiệm vụ - Bước 2: Thực hiện nhiệm vụ - Bước 3: Báo cáo thảo luận - Bước 4: Kết luận, nhận định]):
   - Hoạt động 1: Mở đầu / Khởi động (${subject} gắn với tình huống sinh thái thực tiễn)
   - Hoạt động 2: Hình thành kiến thức mới (Khám phá nội dung trọng tâm bài học)
   - Hoạt động 3: Luyện tập (Giải quyết bài tập, câu hỏi tình huống, phiếu học tập)
   - Hoạt động 4: Vận dụng (Dự án thực tế tại lớp học xanh / gia đình, đo lường giảm phát thải CO2e)
5. IV. HỒ SƠ DẠY HỌC & BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRICS)
   - Bảng Rubrics đánh giá sản phẩm và thái độ học sinh (4 mức độ: Cần cố gắng, Đạt, Khá, Tiên phong Xanh).

Viết bằng tiếng Việt chuẩn mực, chi tiết từng bước hành động của Giáo viên và Học sinh, không viết tóm tắt hay cắt ngắn.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: 'Bạn là chuyên gia giáo dục THCS hàng đầu Việt Nam, chuyên biên soạn kế hoạch bài dạy chuẩn mực theo Công văn 5512/BGDĐT-GDTrH và GDPT 2018.',
            },
          });

          if (response && response.text) {
            generatedMarkdown = response.text;
            isAiGenerated = true;
          }
        } catch (apiErr: any) {
          console.warn('Gemini API call failed, using high-fidelity fallback:', apiErr?.message);
        }
      }

      // If AI generation was not performed or failed, generate high-quality 5512 structure tailored to the input
      if (!generatedMarkdown) {
        generatedMarkdown = createCuratedLessonPlan({
          schoolName,
          teacherName,
          department,
          academicYear,
          subject,
          grade,
          topic,
          periodCount,
          environmentalFocus,
        });
        isAiGenerated = false;
      }

      return res.json({
        success: true,
        isAiGenerated,
        content: generatedMarkdown,
      });
    } catch (error: any) {
      console.error('Lesson Plan Endpoint Error:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Lỗi xử lý tạo kế hoạch bài dạy',
      });
    }
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoBot Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

// Fallback high-fidelity curriculum generator compliant with Official CV 5512
function createCuratedLessonPlan(p: {
  schoolName: string;
  teacherName: string;
  department: string;
  academicYear: string;
  subject: string;
  grade: string;
  topic: string;
  periodCount: number;
  environmentalFocus: boolean;
}): string {
  const deptDisplay = p.department ? p.department : '...................................................';
  return `# KẾ HOẠCH BÀI DẠY (CHUẨN CÔNG VĂN 5512/BGDĐT-GDTrH)
**TRƯỜNG:** ${p.schoolName}  
**TỔ CHUYÊN MÔN:** ${deptDisplay}  
**HỌ VÀ TÊN GIÁO VIÊN:** ${p.teacherName}  
**NĂM HỌC:** ${p.academicYear}  

---

### BÀI DẠY: ${p.topic.toUpperCase()}
**MÔN:** ${p.subject} | **KHỐI:** ${p.grade}  
**Thời lượng:** ${p.periodCount} tiết  

---

## I. MỤC TIÊU BÀI HỌC

### 1. Về kiến thức
- Học sinh phân tích và nắm vững các khái niệm, quy luật và nội dung cốt lõi của bài học: **${p.topic}** theo yêu cầu cần đạt của Chương trình GDPT 2018.
- Nhận thức sâu sắc mối liên hệ giữa kiến thức môn **${p.subject}** với thực tiễn đời sống, đặc biệt là ý thức bảo vệ môi trường học đường và giảm thiểu dấu chân carbon (CO2e).
- Vận dụng các công cụ chuyển đổi số (Hệ sinh thái EcoBot) để đo lường, phân tích dữ liệu thực tế về năng lượng và rác thải.

### 2. Về năng lực
**a) Năng lực chung:**
- **Năng lực tự chủ và tự học:** Tự giác nghiên cứu tài liệu sách giáo khoa, chủ động chuẩn bị các tư liệu học tập và hoàn thành nhiệm vụ cá nhân trước giờ học.
- **Năng lực giao tiếp và hợp tác:** Tương tác hiệu quả trong nhóm, biết lắng nghe, phản biện mang tính xây dựng và phân chia công việc công bằng khi làm dự án xanh.
- **Năng lực giải quyết vấn đề và sáng tạo:** Đề xuất được giải pháp cải tiến môi trường lớp học, tối ưu hóa mức tiêu thụ điện và giảm sử dụng đồ nhựa dùng một lần.

**b) Năng lực đặc thù môn ${p.subject}:**
- Năng lực nhận thức và thực hành đặc trưng của bộ môn ${p.subject} cấp THCS.
- Khả năng xử lý tình huống, thu thập số liệu và rút ra kết luận mang tính khoa học, chuẩn mực.

### 3. Về phẩm chất
- **Yêu nước & Nhân ái:** Yêu mến cảnh quan quê hương, trân trọng tài nguyên thiên nhiên và thành quả lao động của cộng đồng.
- **Chăm chỉ & Trung thực:** Thu thập số liệu phát thải trung thực, kiên trì theo dõi nhật ký thực hành xanh hằng ngày.
- **Trách nhiệm:** Có tinh thần trách nhiệm cao đối với lớp học, nhà trường và hành tinh; sẵn sàng hành động để xây dựng lối sống xanh.

---

## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU

### 1. Thiết bị của giáo viên
- Máy tính, máy chiếu tương tác kết nối Internet.
- Ứng dụng **EcoBot - Mô phỏng Dấu chân Carbon & Lớp học Xanh**.
- Sách giáo khoa ${p.subject} ${p.grade}, phiếu học tập số 1, số 2 và bảng tiêu chí Rubrics.
- Video tình huống / infographic trực quan về tác động môi trường.

### 2. Thiết bị của học sinh
- Sách giáo khoa ${p.subject} ${p.grade}, vở ghi chép, bút màu.
- Dữ liệu khảo sát thực tế tuần qua của gia đình/lớp học (số điện tiêu thụ, số túi nilon/chai nhựa đã dùng, quãng đường di chuyển đến trường).
- Bảng phụ nhóm hoặc thiết bị thông minh (nếu có để tương tác mô phỏng EcoBot).

---

## III. TIẾN TRÌNH DẠY HỌC

### HOẠT ĐỘNG 1: MỞ ĐẦU / KHỞI ĐỘNG (Khoảng 7 - 10 phút)
**a. Mục tiêu:**
- Kích hoạt sự chú ý, tạo tâm thế hứng thú khám phá chủ đề "${p.topic}".
- Giúp học sinh nhận diện vấn đề thực tiễn cần giải quyết liên quan đến môn học và lối sống xanh.

**b. Nội dung:**
- Giáo viên trình chiếu tình huống mở đầu hoặc đoạn video ngắn về thực trạng ô nhiễm môi trường / dấu chân carbon học đường.
- Đặt câu hỏi kích thích tư duy: *"Theo em, những thói quen học tập và sinh hoạt mỗi ngày tại lớp 9 tác động như thế nào đến môi trường xung quanh chúng ta?"*

**c. Sản phẩm:**
- Ý kiến phản hồi nhanh của học sinh ghi trên bảng phụ hoặc padlet lớp học.
- Tâm thế sẵn sàng tìm tòi phương án giải quyết trong bài học mới.

**d. Tổ chức thực hiện:**
- **Bước 1 (Chuyển giao nhiệm vụ):** Giáo viên giao nhiệm vụ qua hình ảnh trực quan trên màn chiếu, yêu cầu học sinh thảo luận cặp đôi trong 2 phút.
- **Bước 2 (Thực hiện nhiệm vụ):** Học sinh trao đổi, đối chiếu dữ liệu thói quen cá nhân.
- **Bước 3 (Báo cáo, thảo luận):** Đại diện 2 - 3 cặp đôi đứng dậy chia sẻ quan điểm.
- **Bước 4 (Kết luận, nhận định):** Giáo viên nhận xét, dẫn dắt học sinh bước vào nội dung bài học mới: "${p.topic}".

---

### HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (Khoảng 20 - 25 phút)
**a. Mục tiêu:**
- Nắm vững kiến thức trọng tâm của bài: Các khái niệm cơ bản, đặc điểm, nguyên nhân và giải pháp giải quyết vấn đề.
- Rèn luyện kỹ năng đọc hiểu văn bản SGK và phân tích mô hình trực quan.

**b. Nội dung:**
- Khám phá nội dung 1: Khái niệm và bản chất của ${p.topic}.
- Khám phá nội dung 2: Mối liên hệ đa chiều giữa con người, công nghệ và hệ sinh thái tự nhiên.
- Thực hành phân tích biểu đồ carbon thời gian thực trên giao diện EcoBot (Điện năng: kWh × 0.8 kg CO2e; Nhựa dùng 1 lần: 0.075 kg CO2e; Phương tiện giao thông).

**c. Sản phẩm:**
- Nội dung ghi chép trong vở học sinh; bảng tổng kết phiếu học tập nhóm.
- Sơ đồ tư duy hoặc bảng phân tích cấu trúc bài học do học sinh hoàn thành.

**d. Tổ chức thực hiện:**
- **Bước 1 (Chuyển giao nhiệm vụ):** Chia lớp thành 4 nhóm tương ứng với các phân khu sinh thái. Giao phiếu học tập chuyên đề.
- **Bước 2 (Thực hiện nhiệm vụ):** Các nhóm nghiên cứu SGK kết hợp phân tích mô phỏng. Giáo viên quan sát, định hướng và hỗ trợ các nhóm gặp khó khăn.
- **Bước 3 (Báo cáo, thảo luận):** Đại diện các nhóm báo cáo kết quả, nhóm khác lắng nghe và đặt câu hỏi chất vấn.
- **Bước 4 (Kết luận, nhận định):** Giáo viên chuẩn hóa kiến thức trên slide, nhấn mạnh các bài học chuyên môn và quy tắc ứng xử chuẩn mực.

---

### HOẠT ĐỘNG 3: LUYỆN TẬP (Khoảng 8 - 10 phút)
**a. Mục tiêu:**
- Củng cố kiến thức vừa tiếp thu; vận dụng ngay vào xử lý các bài tập trắc nghiệm và tình huống thực tế.
- Rèn luyện kỹ năng tính toán, suy luận logic và đưa ra quyết định đúng đắn.

**b. Nội dung:**
- Hệ thống 4 câu hỏi trắc nghiệm định hướng năng lực môn ${p.subject} (Biết - Hiểu - Vận dụng).
- 1 bài tập tình huống thực tế: Xử lý hành vi lãng phí điện năng hoặc phân loại rác thải không đúng quy định tại sân trường.

**c. Sản phẩm:**
- Câu trả lời chính xác của học sinh trên bảng con hoặc hệ thống câu hỏi tương tác.
- Lời giải thích mạch lạc, có căn cứ khoa học cho bài tập tình huống.

**d. Tổ chức thực hiện:**
- **Bước 1 (Chuyển giao):** Giáo viên đưa ra câu hỏi và tình huống luyện tập.
- **Bước 2 (Thực hiện):** Học sinh làm việc cá nhân trong 3 phút, sau đó kiểm tra chéo đáp án với bạn cùng bàn.
- **Bước 3 (Báo cáo):** Giáo viên gọi ngẫu nhiên học sinh trình bày và giải thích nguyên nhân lựa chọn.
- **Bước 4 (Kết luận):** Giáo viên chấm điểm nhanh, biểu dương những học sinh có cách giải quyết sáng tạo.

---

### HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG (Khoảng 5 - 7 phút)
**a. Mục tiêu:**
- Chuyển giao kiến thức từ lớp học vào hành động thực tiễn tại trường THCS Nguyễn Đáng và gia đình.
- Lan tỏa phong trào lớp học không rác thải nhựa, tiết kiệm điện năng và tích điểm Nhật ký Xanh.

**b. Nội dung:**
- Thực hiện dự án nhỏ: "Mỗi tuần một hành động giảm phát thải carbon".
- Đo lường kết quả thực tế qua bộ mô phỏng EcoBot và ghi vào Nhật ký Xanh để nhận Giấy chứng nhận Đại sứ Môi trường 2026.

**c. Sản phẩm:**
- Kế hoạch hành động xanh cá nhân nộp vào tiết học sau.
- Bản chụp hoặc mô hình sản phẩm tái chế phục vụ học tập.

**d. Tổ chức thực hiện:**
- **Bước 1:** Giáo viên hướng dẫn các bước thực hiện dự án vận dụng ngoài giờ học.
- **Bước 2:** Học sinh ghi nhận nhiệm vụ, thảo luận ngắn về mục tiêu cam kết giảm CO2e.
- **Bước 3 & 4:** Giáo viên dặn dò, đánh giá tổng kết tiết học và thông báo tiêu chí chấm điểm thi đua.

---

## IV. PHỤ LỤC & RUBRICS ĐÁNH GIÁ (TIÊU CHÍ CHUẨN)

| Tiêu chí đánh giá | Mức 1: Cần cố gắng (1 - 2đ) | Mức 2: Đạt (3 - 5đ) | Mức 3: Khá (6 - 8đ) | Mức 4: Tiên phong Xanh (9 - 10đ) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Nhận thức kiến thức** | Chưa nêu rõ nội dung chính của bài học. | Nêu được khái niệm cơ bản nhưng chưa sâu. | Nắm vững kiến thức, phân tích đúng bản chất vấn đề. | Làm chủ kiến thức, liên hệ thực tiễn xuất sắc và đa chiều. |
| **2. Tinh thần hợp tác** | Ít tương tác, còn thụ động trong nhóm. | Tham gia khi được phân công trực tiếp. | Chủ động đóng góp ý kiến, tương tác tích cực. | Dẫn dắt, hỗ trợ bạn bè hoàn thành xuất sắc nhiệm vụ. |
| **3. Hành động sinh thái số** | Chưa có hành động giảm phát thải cụ thể. | Thực hiện 1 - 2 hành động cơ bản (tắt đèn). | Thực hiện đều đặn, ghi chép nhật ký EcoBot đầy đủ. | Đạt chỉ số giảm CO2e vượt trội, lan tỏa lối sống xanh đến toàn trường. |

*Giáo án được biên soạn chuẩn hóa theo khung Công văn 5512/BGDĐT-GDTrH phục vụ Ngày hội Nhà giáo Sáng tạo 2026.*`;
}

startServer();
