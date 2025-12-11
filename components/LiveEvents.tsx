import React, { useState, useEffect, useRef } from 'react';

interface ClusterEvent {
  id: number;
  time: string;
  type: 'Normal' | 'Warning';
  reason: string;
  object: string;
  message: string;
}

export const LiveEvents: React.FC = () => {
  const [events, setEvents] = useState<ClusterEvent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Fake event generator data
  const namespaces = ['default', 'kube-system', 'monitoring'];
  const objects = ['pod/nginx-v2', 'deployment/redis', 'service/api-gateway', 'cronjob/backup', 'node/worker-01'];
  const reasons = ['Scheduled', 'Pulling', 'Pulled', 'Created', 'Started', 'Scaling', 'Healthy'];
  const warnings = ['HighCPU', 'OOMKilled', 'ProbeFailed', 'NetworkDelay'];

  const addEvent = () => {
    const isWarning = Math.random() > 0.85; // 15% chance of warning
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour12: false });
    
    const type = isWarning ? 'Warning' : 'Normal';
    const reason = isWarning 
      ? warnings[Math.floor(Math.random() * warnings.length)]
      : reasons[Math.floor(Math.random() * reasons.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    const ns = namespaces[Math.floor(Math.random() * namespaces.length)];
    
    let message = '';
    if (isWarning) {
       message = `Issue detected in ${ns}/${object}: ${reason}`;
    } else {
       message = `Successfully ${reason.toLowerCase()} resource ${ns}/${object}`;
    }

    const newEvent: ClusterEvent = {
      id: Date.now(),
      time: timeStr,
      type,
      reason,
      object,
      message
    };

    setEvents(prev => [...prev.slice(-15), newEvent]); // Keep last 15
  };

  // Initial population
  useEffect(() => {
    const initEvents = Array.from({length: 3}).map((_, i) => ({
       id: i,
       time: new Date(Date.now() - (3-i)*1000).toLocaleTimeString([], { hour12: false }),
       type: 'Normal' as const,
       reason: 'Ready',
       object: 'node/master-01',
       message: 'Node is ready to accept workloads'
    }));
    setEvents(initEvents);

    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // Randomize frequency
        addEvent();
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="mt-6 flex flex-col h-[200px] bg-[#141619] border-t border-gray-800">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between bg-k8s-sidebar">
        <span>Live Events</span>
        <div className="flex items-center gap-1">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px]">Watching</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-3 custom-scrollbar"
      >
        {events.map((evt) => (
          <div key={evt.id} className="flex flex-col gap-0.5 text-[10px] border-l-2 border-gray-700 pl-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-gray-500 font-mono">
              <span>{evt.time}</span>
              <span className={evt.type === 'Warning' ? 'text-yellow-500' : 'text-green-500'}>
                {evt.type}
              </span>
            </div>
            <div className="font-medium text-gray-300 truncate" title={evt.object}>
              {evt.object}
            </div>
            <div className="text-gray-400 truncate leading-tight">
              {evt.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};