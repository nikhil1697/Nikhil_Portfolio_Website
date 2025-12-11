import React, { useState, useEffect, useRef } from 'react';
import { RESUME_DATA } from '../constants';

interface InteractiveTerminalProps {
  initialMessage: string;
  printMode: boolean;
  onPrint?: () => void;
}

interface TerminalLine {
  type: 'input' | 'output';
  content: string;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({ initialMessage, printMode, onPrint }) => {
  const initialHistory: TerminalLine[] = [
    { type: 'input', content: 'cat professional_summary.txt' },
    { type: 'output', content: initialMessage }
  ];

  const [history, setHistory] = useState<TerminalLine[]>(initialHistory);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of the terminal container only
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click
  const handleContainerClick = () => {
    if (!printMode && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      // Don't add empty commands to history visibly, but process them (e.g. just a newline)
      const newHistory = cmd ? [...history, { type: 'input' as const, content: cmd }] : [...history];
      
      const lowerCmd = cmd.toLowerCase();
      let response = '';

      // Command processing logic
      switch (true) {
        case lowerCmd === 'help':
          response = 'Available commands:\n  kubectl [cmd]   Run kubernetes commands (get pods, nodes, svc)\n  ls              List files\n  cat [file]      Read file content\n  pwd             Print working directory\n  ps / top        System status\n  clear           Reset terminal\n  whoami          User info\n  contact         Contact details\n  print / pdf     Save as PDF';
          break;
        
        case lowerCmd === 'clear':
          // Reset to initial state instead of empty
          setHistory(initialHistory);
          setInput('');
          return;

        case lowerCmd === 'ls':
        case lowerCmd === 'll':
        case lowerCmd === 'ls -la':
          response = 'drwxr-xr-x  user  staff     . \ndrwxr-xr-x  user  staff     .. \n-rw-r--r--  user  staff     professional_summary.txt\n-rw-r--r--  user  staff     skills.json\n-rw-r--r--  user  staff     experience.log\n-rw-r--r--  user  staff     projects.yaml\n-rwxr-xr-x  user  staff     contact.sh';
          break;

        case lowerCmd === 'pwd':
          response = '/home/nikhil/profile';
          break;

        case lowerCmd.startsWith('echo '):
          response = cmd.slice(5);
          break;

        case lowerCmd === 'uname' || lowerCmd.startsWith('uname '):
          response = 'Linux devops-console 5.15.0-generic #42-Ubuntu SMP Mon Nov 11 10:00:00 UTC 2024 x86_64 GNU/Linux';
          break;
          
        case lowerCmd === 'ps' || lowerCmd === 'ps aux':
           response = 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1  16844  4352 ?        Ss   Mar10   0:15 /sbin/init\nnikhil    1337  0.1  0.4  28340  8540 pts/0    Ss   10:00   0:02 zsh\nnikhil    1338  2.5  1.2 402132 98214 ?        Sl   10:01   5:30 ./resume-web\nnikhil    1450  0.0  0.1   8340  3212 pts/0    R+   12:34   0:00 ps aux';
           break;

        case lowerCmd === 'top':
          response = 'top - 12:34:56 up 45 days,  2:30,  1 user,  load average: 0.05, 0.08, 0.10\nTasks:  12 total,   1 running,  11 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  1.5 us,  0.5 sy,  0.0 ni, 97.5 id,  0.3 wa,  0.0 hi,  0.2 si,  0.0 st\nMiB Mem :   7962.0 total,   1254.3 free,   3412.5 used,   3295.2 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1338 nikhil    20   0  402132  98214  22140 S   2.5   1.2   5:30.15 resume-web\n 1337 nikhil    20   0   28340   8540   4512 S   0.1   0.4   0:02.34 zsh';
          break;

        case lowerCmd.startsWith('mkdir') || lowerCmd.startsWith('touch') || lowerCmd.startsWith('rm '):
            response = `permission denied: read-only filesystem`;
            break;
            
        case lowerCmd.startsWith('sudo'):
            response = `nikhil is not in the sudoers file. This incident will be reported.`;
            break;

        case lowerCmd.startsWith('cd'):
            response = 'cd: restricted shell';
            break;

        case lowerCmd === 'whoami':
          response = `User: ${RESUME_DATA.personalInfo.name}\nRole: ${RESUME_DATA.personalInfo.role}\nStatus: ${RESUME_DATA.personalInfo.status}`;
          break;

        case lowerCmd === 'contact':
        case lowerCmd === './contact.sh':
          response = `Email: ${RESUME_DATA.personalInfo.email}\nPhone: ${RESUME_DATA.personalInfo.phone}\nLinkedIn: ${RESUME_DATA.personalInfo.linkedin}`;
          break;

        case lowerCmd === 'summary':
        case lowerCmd === 'cat professional_summary.txt':
          response = initialMessage;
          break;

        case lowerCmd === 'skills':
        case lowerCmd === 'cat skills.json':
          response = RESUME_DATA.skills.map(s => `[${s.category}]: ${s.skills.join(', ')}`).join('\n');
          break;

        case lowerCmd === 'exp':
        case lowerCmd === 'experience':
        case lowerCmd === 'cat experience.log':
          response = RESUME_DATA.experience.map(e => `* ${e.role} @ ${e.company} (${e.period})`).join('\n');
          break;

        case lowerCmd === 'projects':
        case lowerCmd === 'cat projects.yaml':
          response = RESUME_DATA.projects.map(p => `* ${p.name} (${p.type})`).join('\n');
          break;
          
        case ['print', 'pdf', 'download', 'save'].includes(lowerCmd):
          response = 'Launching print preview...';
          setTimeout(() => {
            if (onPrint) onPrint();
          }, 800);
          break;

        case lowerCmd === 'date':
          response = new Date().toString();
          break;

        // Mock Kubernetes Commands
        case lowerCmd.startsWith('kubectl') || lowerCmd.startsWith('k '):
          const kCmd = lowerCmd.replace(/^(kubectl|k)\s+/, '').trim();
          
          if (kCmd === 'version') {
            response = 'Client Version: v1.30.0\nKustomize Version: v5.0.4\nServer Version: v1.34.2';
          } else if (kCmd === 'get nodes' || kCmd === 'get no') {
            response = 'NAME           STATUS   ROLES           AGE    VERSION\nmaster-01      Ready    control-plane   4y2d   v1.34.2\nworker-01      Ready    <none>          4y2d   v1.34.2\nworker-02      Ready    <none>          4y2d   v1.34.2\nworker-03      Ready    <none>          2y5d   v1.34.2';
          } else if (kCmd === 'get pods' || kCmd === 'get po') {
            response = 'NAME                              READY   STATUS    RESTARTS   AGE\nresume-web-5d4f87c9-xl2qm         1/1     Running   0          5d\nresume-api-7f8b9c2d-9k4lp         1/1     Running   0          5d\npostgres-0                        1/1     Running   0          40d\nredis-cache-6c7d8e9f-2m5np        1/1     Running   0          12d';
          } else if (kCmd === 'get svc' || kCmd === 'get services') {
            response = 'NAME           TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE\nkubernetes     ClusterIP      10.96.0.1       <none>          443/TCP        4y\nresume-web     LoadBalancer   10.96.14.23     35.202.10.55    80:31244/TCP   5d\nresume-api     ClusterIP      10.96.121.55    <none>          8080/TCP       5d';
          } else if (kCmd === 'get ns' || kCmd === 'get namespaces') {
            response = 'NAME              STATUS   AGE\ndefault           Active   4y\nkube-system       Active   4y\nkube-public       Active   4y\nmonitoring        Active   2y\nresume-prod       Active   1y';
          } else if (kCmd === 'top nodes') {
             response = 'NAME           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%\nmaster-01      250m         12%    2412Mi          30%\nworker-01      450m         22%    4096Mi          51%\nworker-02      300m         15%    3500Mi          43%\nworker-03      100m         5%     1200Mi          15%';
          } else {
             response = `error: the server doesn't have a resource type "${kCmd}" or it is unknown.`;
          }
          break;
          
        case lowerCmd === '':
          response = '';
          break;
          
        case lowerCmd.startsWith('cat '):
          const fileName = lowerCmd.replace('cat ', '').trim();
          response = `cat: ${fileName}: No such file or directory`;
          break;

        default:
          response = `zsh: command not found: ${cmd}. Type 'help' for available commands.`;
      }

      if (response) {
        newHistory.push({ type: 'output', content: response });
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  if (printMode) {
    // Static view for printing
    return (
      <div className="bg-gray-50 border border-gray-300 text-black rounded-md overflow-hidden font-mono text-sm p-4">
        <div className="font-bold mb-2 text-blue-700">$ cat professional_summary.txt</div>
        <div className="whitespace-pre-wrap">{initialMessage}</div>
      </div>
    );
  }

  return (
    <div 
      className="bg-black rounded-md overflow-hidden border border-gray-700 font-mono text-sm shadow-lg flex flex-col h-full min-h-[300px]"
      onClick={handleContainerClick}
    >
      {/* Terminal Header */}
      <div className="bg-gray-800 px-3 py-1 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-xs">user@devops-machine:~/profile</div>
        <div className="w-8"></div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={containerRef}
        className="p-4 text-green-400 flex-grow overflow-y-auto custom-scrollbar"
      >
        {history.map((line, idx) => (
          <div key={idx} className="mb-2 break-words whitespace-pre-wrap">
            {line.type === 'input' ? (
              <div className="flex">
                <span className="text-blue-400 mr-2">➜</span>
                <span className="text-purple-400 mr-2">~</span>
                <span className="text-gray-100">{line.content}</span>
              </div>
            ) : (
              <div className="text-gray-300 ml-6 font-mono whitespace-pre-wrap">{line.content}</div>
            )}
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center">
          <span className="text-blue-400 mr-2">➜</span>
          <span className="text-purple-400 mr-2">~</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-gray-100 flex-grow"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};