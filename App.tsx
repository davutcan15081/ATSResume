import React, { useState, useRef } from 'react';
import { Editor } from './components/Editor';
import { ResumePreview } from './components/ResumePreview';
import { INITIAL_DATA, ResumeData } from './types';
import { parsePDFToResumeData } from './services/geminiService';

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const previewRef = useRef<HTMLDivElement>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCV = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-${resumeData.personalInfo.fullName || 'resume'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a PDF file
    if (file.type === 'application/pdf') {
      setIsLoadingPDF(true);
      try {
        const parsedData = await parsePDFToResumeData(file);
        if (parsedData) {
          setResumeData(parsedData);
          alert('PDF CV başarıyla yüklendi ve analiz edildi! ✅');
        } else {
          alert('PDF analiz edilemedi. Lütfen tekrar deneyin veya JSON formatında yükleyin.');
        }
      } catch (error) {
        alert('PDF işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
        console.error('PDF import error:', error);
      } finally {
        setIsLoadingPDF(false);
      }
    } else if (file.type === 'application/json') {
      // Handle JSON file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content) as ResumeData;
          setResumeData(importedData);
          alert('CV başarıyla yüklendi! ✅');
        } catch (error) {
          alert('Hata: Geçersiz CV dosyası. Lütfen doğru formatta bir JSON dosyası seçin.');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Desteklenmeyen dosya formatı. Lütfen PDF veya JSON dosyası seçin.');
    }

    // Reset input so same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleLoadSample = () => {
    setResumeData({
      personalInfo: {
        fullName: "Selin Yılmaz",
        email: "selin.yilmaz@email.com",
        phone: "+90 555 123 4567",
        location: "İstanbul, Türkiye",
        linkedin: "linkedin.com/in/selinyilmaz",
        github: "github.com/selinyilmaz",
        website: "selinyilmaz.dev"
      },
      summary: "5+ yıllık deneyime sahip, ölçeklenebilir web uygulamaları geliştirme konusunda uzmanlaşmış Kıdemli Frontend Geliştirici. React ve modern JavaScript ekosistemine hakim. Performans optimizasyonu ve kullanıcı deneyimi odaklı, ekip çalışmasına yatkın ve mentorluk yapabilen bir profesyonel.",
      experience: [
        {
          id: '1',
          company: "Tech Solutions A.Ş.",
          position: "Senior Frontend Developer",
          startDate: "Ocak 2021",
          endDate: "",
          current: true,
          description: "• React.js ve TypeScript kullanarak yüksek trafikli e-ticaret platformunun frontend mimarisini yeniden tasarladım, sayfa yükleme süresini %40 azalttım.\n• 5 kişilik junior geliştirici ekibine mentorluk yaptım ve kod inceleme süreçlerini yönettim.\n• UI/UX tasarımcıları ile yakın çalışarak kullanıcı deneyimini iyileştiren yeni özellikler geliştirdim."
        },
        {
          id: '2',
          company: "Dijital Ajans Ltd.",
          position: "Frontend Developer",
          startDate: "Haziran 2018",
          endDate: "Aralık 2020",
          current: false,
          description: "• Çeşitli müşteriler için HTML5, CSS3 ve JavaScript kullanarak 20+ kurumsal web sitesi geliştirdim.\n• Responsive tasarım prensiplerini uygulayarak mobil uyumluluğu %100 sağladım.\n• Wordpress temaları geliştirerek içerik yönetim süreçlerini kolaylaştırdım."
        }
      ],
      education: [
        {
          id: '1',
          school: "İstanbul Teknik Üniversitesi",
          degree: "Lisans",
          field: "Bilgisayar Mühendisliği",
          startDate: "2014",
          endDate: "2018",
          current: false
        }
      ],
      skills: "React, TypeScript, Tailwind CSS, Next.js, Git, Agile/Scrum, REST API, GraphQL"
    });
  };

  return (
    <div className="min-h-screen flex flex-col h-screen print:h-auto print:block">

      {/* Navbar */}
      <nav className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 md:px-8 border-b border-slate-700 print:hidden shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center font-bold text-lg">CV</div>
          <span className="font-semibold text-lg hidden sm:inline">ATS-Pro Builder</span>
        </div>
        <div className="flex gap-2 md:gap-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.pdf,application/pdf,application/json"
            onChange={handleImportCV}
            className="hidden"
          />

          <button
            onClick={handleLoadSample}
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition"
          >
            <span className="hidden sm:inline">Örnek Yükle</span>
            <span className="sm:hidden">Örnek</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoadingPDF}
            className="flex items-center gap-1 md:gap-2 bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingPDF ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">İşleniyor...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="hidden sm:inline">CV Yükle</span>
                <span className="sm:hidden">Yükle</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCV}
            className="flex items-center gap-1 md:gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition shadow-lg shadow-purple-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            <span className="hidden sm:inline">CV Kaydet</span>
            <span className="sm:hidden">Kaydet</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 md:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition shadow-lg shadow-blue-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="hidden sm:inline">PDF İndir</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden relative print:h-auto print:overflow-visible print:block">

        {/* Editor Panel (Left) */}
        <div className={`
          flex-1 bg-slate-50 border-r border-slate-200 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent
          print:hidden
          ${showMobilePreview ? 'hidden md:block' : 'block'}
        `}>
          <div className="max-w-2xl mx-auto p-4 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
              İçerik Düzenle
            </h2>
            <Editor data={resumeData} onChange={setResumeData} />
          </div>
        </div>

        {/* Preview Panel (Right) */}
        <div className={`
          flex-1 bg-slate-200/50 overflow-y-auto relative flex justify-center items-start pt-8 pb-20
          ${showMobilePreview ? 'block fixed inset-0 z-40 pt-20 bg-slate-100' : 'hidden md:flex'}
          print:block print:w-full print:bg-white print:p-0 print:static print:h-auto print:overflow-visible
        `}>
          <div className="transform origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.85] print:scale-100 print:transform-none transition-transform duration-300">
            <ResumePreview data={resumeData} previewRef={previewRef} />
          </div>

          {/* Mobile Close Preview Button */}
          {showMobilePreview && (
            <button
              onClick={() => setShowMobilePreview(false)}
              className="fixed bottom-6 right-6 bg-slate-800 text-white p-4 rounded-full shadow-xl z-50 md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </main>

      {/* Mobile Toggle Button (Visible only on mobile/tablet when not previewing) */}
      {!showMobilePreview && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg print:hidden z-30">
          <button
            onClick={() => setShowMobilePreview(true)}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium shadow-lg active:scale-95 transition"
          >
            Önizlemeyi Gör
          </button>
        </div>
      )}

    </div>
  );
}

export default App;