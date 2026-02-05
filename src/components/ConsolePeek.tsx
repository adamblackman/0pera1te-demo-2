import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Terminal } from 'lucide-react';

interface LogEntry {
  id: number;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'action';
}

const idleMessages = [
  'Listening for events...',
  'All systems nominal',
  'Agents standing by',
  'Pipeline healthy',
  'Monitoring active',
  'Ready for input',
];

export function ConsolePeek({ logs }: { logs: LogEntry[] }) {
  const { isChaos } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayLogs, setDisplayLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (logs.length > 0) {
      setDisplayLogs(logs.slice(-6));
    }
  }, [logs]);

  useEffect(() => {
    if (logs.length === 0) {
      const interval = setInterval(() => {
        const message = idleMessages[Math.floor(Math.random() * idleMessages.length)];
        const newLog: LogEntry = {
          id: Date.now(),
          message,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: 'info'
        };
        setDisplayLogs(prev => [...prev.slice(-5), newLog]);
      }, isChaos ? 2000 : 4000);

      return () => clearInterval(interval);
    }
  }, [logs.length, isChaos]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayLogs]);

  return (
    <div className="panel p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4" style={{ color: 'var(--accent-1)' }} />
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Console
        </h3>
        <div className="flex gap-1 ml-auto">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-32 overflow-y-auto scrollbar-hide rounded-xl p-3 font-mono text-xs space-y-1"
        style={{ background: isChaos ? '#0a0a0a' : '#1e293b' }}
      >
        {displayLogs.map((log) => (
          <LogLine key={log.id} log={log} isChaos={isChaos} />
        ))}
        <div className={`flex items-center gap-1 ${isChaos ? 'animate-pulse' : ''}`}>
          <span style={{ color: 'var(--accent-1)' }}>$</span>
          <span className="w-2 h-4 bg-current animate-pulse" style={{ color: 'var(--accent-1)' }} />
        </div>
      </div>
    </div>
  );
}

function LogLine({ log, isChaos }: { log: LogEntry; isChaos: boolean }) {
  const colors = {
    info: isChaos ? '#a3a3a3' : '#94a3b8',
    success: isChaos ? '#22d3ee' : '#10b981',
    action: isChaos ? '#f43f5e' : '#06b6d4',
  };

  return (
    <div className="flex items-start gap-2 opacity-90 hover:opacity-100 transition-opacity">
      <span className="text-gray-500 flex-shrink-0">{log.timestamp}</span>
      <span style={{ color: colors[log.type] }}>{log.message}</span>
    </div>
  );
}

export function useConsoleLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: LogEntry['type'] = 'action') => {
    const newLog: LogEntry = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  return { logs, addLog };
}
