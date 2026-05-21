import React, { useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Download, Github } from 'lucide-react';
import { RESUME_DATA } from './constants';

declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (typeof window.html2pdf === 'undefined') {
      window.print();
      return;
    }

    setIsDownloading(true);
    const element = document.getElementById('resume-content');
    const opt = {
      margin: [10, 10, 10, 10], // mm
      filename: `Nikhil_AM_DevOps_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white text-gray-900 font-sans pb-20 print:pb-0">
      
      {/* Action Bar (Hidden in Print) */}
      <div className="fixed top-4 right-4 z-50 flex gap-4 no-print print:hidden">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-all text-sm font-medium"
        >
          <Download size={16} />
          {isDownloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Main Content Area */}
      <div
        id="resume-content"
        className="max-w-[850px] mx-auto bg-white print:shadow-none shadow-sm min-h-screen p-8 md:p-12 print:p-0"
      >

        {/* HEADER SECTION */}
        <header className="mb-10 pb-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                {RESUME_DATA.personalInfo.name}
              </h1>
              <h2 className="text-xl font-medium text-blue-600 mb-4">
                {RESUME_DATA.personalInfo.role}
              </h2>
              <p className="text-sm text-gray-600 max-w-xl leading-relaxed">
                {RESUME_DATA.summary}
              </p>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-2 text-sm text-gray-600 shrink-0">
              <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Mail size={14} className="text-gray-400" />
                {RESUME_DATA.personalInfo.email}
              </a>
              <a href={`tel:${RESUME_DATA.personalInfo.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Phone size={14} className="text-gray-400" />
                {RESUME_DATA.personalInfo.phone}
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                {RESUME_DATA.personalInfo.location}
              </div>
              <a href={`https://${RESUME_DATA.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <ExternalLink size={14} className="text-gray-400" />
                {RESUME_DATA.personalInfo.linkedin}
              </a>
            </div>
          </div>
        </header>

        {/* EXPERIENCE SECTION */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Experience</h3>
          <div className="space-y-8">
            {RESUME_DATA.experience.map((exp, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-2">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{exp.role}</h4>
                    <div className="text-sm font-medium text-gray-700">{exp.company}</div>
                  </div>
                  <div className="text-sm text-gray-500 font-medium shrink-0 bg-gray-100 px-3 py-1 rounded-full">
                    {exp.period}
                  </div>
                </div>
                <ul className="list-disc list-outside ml-4 mt-3 space-y-1.5 text-sm text-gray-600">
                  {exp.description.map((point, i) => (
                    <li key={i} className="pl-1 leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {RESUME_DATA.skills.map((category, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">{category.category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESUME_DATA.projects.map((proj, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    {proj.name}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600">
                        <Github size={14} />
                      </a>
                    )}
                  </h4>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {proj.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-3">{proj.role}</p>

                <ul className="list-none space-y-1 text-sm text-gray-600 mb-4">
                  {proj.description.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-gray-100">
                  {proj.techStack.map((tech, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION & CERTIFICATIONS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">Education</h3>
            <div>
              <h4 className="font-bold text-gray-900">{RESUME_DATA.education.degree}</h4>
              <p className="text-sm text-gray-600 mt-1">{RESUME_DATA.education.institution}</p>
              <p className="text-xs text-gray-500 mt-1">{RESUME_DATA.education.year}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">Certifications</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {RESUME_DATA.certifications.map((cert, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default App;
