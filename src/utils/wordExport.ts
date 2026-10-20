/**
 * Utility to export text/HTML content into a standard Microsoft Word (.doc) file
 * with full UTF-8 BOM encoding and Word XML namespace, ensuring 100% Vietnamese
 * diacritics compatibility, proper formatting, and unlimited document length.
 */

export function exportToWordDocument(filename: string, title: string, htmlBody: string) {
  const cleanFilename = (filename || 'Ke_Hoach_Bai_Day_5512').replace(/[/\\?%*:|"<>]/g, '_') + '.doc';

  const docTemplate = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 21.0cm 29.7cm;
      margin: 2.0cm 2.0cm 2.0cm 2.5cm;
      mso-header-margin: 36.0pt;
      mso-footer-margin: 36.0pt;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Times New Roman', 'Arial', sans-serif;
      font-size: 13.0pt;
      line-height: 1.35;
      color: #111827;
      background-color: #ffffff;
    }
    h1 {
      font-size: 16.0pt;
      font-weight: bold;
      text-align: center;
      margin-top: 18pt;
      margin-bottom: 12pt;
      color: #0A192F;
      text-transform: uppercase;
    }
    h2 {
      font-size: 14.0pt;
      font-weight: bold;
      margin-top: 14pt;
      margin-bottom: 6pt;
      color: #107941;
      border-bottom: 1px solid #107941;
      padding-bottom: 2pt;
    }
    h3 {
      font-size: 13.0pt;
      font-weight: bold;
      margin-top: 10pt;
      margin-bottom: 4pt;
      color: #1D4ED8;
    }
    h4 {
      font-size: 13.0pt;
      font-weight: bold;
      font-style: italic;
      margin-top: 8pt;
      margin-bottom: 3pt;
      color: #374151;
    }
    p {
      margin-top: 3pt;
      margin-bottom: 4pt;
      text-align: justify;
    }
    ul, ol {
      margin-top: 3pt;
      margin-bottom: 6pt;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 3pt;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 8pt;
      margin-bottom: 10pt;
    }
    th, td {
      border: 1px solid #4B5563;
      padding: 6pt 8pt;
      font-size: 12.0pt;
      vertical-align: top;
    }
    th {
      background-color: #E2E8F0;
      font-weight: bold;
      text-align: center;
    }
    .header-table {
      border: none;
      width: 100%;
      margin-bottom: 16pt;
    }
    .header-table td {
      border: none;
      padding: 2pt 4pt;
      font-size: 12.0pt;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
  </style>
</head>
<body>
  <div class="Section1">
    ${htmlBody}
  </div>
</body>
</html>`;

  // UTF-8 BOM to prevent MS Word from garbling non-ASCII Vietnamese characters
  const blob = new Blob(['\ufeff', docTemplate], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
