import { GoogleGenAI } from "@google/genai";
import type { ResumeData } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const enhanceText = async (text: string, type: 'summary' | 'experience' | 'fix'): Promise<string> => {
  if (!apiKey) {
    console.error("API Key missing");
    return text;
  }
  if (!text.trim()) return "";

  let prompt = "";

  if (type === 'summary') {
    prompt = `Sen profesyonel bir CV danışmanısın. Aşağıdaki CV özetini ATS (Aday Takip Sistemi) uyumlu, profesyonel, etkileyici ve birinci tekil şahıs ağzıyla (ben diliyle) yazılmış bir hale getir. Sadece revize edilmiş metni döndür, başka açıklama yapma.\n\nMetin: "${text}"`;
  } else if (type === 'experience') {
    prompt = `Sen profesyonel bir CV danışmanısın. Aşağıdaki iş deneyimi açıklamasını maddeler halinde, birinci tekil şahıs eylem fiilleri kullanarak (yaptım, geliştirdim gibi) ve ATS uyumlu olacak şekilde yeniden yaz. Başarı odaklı ol. Sadece revize edilmiş metni döndür.\n\nMetin: "${text}"`;
  } else {
    prompt = `Aşağıdaki metni dil bilgisi ve profesyonellik açısından düzelt. Birinci tekil şahıs ağzından (ben diliyle) yazıldığından emin ol. Sadece düzeltilmiş metni ver.\n\nMetin: "${text}"`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return text; // Return original text on error
  }
};

export const parsePDFToResumeData = async (file: File): Promise<ResumeData | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    // Import PDF.js
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker path - use local worker
    const workerSrc = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc.default;

    // Read PDF file
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    console.log('Extracted PDF text:', fullText.substring(0, 500)); // Log first 500 chars

    // Send extracted text to Gemini for parsing
    const prompt = `Sen profesyonel bir CV analiz uzmanısın. Aşağıdaki CV metnini analiz et ve içeriğini JSON formatında çıkar.

ÖNEMLI: Yanıtını SADECE geçerli JSON formatında ver. Hiçbir açıklama, markdown formatı veya ek metin ekleme.

JSON formatı şu şekilde olmalı:
{
  "personalInfo": {
    "fullName": "Ad Soyad",
    "email": "email@example.com",
    "phone": "+90 XXX XXX XXXX",
    "location": "Şehir, Ülke",
    "linkedin": "linkedin.com/in/kullanici",
    "github": "github.com/kullanici",
    "website": "website.com"
  },
  "summary": "Profesyonel özet metni...",
  "experience": [
    {
      "id": "1",
      "company": "Şirket Adı",
      "position": "Pozisyon",
      "startDate": "Ay Yıl",
      "endDate": "Ay Yıl veya boş",
      "current": true/false,
      "description": "İş açıklaması..."
    }
  ],
  "education": [
    {
      "id": "1",
      "school": "Okul Adı",
      "degree": "Derece",
      "field": "Alan",
      "startDate": "Yıl",
      "endDate": "Yıl",
      "current": false
    }
  ],
  "skills": "Beceri1, Beceri2, Beceri3..."
}

Eğer bir bilgi bulunamazsa boş string ("") kullan. Tarihleri Türkçe ay isimleriyle yaz (Ocak, Şubat vb.).

CV Metni:
${fullText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    const responseText = response.text.trim();
    console.log('Gemini response:', responseText.substring(0, 500)); // Log first 500 chars

    // Remove markdown code blocks if present
    let jsonText = responseText;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsedData = JSON.parse(jsonText) as ResumeData;

    // Validate and ensure all required fields exist
    const validatedData: ResumeData = {
      personalInfo: {
        fullName: parsedData.personalInfo?.fullName || '',
        email: parsedData.personalInfo?.email || '',
        phone: parsedData.personalInfo?.phone || '',
        location: parsedData.personalInfo?.location || '',
        linkedin: parsedData.personalInfo?.linkedin || '',
        github: parsedData.personalInfo?.github || '',
        website: parsedData.personalInfo?.website || '',
      },
      summary: parsedData.summary || '',
      experience: Array.isArray(parsedData.experience) ? parsedData.experience.map((exp, idx) => ({
        id: exp.id || `exp-${Date.now()}-${idx}`,
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: exp.description || '',
      })) : [],
      education: Array.isArray(parsedData.education) ? parsedData.education.map((edu, idx) => ({
        id: edu.id || `edu-${Date.now()}-${idx}`,
        school: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        current: edu.current || false,
      })) : [],
      skills: parsedData.skills || '',
    };

    return validatedData;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    return null;
  }
};