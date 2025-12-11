import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Layout, Box, FileCode, GitBranch, Award, Mail, Download, Printer } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actions: {
    navigate: (tab: string) => void;
    contact: () => void;
    download: () => void;
    print: () => void;
  };
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, actions }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'overview', label: 'Go to Overview', icon: Layout, action: () => actions.navigate('overview'), group: 'Navigation' },
    { id: 'workloads', label: 'Go to Workloads', icon: Box, action: () => actions.navigate('workloads'), group: 'Navigation' },
    { id: 'config', label: 'Go to Configuration', icon: FileCode, action: () => actions.navigate('config'), group: 'Navigation' },
    { id: 'services', label: 'Go to Services', icon: GitBranch, action: () => actions.navigate('services'), group: 'Navigation' },
    { id: 'education', label: 'Go to Education', icon: Award, action: () => actions.navigate('nodes'), group: 'Navigation' },
    { id: 'contact', label: 'Contact Me', icon: Mail, action: actions.contact, group: 'Actions' },
    { id: 'pdf', label: 'Download PDF', icon: Download, action: actions.download, group: 'Actions' },
    { id: 'print', label: 'Print View', icon: Printer, action: actions.print, group: 'Actions' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev: boolean) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] p-4">
      <div className="w-full max-w-lg bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 border-b border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="w-full bg-transparent border-none p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="text-xs text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">ESC</div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">No commands found.</div>
          ) : (
            <>
              {['Navigation', 'Actions'].map(group => {
                const groupCommands = filteredCommands.filter(c => c.group === group);
                if (groupCommands.length === 0) return null;
                
                return (
                  <div key={group}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{group}</div>
                    {groupCommands.map((cmd) => {
                      // Calculate global index for selection highlighting
                      const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors ${
                            isSelected ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div className="flex items-center gap-3">
                            <cmd.icon size={18} className={isSelected ? 'text-blue-400' : 'text-gray-500'} />
                            <span>{cmd.label}</span>
                          </div>
                          {isSelected && <ArrowRight size={16} className="text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
        
        <div className="bg-[#252526] px-4 py-2 border-t border-gray-700 text-[10px] text-gray-500 flex justify-between">
           <div className="flex gap-3">
             <span><span className="font-bold">↑↓</span> to navigate</span>
             <span><span className="font-bold">↵</span> to select</span>
           </div>
           <span>DevOps Console v1.0</span>
        </div>
      </div>
    </div>
  );
};