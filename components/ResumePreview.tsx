import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="w-full flex justify-center bg-gray-100 p-4 print:p-0 print:bg-white print:overflow-visible overflow-hidden">
      {/* A4 Paper Container */}
      <div 
        ref={previewRef}
        className="bg-white shadow-lg print:shadow-none w-[210mm] min-h-[297mm] p-[20mm] text-sm text-gray-800 leading-normal"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2">
            {personalInfo.fullName || "Ad Soyad"}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {personalInfo.email && (
              <span>{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <>
                <span className="text-gray-400">•</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span className="text-gray-400">•</span>
                <span>{personalInfo.location}</span>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <span className="text-gray-400">•</span>
                <span>{personalInfo.linkedin}</span>
              </>
            )}
             {personalInfo.github && (
              <>
                <span className="text-gray-400">•</span>
                <span>{personalInfo.github}</span>
              </>
            )}
             {personalInfo.website && (
              <>
                <span className="text-gray-400">•</span>
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 mb-3 pb-1">
              Özet
            </h2>
            <p className="text-gray-700 whitespace-pre-line text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 mb-4 pb-1">
              İş Deneyimi
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? 'Devam Ediyor' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</div>
                  <div className="text-gray-700 whitespace-pre-line pl-1">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 mb-4 pb-1">
              Eğitim
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{edu.school}</h3>
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                      {edu.startDate} – {edu.current ? 'Devam Ediyor' : edu.endDate}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">{edu.degree}</span>, {edu.field}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-300 mb-3 pb-1">
              Yetenekler
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.split(',').map(s => s.trim()).filter(s => s).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};