import React, { useState, useEffect } from 'react';
import { X, Save, Terminal } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [step, setStep] = useState<'edit' | 'applying' | 'success'>('edit');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('edit');
      setLogs([]);
      setFormData({ name: '', email: '', message: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('applying');
    
    // Simulate deployment logs
    const newLogs = [
      'Validating ContactRequest manifest...',
      'Authentication check passed.',
      'Connecting to mail-service-v2...',
      'Sending payload to nikhilam.nn@gmail.com...'
    ];

    let delay = 0;
    newLogs.forEach((log, index) => {
      delay += 800;
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === newLogs.length - 1) {
          setTimeout(() => {
            setStep('success');
            // Here you would actually make an API call to a service like Formspree or EmailJS
          }, 1000);
        }
      }, delay);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-lg shadow-2xl border border-gray-600 flex flex-col overflow-hidden font-mono text-sm">
        
        {/* Header - VS Code style tab */}
        <div className="flex items-center justify-between bg-[#252526] px-4 py-2 border-b border-black">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">YAML</span>
            <span className="text-gray-400">contact-request.yaml</span>
            {step === 'edit' && <div className="w-2 h-2 bg-white rounded-full ml-2 opacity-50" />}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full min-h-[400px]">
          {/* Line Numbers */}
          <div className="hidden md:flex flex-col items-end bg-[#1e1e1e] text-gray-600 px-3 py-4 select-none border-r border-gray-700 w-12 text-xs leading-6">
            {Array.from({ length: 15 }).map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-4 bg-[#1e1e1e] relative">
            {step === 'edit' ? (
              <form onSubmit={handleSubmit} className="space-y-0 leading-6">
                <div className="text-purple-400">apiVersion: <span className="text-green-400">v1</span></div>
                <div className="text-purple-400">kind: <span className="text-green-400">ContactRequest</span></div>
                <div className="text-purple-400">metadata:</div>
                <div className="flex items-center group">
                  <span className="text-blue-400 ml-4 w-20">name:</span>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-transparent border-b border-gray-700 hover:border-gray-500 focus:border-blue-500 outline-none text-orange-300 w-full ml-2 px-1"
                    placeholder="<your-name>"
                  />
                </div>
                <div className="text-purple-400">spec:</div>
                <div className="flex items-center group">
                  <span className="text-blue-400 ml-4 w-20">email:</span>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-transparent border-b border-gray-700 hover:border-gray-500 focus:border-blue-500 outline-none text-orange-300 w-full ml-2 px-1"
                    placeholder="<your-email>"
                  />
                </div>
                <div className="flex items-start group mt-1">
                  <span className="text-blue-400 ml-4 w-20">message:</span>
                  <span className="text-yellow-400">|</span>
                </div>
                <div className="ml-8 mt-1 pl-4 border-l-2 border-gray-700">
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-transparent border-none outline-none text-orange-300 w-full h-32 resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <Save size={16} />
                    <span>Apply Configuration</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
                  <Terminal size={16} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Deployment Logs</span>
                </div>
                <div className="font-mono text-sm space-y-2 flex-1">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
                      <span className="text-gray-300">{log}</span>
                    </div>
                  ))}
                  {step === 'success' && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded text-green-400 flex flex-col gap-2 animate-in zoom-in duration-300">
                      <div className="font-bold">✓ Resource 'ContactRequest' created successfully.</div>
                      <div className="text-xs text-green-300/70">The system administrator (Nikhil) has been notified.</div>
                      <button 
                        onClick={onClose}
                        className="self-start mt-2 text-xs underline hover:text-green-300"
                      >
                        Close Terminal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-blue-600 px-2 py-1 flex items-center justify-between text-[10px] text-white">
          <div className="flex gap-4">
             <span>master*</span>
             <span>Ln {step === 'edit' ? '12' : 'EOF'}, Col 1</span>
          </div>
          <div>UTF-8</div>
        </div>
      </div>
    </div>
  );
};