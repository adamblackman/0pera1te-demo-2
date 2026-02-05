import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface StatusItem {
  id: string;
  label: string;
  status: 'active' | 'idle' | 'busy';
}

const initialStatuses: StatusItem[] = [
  { id: 'agents', label: 'Agents Online', status: 'active' },
  { id: 'pipelines', label: 'Pipelines', status: 'active' },
  { id: 'queue', label: 'Queue', status: 'idle' },
  { id: 'monitoring', label: 'Monitoring', status: 'busy' },
];

export function StatusLEDs({ onLog }: { onLog?: (msg: string) => void }) {
  const { isChaos } = useTheme();
  const [statuses, setStatuses] = useState(initialStatuses);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatuses(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const newStatuses = [...prev];
        const states: StatusItem['status'][] = ['active', 'idle', 'busy'];
        const currentStateIndex = states.indexOf(newStatuses[randomIndex].status);
        const newStateIndex = (currentStateIndex + 1) % states.length;
        newStatuses[randomIndex] = {
          ...newStatuses[randomIndex],
          status: states[newStateIndex]
        };
        onLog?.(`${newStatuses[randomIndex].label} → ${states[newStateIndex]}`);
        return newStatuses;
      });
    }, isChaos ? 1500 : 3000);

    return () => clearInterval(interval);
  }, [isChaos, onLog]);

  return (
    <div className="panel p-6 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        System Status
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {statuses.map((item) => (
          <StatusIndicator
            key={item.id}
            item={item}
            isChaos={isChaos}
          />
        ))}
      </div>

      <div
        className="flex items-center justify-between text-xs px-3 py-2 rounded-xl"
        style={{ background: 'var(--bg-accent)' }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>Uptime</span>
        <span className="font-mono font-medium" style={{ color: 'var(--accent-2)' }}>
          99.97%
        </span>
      </div>
    </div>
  );
}

function StatusIndicator({ item, isChaos }: { item: StatusItem; isChaos: boolean }) {
  const colors = {
    active: isChaos ? '#22d3ee' : '#10b981',
    idle: isChaos ? '#f59e0b' : '#f59e0b',
    busy: isChaos ? '#f43f5e' : '#06b6d4',
  };

  const color = colors[item.status];

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
      style={{ background: 'var(--bg-accent)' }}
    >
      <div className="relative">
        <div
          className="w-3 h-3 rounded-full led-pulse"
          style={{ background: color }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            filter: 'blur(4px)',
            opacity: 0.5
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{item.label}</p>
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {item.status}
        </p>
      </div>
    </div>
  );
}
