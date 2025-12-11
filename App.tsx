import React, { useState, useMemo, useEffect } from 'react';
import { 
  Terminal, Server, Box, Activity, GitBranch, 
  Award, Download, Printer, Database, 
  Cloud, FileCode, CheckCircle2, LayoutDashboard,
  MapPin, Mail, Phone, ExternalLink, X, Maximize2, Github,
  Search, MessageSquare, Shield, Globe, Menu, Rocket, Check, Power
} from 'lucide-react';
import { RESUME_DATA } from './constants';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { SectionHeader } from './components/SectionHeader';
import { StatusBadge } from './components/StatusBadge';
import { MetricGauge } from './components/MetricGauge';
import { SkillRadar } from './components/SkillRadar';
import { ContactModal } from './components/ContactModal';
import { CommandPalette } from './components/CommandPalette';
import { LiveEvents } from './components/LiveEvents';
import { ResourceChart } from './components/ResourceChart';
import { Experience, Project } from './types';

// Declare html2pdf on window
declare global {
  interface Window {
    html2pdf: any;
  }
}

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const bootSequence = [
      "Initializing kernel...",
      "Loading modules: k8s_core, docker_shim, net_bridge...",
      "Mounting filesystems...",
      "Starting systemd...",
      "Connect to cluster: cluster-nikhil-prod...",
      " Authenticated. Access granted."
    ];
    
    let delay = 0;
    bootSequence.forEach((log, i) => {
      delay += Math.random() * 300 + 200;
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (i === bootSequence.length - 1) {
          setTimeout(onComplete, 600);
        }
      }, delay);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center font-mono text-green-500 p-4">
      <div className="w-full max-w-lg space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-500">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
            <span>{log}</span>
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [printMode, setPrintMode] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  
  // Mobile & UX State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deployStep, setDeployStep] = useState<'idle' | 'building' | 'pushing' | 'deployed'>('idle');
  const [toasts, setToasts] = useState<Array<{id: number, message: string, type: 'info' | 'success'}>>([]);

  const addToast = (message: string, type: 'info' | 'success' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDeployProfile = () => {
    if (deployStep !== 'idle') return;
    
    setDeployStep('building');
    addToast('Build started: Compiling assets...', 'info');
    
    setTimeout(() => {
      setDeployStep('pushing');
      addToast('Pushing image to registry...', 'info');
      
      setTimeout(() => {
        setDeployStep('deployed');
        addToast('Deployment Successful! v2.0 live.', 'success');
        
        setTimeout(() => {
          setDeployStep('idle');
        }, 3000);
      }, 1500);
    }, 1500);
  };

  const togglePrintMode = () => {
    const newMode = !printMode;
    setPrintMode(newMode);
    
    // Auto-trigger print dialog if entering print mode
    if (newMode) {
      setTimeout(() => window.print(), 800);
    }
  };

  const handleDownloadPDF = async () => {
    if (typeof window.html2pdf === 'undefined') {
      window.print();
      return;
    }

    setIsDownloading(true);
    const element = document.getElementById('resume-content');
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Nikhil_AM_DevOps_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Temporarily expand height for PDF capture
      const originalStyle = element?.style.height;
      if (element) element.style.height = 'auto';
      
      await window.html2pdf().set(opt).from(element).save();
      
      if (element) element.style.height = originalStyle || '';
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Filtering Logic
  const filteredSkills = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.skills;
    const lowerQuery = searchQuery.toLowerCase();
    
    return RESUME_DATA.skills.map(category => ({
      ...category,
      skills: category.skills.filter(skill => 
        skill.toLowerCase().includes(lowerQuery) || 
        category.category.toLowerCase().includes(lowerQuery)
      )
    })).filter(cat => cat.skills.length > 0);
  }, [searchQuery]);

  const filteredExperience = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.experience;
    const lowerQuery = searchQuery.toLowerCase();
    
    return RESUME_DATA.experience.filter(exp => 
      exp.company.toLowerCase().includes(lowerQuery) ||
      exp.role.toLowerCase().includes(lowerQuery) ||
      exp.description.some(d => d.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.projects;
    const lowerQuery = searchQuery.toLowerCase();
    
    return RESUME_DATA.projects.filter(proj => 
      proj.name.toLowerCase().includes(lowerQuery) ||
      proj.role.toLowerCase().includes(lowerQuery) ||
      proj.techStack.some(t => t.toLowerCase().includes(lowerQuery)) ||
      proj.description.some(d => d.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery]);

  const SidebarItem = ({ id, icon: Icon, label, count }: { id: string, icon: any, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
        activeTab === id 
          ? 'bg-gray-800/50 text-blue-400 border-blue-500' 
          : 'border-transparent text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      {count !== undefined && count > 0 && searchQuery && (
         <span className="bg-blue-900/50 border border-blue-700 text-blue-200 text-[10px] px-1.5 py-0.5 rounded-full">{count}</span>
      )}
    </button>
  );

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className={`min-h-screen font-mono transition-colors duration-300 ${printMode ? 'bg-white text-black' : 'bg-k8s-bg text-gray-300'}`}>
      
      {!printMode && (
        <>
          <div className="scanlines"></div>
          <div className="vignette"></div>
        </>
      )}

      {/* Modals */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <CommandPalette 
        isOpen={isCmdOpen} 
        setIsOpen={setIsCmdOpen}
        actions={{
          navigate: (tab) => setActiveTab(tab),
          contact: () => setIsContactOpen(true),
          download: handleDownloadPDF,
          print: togglePrintMode
        }}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded border pointer-events-auto transform transition-all duration-300 animate-in slide-in-from-right-10
              ${toast.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-100' : 'bg-gray-800/90 border-blue-500/50 text-blue-100'}
            `}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <Activity size={18} className="animate-spin" />}
            <span className="text-sm">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Print Mode Controls */}
      {printMode && (
        <div className="fixed top-4 right-4 z-50 print:hidden flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition-colors font-medium text-sm ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF
              </>
            )}
          </button>
          <button 
            onClick={() => setPrintMode(false)}
            className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-2 rounded shadow-lg hover:bg-gray-600 transition-colors font-medium text-sm"
          >
            <X size={16} />
            Exit Preview
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className={`h-16 border-b flex items-center justify-between px-4 sticky top-0 z-40 ${printMode ? 'hidden' : 'bg-k8s-panel border-k8s-border'}`}>
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="bg-blue-600/20 border border-blue-500/50 p-1.5 rounded">
            <LayoutDashboard size={20} className="text-blue-400" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-gray-100 tracking-tight leading-none text-sm">DEVOPS_CONSOLE</span>
            <span className="text-[10px] text-green-500 font-mono mt-0.5">● System Online</span>
          </div>
        </div>

        {/* Search Bar */}
        {!printMode && (
          <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search resources... or press Ctrl+K"
                value={searchQuery}
                onClick={() => setIsCmdOpen(true)}
                readOnly
                className="w-full bg-[#0d1117] border border-gray-700 text-gray-300 text-sm rounded-md py-1.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600 cursor-pointer font-mono"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                 <kbd className="hidden lg:inline-flex items-center border border-gray-600 bg-gray-800 rounded px-1.5 text-[10px] font-mono text-gray-400">Ctrl+K</kbd>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
           {/* Deploy Simulator Button */}
           {!printMode && (
            <button 
              onClick={handleDeployProfile}
              disabled={deployStep !== 'idle'}
              className={`
                hidden sm:flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all border
                ${deployStep === 'idle' ? 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-gray-800 border-gray-600 text-gray-400 cursor-wait'}
              `}
              title="Simulate Deployment"
            >
              {deployStep === 'idle' && <Rocket size={14} />}
              {deployStep === 'building' && <Activity size={14} className="animate-spin" />}
              {deployStep === 'pushing' && <Cloud size={14} className="animate-pulse" />}
              {deployStep === 'deployed' && <Check size={14} />}
              
              <span className="hidden lg:inline">
                {deployStep === 'idle' ? 'DEPLOY v2.0' : 
                 deployStep === 'building' ? 'BUILDING...' : 
                 deployStep === 'pushing' ? 'PUSHING...' : 'DEPLOYED'}
              </span>
            </button>
          )}

          {/* Contact Button */}
          {!printMode && (
            <button 
              onClick={() => setIsContactOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded text-xs font-medium transition-colors border border-green-500/50"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Connect</span>
            </button>
          )}

          <button 
            onClick={togglePrintMode}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs font-medium transition-colors text-gray-300"
            title="Print / Save as PDF"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {RESUME_DATA.personalInfo.avatar && (
            <img 
              src={RESUME_DATA.personalInfo.avatar} 
              alt="Profile" 
              className="w-8 h-8 rounded border border-gray-600 object-cover ml-2 grayscale hover:grayscale-0 transition-all"
            />
          )}
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`
          fixed top-16 bottom-0 left-0 z-30 w-64 bg-k8s-sidebar border-r border-k8s-border flex flex-col transition-transform duration-300 ease-in-out
          ${printMode ? 'hidden' : ''}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Box size={10} /> Cluster Resources
              </div>
            </div>
            <nav className="space-y-0.5 px-2">
              <SidebarItem id="overview" icon={Activity} label="Overview" />
              <SidebarItem id="workloads" icon={Box} label="Workloads" count={filteredExperience.length} />
              <SidebarItem id="config" icon={FileCode} label="ConfigMaps" count={filteredSkills.reduce((acc, cat) => acc + cat.skills.length, 0)} />
              <SidebarItem id="services" icon={GitBranch} label="Services" count={filteredProjects.length} />
              <SidebarItem id="nodes" icon={Server} label="Nodes (Edu)" />
            </nav>
            
            <div className="px-4 mt-8">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cluster Health</div>
              <div className="bg-[#0d1117] rounded p-3 border border-gray-800 shadow-inner">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-400">Node Status</span>
                  <span className="text-[10px] text-green-400 font-mono">Ready</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden mb-3">
                  <div className="bg-green-500 h-full w-[99%] shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-400">Memory Pressure</span>
                  <span className="text-[10px] text-blue-400 font-mono">12%</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[12%] shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Live Events Footer within Sidebar */}
          <LiveEvents />
        </aside>

        {/* Main Content Area */}
        <main className={`
          flex-1 p-4 md:p-6 transition-all duration-300
          ${printMode ? 'w-full p-0' : 'md:ml-64 mt-4'}
        `}>
          <div id="resume-content" className={printMode ? 'p-8 bg-white min-h-screen shadow-2xl max-w-[1024px] mx-auto text-black' : ''}>
            
            {/* Header Section */}
            <div className={`mb-8 ${printMode ? 'border-b-2 border-gray-800 pb-6' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div>
                    <h1 className={`text-4xl font-black mb-2 tracking-tight ${printMode ? 'text-gray-900' : 'text-gray-100'}`}>
                      {RESUME_DATA.personalInfo.name}
                    </h1>
                    <h2 className={`text-lg mb-4 font-mono ${printMode ? 'text-blue-700 font-bold' : 'text-blue-400'}`}>
                      {">"} {RESUME_DATA.personalInfo.role}
                    </h2>
                    
                    <div className={`flex flex-wrap gap-4 text-sm ${printMode ? 'text-gray-700' : 'text-gray-400'}`}>
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <a href={`mailto:${RESUME_DATA.personalInfo.email}`} className="hover:text-blue-400 transition-colors">
                          {RESUME_DATA.personalInfo.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{RESUME_DATA.personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{RESUME_DATA.personalInfo.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink size={14} />
                        <a href={`https://${RESUME_DATA.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                          {RESUME_DATA.personalInfo.linkedin}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {!printMode && (
                  <div className="bg-[#0d1117] p-4 rounded border border-gray-800 max-w-sm self-start hidden md:block">
                    <div className="text-[10px] text-gray-500 mb-2 font-mono uppercase">Current Status</div>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status="Available" />
                      <span className="text-[10px] text-gray-500 font-mono">Region: ap-south-1</span>
                    </div>
                    <p className="text-xs text-gray-400 italic">
                      {RESUME_DATA.personalInfo.status}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* OVERVIEW / SUMMARY */}
            <section className={`mb-8 ${(activeTab !== 'overview' && !searchQuery) && !printMode ? 'hidden' : 'block'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Terminal & Resource Chart */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div>
                    <SectionHeader title="System Log" icon={Terminal} />
                    <InteractiveTerminal initialMessage={RESUME_DATA.summary} printMode={printMode} onPrint={togglePrintMode} />
                  </div>
                  
                  {/* Resource Monitoring Chart (New Addition) */}
                  {!printMode && (
                    <div className="hidden lg:block">
                      <ResourceChart printMode={printMode} />
                    </div>
                  )}

                  {/* Skill Radar Chart (Only visible on screen in overview, not print) */}
                  {!printMode && (
                    <div className="hidden lg:block">
                      <SkillRadar skills={RESUME_DATA.skills} printMode={printMode} />
                    </div>
                  )}
                </div>

                {/* Right Column: Metrics */}
                <div className="lg:col-span-1 avoid-break">
                  <SectionHeader title="Key Metrics" icon={Activity} />
                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 h-auto content-start">
                    {RESUME_DATA.metrics.map((m, i) => (
                      <MetricGauge key={i} {...m} printMode={printMode} />
                    ))}
                  </div>
                  
                  {/* Mobile-only views for charts to prevent stacking too high */}
                  {!printMode && (
                    <div className="mt-6 lg:hidden flex flex-col gap-6">
                       <ResourceChart printMode={printMode} />
                       <SkillRadar skills={RESUME_DATA.skills} printMode={printMode} />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* CONFIG / SKILLS */}
            {(activeTab === 'config' || activeTab === 'overview' || searchQuery) && (
              <section className={`mb-8 ${filteredSkills.length === 0 ? 'hidden' : 'block'}`}>
                <SectionHeader title="Configuration (Skills)" icon={FileCode} count={filteredSkills.reduce((acc, cat) => acc + cat.skills.length, 0)} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSkills.map((cat, idx) => (
                    <div key={idx} className={`rounded p-4 border break-inside-avoid ${printMode ? 'bg-gray-50 border-gray-300' : 'bg-[#161b22] border-gray-800 hover:border-blue-500/50 transition-colors'}`}>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${printMode ? 'text-gray-900' : 'text-gray-200'}`}>
                        {cat.category.includes("Cloud") && <Cloud size={14} className={printMode ? "text-gray-600" : "text-blue-400"} />}
                        {cat.category.includes("Orchestration") && <Box size={14} className={printMode ? "text-gray-600" : "text-blue-400"} />}
                        {cat.category.includes("IaC") && <FileCode size={14} className={printMode ? "text-gray-600" : "text-blue-400"} />}
                        
                        {cat.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map((skill, sIdx) => (
                          <span 
                            key={sIdx} 
                            className={`text-[11px] px-2 py-1 rounded border font-mono ${
                              printMode 
                              ? 'bg-white border-gray-300 text-gray-800' 
                              : 'bg-gray-900/50 border-gray-700 text-gray-300'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* WORKLOADS / EXPERIENCE */}
            {(activeTab === 'workloads' || activeTab === 'overview' || searchQuery) && (
              <section className={`mb-8 ${filteredExperience.length === 0 ? 'hidden' : 'block'}`}>
                <SectionHeader title="Workloads (Experience)" icon={Box} count={filteredExperience.length} />
                <div className={`space-y-6 relative ml-3 pl-8 ${printMode ? 'border-l-2 border-gray-300' : 'border-l-2 border-gray-800'}`}>
                  {filteredExperience.map((exp, idx) => {
                    // In print mode show all, otherwise show top 3 unless filtered
                    const showAll = printMode || searchQuery;
                    const displayItems = showAll ? exp.description : exp.description.slice(0, 3);
                    const hasMore = exp.description.length > 3;

                    return (
                      <div key={idx} className="relative group break-inside-avoid">
                        <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 flex items-center justify-center ${printMode ? 'bg-blue-600 border-white' : 'bg-[#0d1117] border-blue-600'}`}>
                          <div className={`w-2 h-2 rounded-full ${printMode ? 'bg-white' : 'bg-blue-500'}`}></div>
                        </div>
                        
                        <div 
                          onClick={() => !printMode && setSelectedExperience(exp)}
                          className={`rounded p-5 border cursor-pointer ${
                            printMode 
                            ? 'bg-transparent border-none p-0 mb-6' 
                            : 'bg-[#161b22] border-gray-800 hover:border-blue-500/50 hover:bg-[#1c2128] transition-all'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <h3 className={`text-lg font-bold ${printMode ? 'text-gray-900' : 'text-gray-100'}`}>{exp.role}</h3>
                              {!printMode && (
                                <Maximize2 size={14} className="text-gray-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                            <span className={`text-sm font-mono ${printMode ? 'text-gray-600' : 'text-blue-400'}`}>{exp.period}</span>
                          </div>
                          <div className={`text-sm font-semibold mb-4 flex items-center gap-2 ${printMode ? 'text-gray-700' : 'text-gray-400'}`}>
                            <span>{exp.company}</span>
                            <span className="text-gray-600">|</span>
                            <span>{exp.location}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {displayItems.map((point, pIdx) => (
                              <li key={pIdx} className={`text-sm flex items-start gap-2 ${printMode ? 'text-gray-800' : 'text-gray-400'}`}>
                                <span className={`mt-1.5 text-[10px] ${printMode ? 'text-gray-500' : 'text-blue-500'}`}>▶</span>
                                <span className="leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                          {!printMode && hasMore && !searchQuery && (
                            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center text-xs text-blue-400 font-mono hover:text-blue-300">
                              <span className="mr-2">&gt;</span>
                              <span>view_full_logs --lines={exp.description.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SERVICES / PROJECTS */}
            {(activeTab === 'services' || activeTab === 'overview' || searchQuery) && (
              <section className={`mb-8 ${filteredProjects.length === 0 ? 'hidden' : 'block'}`}>
                <SectionHeader title="Services (Projects)" icon={GitBranch} count={filteredProjects.length} />
                <div className={`grid grid-cols-1 gap-4 ${printMode ? 'print-grid' : ''}`}>
                  {filteredProjects.map((proj, idx) => {
                    const showAll = printMode || searchQuery;
                    const displayItems = showAll ? proj.description : proj.description.slice(0, 2);
                    const hasMore = proj.description.length > 2;

                    return (
                      <div 
                        key={idx} 
                        onClick={() => !printMode && setSelectedProject(proj)}
                        className={`rounded border p-4 flex flex-col gap-2 cursor-pointer relative group break-inside-avoid ${
                          printMode 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-[#161b22] border-gray-800 hover:border-blue-500/50 transition-all'
                        }`}
                      >
                        {!printMode && (
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 size={16} className="text-blue-400" />
                          </div>
                        )}
                        <div>
                          <div className="flex justify-between items-start">
                             <h3 className={`font-bold text-base ${printMode ? 'text-blue-800' : 'text-blue-400'}`}>{proj.name}</h3>
                             <div className={`text-[10px] px-2 py-0.5 rounded border ${printMode ? 'bg-white border-gray-300' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>{proj.type}</div>
                          </div>
                          <div className={`text-xs ${printMode ? 'text-gray-600' : 'text-gray-500'} mb-2`}>{proj.role}</div>
                        </div>
                        
                        <ul className="mb-2 space-y-1">
                          {displayItems.map((desc, dIdx) => (
                            <li key={dIdx} className={`text-xs ${printMode ? 'text-gray-800' : 'text-gray-400'}`}>• {desc}</li>
                          ))}
                        </ul>
                        
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {proj.techStack.map((tech, tIdx) => (
                            <span key={tIdx} className={`text-[10px] px-1.5 py-0.5 rounded border ${printMode ? 'border-gray-300 text-gray-600' : 'border-gray-700 text-gray-500 bg-gray-900'}`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* EDUCATION & CERTS */}
            {(activeTab === 'nodes' || activeTab === 'overview' || searchQuery) && !searchQuery && (
              <section className={`${(activeTab !== 'nodes' && activeTab !== 'overview' && !printMode) ? 'hidden' : 'block'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <SectionHeader title="Education" icon={Award} />
                    <div className={`rounded p-4 border ${printMode ? 'bg-gray-50 border-gray-200' : 'bg-[#161b22] border-gray-800'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded ${printMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/20 text-blue-400'}`}>
                          <Award size={20} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${printMode ? 'text-gray-900' : 'text-gray-200'}`}>{RESUME_DATA.education.degree}</h3>
                          <p className={`text-xs ${printMode ? 'text-gray-700' : 'text-gray-400'}`}>{RESUME_DATA.education.institution}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{RESUME_DATA.education.year}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <SectionHeader title="Certifications" icon={CheckCircle2} />
                    <div className={`rounded p-4 border ${printMode ? 'bg-gray-50 border-gray-200' : 'bg-[#161b22] border-gray-800'}`}>
                      <ul className="space-y-2">
                        {RESUME_DATA.certifications.map((cert, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                            <span className={printMode ? 'text-gray-800' : 'text-gray-400'}>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}
            
          </div>
        </main>
      </div>

      {/* INSPECTOR MODAL FOR EXPERIENCE */}
      {selectedExperience && !printMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-[#161b22] w-full max-w-3xl rounded shadow-2xl border border-gray-700 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0d1117] rounded-t">
              <div className="flex items-center space-x-3">
                <Box size={20} className="text-blue-400" />
                <div>
                  <h3 className="text-gray-200 font-bold">{selectedExperience.company}</h3>
                  <p className="text-xs text-gray-500 font-mono">{selectedExperience.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedExperience(null)}
                className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6 text-sm text-gray-400 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {selectedExperience.location}
                </div>
                <div className="font-mono text-blue-300 bg-blue-900/20 px-2 py-1 rounded text-xs border border-blue-900/50">
                  {selectedExperience.period}
                </div>
              </div>

              <div className="bg-black/50 rounded border border-gray-800 p-4 font-mono text-sm">
                <div className="text-gray-500 mb-2 border-b border-gray-800 pb-2"># System Logs</div>
                <ul className="space-y-3 mt-3">
                  {selectedExperience.description.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-green-500 mt-1 shrink-0">➜</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 animate-pulse text-green-500">_</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTOR MODAL FOR PROJECTS */}
      {selectedProject && !printMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-[#161b22] w-full max-w-3xl rounded shadow-2xl border border-gray-700 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0d1117] rounded-t">
              <div className="flex items-center space-x-3">
                <GitBranch size={20} className="text-purple-400" />
                <div>
                  <h3 className="text-gray-200 font-bold">{selectedProject.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{selectedProject.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-6">
                
                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2">
                   {selectedProject.techStack.map((tech, i) => (
                     <span key={i} className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-gray-400 font-mono">
                       {tech}
                     </span>
                   ))}
                </div>

                {/* Description Block */}
                <div className="bg-black/50 rounded border border-gray-800 p-4 font-mono text-sm">
                  <div className="text-gray-500 mb-2 border-b border-gray-800 pb-2"># Service Configuration</div>
                  <ul className="space-y-3 mt-3">
                    {selectedProject.description.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="text-purple-500 mt-1 shrink-0">●</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer with Link */}
            <div className="p-4 border-t border-gray-800 bg-[#0d1117] rounded-b flex justify-between items-center">
              <div>
                {selectedProject.link && (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:underline transition-colors"
                  >
                    <Github size={16} />
                    <span>View Repository</span>
                    <ExternalLink size={14} className="text-gray-600" />
                  </a>
                )}
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/50 text-sm font-medium rounded transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;