import React, { useState } from 'react';
import { ResumeData, Experience, Education } from '../types';
import { enhanceText } from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('personal');

  const updateField = (section: keyof ResumeData, value: any) => {
    onChange({ ...data, [section]: value });
  };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const handleAIHelp = async (text: string, fieldPath: string, type: 'summary' | 'experience') => {
    if (!text) return;
    setLoadingAI(fieldPath);
    try {
      const improved = await enhanceText(text, type);
      
      if (fieldPath === 'summary') {
        updateField('summary', improved);
      } else if (fieldPath.startsWith('exp-')) {
        const id = fieldPath.split('-')[1];
        const newExp = data.experience.map(e => e.id === id ? { ...e, description: improved } : e);
        updateField('experience', newExp);
      }
    } finally {
      setLoadingAI(null);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    updateField('experience', [...data.experience, newExp]);
  };

  const removeExperience = (id: string) => {
    updateField('experience', data.experience.filter(e => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const newExp = data.experience.map(e => e.id === id ? { ...e, [field]: value } : e);
    updateField('experience', newExp);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    };
    updateField('education', [...data.education, newEdu]);
  };

  const removeEducation = (id: string) => {
    updateField('education', data.education.filter(e => e.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const newEdu = data.education.map(e => e.id === id ? { ...e, [field]: value } : e);
    updateField('education', newEdu);
  };

  const updateSkills = (val: string) => {
    updateField('skills', val);
  };

  const SectionHeader = ({ id, title, icon }: { id: string, title: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveSection(activeSection === id ? '' : id)}
      className={`w-full flex items-center justify-between p-4 bg-white border-l-4 transition-colors ${activeSection === id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}
    >
      <div className="flex items-center gap-3 font-semibold text-gray-700">
        {icon}
        {title}
      </div>
      <svg className={`w-5 h-5 transition-transform ${activeSection === id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="flex flex-col gap-2 pb-20">
      
      {/* Personal Info */}
      <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <SectionHeader 
          id="personal" 
          title="Kişisel Bilgiler" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
        />
        {activeSection === 'personal' && (
          <div className="p-4 bg-white space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase">Ad Soyad</label>
              <input type="text" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Örn: Ahmet Yılmaz" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">E-posta</label>
                <input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ahmet@ornek.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Telefon</label>
                <input type="text" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+90 555 123 45 67" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Konum</label>
                <input type="text" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="İstanbul, Türkiye" />
              </div>
               <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">LinkedIn (Kullanıcı Adı/Link)</label>
                <input type="text" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="linkedin.com/in/ahmet" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">GitHub</label>
                <input type="text" value={data.personalInfo.github || ''} onChange={(e) => updatePersonalInfo('github', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="github.com/kullaniciadi" />
              </div>
               <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Web Sitesi</label>
                <input type="text" value={data.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ahmetyilmaz.com" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <SectionHeader 
          id="summary" 
          title="Profesyonel Özet" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>} 
        />
        {activeSection === 'summary' && (
          <div className="p-4 bg-white space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-500 uppercase">Hakkımda</label>
                <button 
                  onClick={() => handleAIHelp(data.summary, 'summary', 'summary')}
                  disabled={loadingAI === 'summary' || !data.summary}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50"
                >
                   {loadingAI === 'summary' ? (
                     <span className="animate-spin">✨</span>
                   ) : (
                     <span>✨ AI ile Geliştir</span>
                   )}
                </button>
              </div>
              <textarea 
                rows={5}
                value={data.summary} 
                onChange={(e) => updateField('summary', e.target.value)} 
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                placeholder="Deneyimli bir yazılım mühendisiyim..." 
              />
              <p className="text-xs text-gray-400 mt-1">İpucu: AI butonunu kullanarak özetinizi ATS formatına uygun hale getirebilirsiniz.</p>
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <SectionHeader 
          id="experience" 
          title="İş Deneyimi" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} 
        />
        {activeSection === 'experience' && (
          <div className="p-4 bg-white space-y-6">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input type="text" placeholder="Şirket Adı" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full" />
                  <input type="text" placeholder="Pozisyon" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input type="text" placeholder="Başlangıç (Ay/Yıl)" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full" />
                  <div className="flex items-center gap-2">
                     <input type="text" disabled={exp.current} placeholder="Bitiş (Ay/Yıl)" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full disabled:bg-gray-100" />
                     <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                       <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} />
                       Devam Ediyor
                     </label>
                  </div>
                </div>
                <div className="relative">
                   <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-500 uppercase">Açıklama</label>
                    <button 
                      onClick={() => handleAIHelp(exp.description, `exp-${exp.id}`, 'experience')}
                      disabled={loadingAI === `exp-${exp.id}` || !exp.description}
                      className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50"
                    >
                      {loadingAI === `exp-${exp.id}` ? 'İşleniyor...' : '✨ AI ile İyileştir'}
                    </button>
                  </div>
                  <textarea rows={4} placeholder="Görev ve başarılarınızdan bahsedin..." value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-2 bg-blue-50 text-blue-600 font-medium rounded hover:bg-blue-100 transition flex items-center justify-center gap-2 border border-blue-200 border-dashed">
              + Yeni Deneyim Ekle
            </button>
          </div>
        )}
      </div>

       {/* Education */}
       <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <SectionHeader 
          id="education" 
          title="Eğitim" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>} 
        />
        {activeSection === 'education' && (
          <div className="p-4 bg-white space-y-6">
            {data.education.map((edu, index) => (
              <div key={edu.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input type="text" placeholder="Okul Adı" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full" />
                  <input type="text" placeholder="Derece (Lisans, YL vb.)" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full" />
                </div>
                 <div className="mb-3">
                  <input type="text" placeholder="Bölüm" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full" />
                 </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Başlangıç Yılı" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full" />
                  <div className="flex items-center gap-2">
                     <input type="text" disabled={edu.current} placeholder="Bitiş Yılı" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="p-2 border border-gray-300 rounded text-sm w-full disabled:bg-gray-100" />
                     <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                       <input type="checkbox" checked={edu.current} onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)} />
                       Devam
                     </label>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-2 bg-blue-50 text-blue-600 font-medium rounded hover:bg-blue-100 transition flex items-center justify-center gap-2 border border-blue-200 border-dashed">
              + Yeni Eğitim Ekle
            </button>
          </div>
        )}
      </div>

       {/* Skills */}
      <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <SectionHeader 
          id="skills" 
          title="Yetenekler" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />
        {activeSection === 'skills' && (
          <div className="p-4 bg-white space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Teknik Yetenekler (Virgülle ayırın)</label>
              <textarea 
                rows={3}
                value={data.skills} 
                onChange={(e) => updateSkills(e.target.value)} 
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                placeholder="JavaScript, React, Project Management, SEO..." 
              />
            </div>
             <div className="flex flex-wrap gap-2 mt-2">
               {data.skills && data.skills.split(',').map(s => s.trim()).filter(s => s).map((skill, i) => (
                 <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{skill}</span>
               ))}
             </div>
          </div>
        )}
      </div>

    </div>
  );
};