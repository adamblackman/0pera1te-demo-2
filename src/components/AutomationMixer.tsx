import { useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Gauge, Zap, DollarSign, Layers } from 'lucide-react';

interface SliderConfig {
  id: string;
  label: string;
  icon: typeof Gauge;
  color: string;
  chaosColor: string;
}

const sliders: SliderConfig[] = [
  { id: 'speed', label: 'Speed', icon: Zap, color: '#06b6d4', chaosColor: '#f43f5e' },
  { id: 'reliability', label: 'Reliability', icon: Gauge, color: '#10b981', chaosColor: '#8b5cf6' },
  { id: 'cost', label: 'Cost', icon: DollarSign, color: '#f59e0b', chaosColor: '#22d3ee' },
  { id: 'complexity', label: 'Complexity', icon: Layers, color: '#8b5cf6', chaosColor: '#f59e0b' },
];

const taglines = [
  'Ready to deploy',
  'Optimizing flow',
  'Maximum efficiency',
  'Peak performance',
  'Perfectly balanced',
  'Running hot',
];

export function AutomationMixer({ onLog }: { onLog?: (msg: string) => void }) {
  const { isChaos } = useTheme();
  const [values, setValues] = useState<Record<string, number>>({
    speed: 65,
    reliability: 80,
    cost: 40,
    complexity: 55,
  });
  const [activeKnob, setActiveKnob] = useState<string | null>(null);

  const handleChange = useCallback((id: string, value: number) => {
    setValues(prev => ({ ...prev, [id]: value }));
    onLog?.(`Adjusting ${id} → ${value}%`);
  }, [onLog]);

  const avgValue = Object.values(values).reduce((a, b) => a + b, 0) / Object.values(values).length;
  const taglineIndex = Math.floor((avgValue / 100) * (taglines.length - 1));

  return (
    <div className="panel p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Automation Mixer
        </h3>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeKnob ? 'scale-110' : ''}`}
          style={{
            background: 'var(--bg-accent)',
            color: 'var(--text-primary)'
          }}
        >
          {taglines[taglineIndex]}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sliders.map((slider) => (
          <SliderKnob
            key={slider.id}
            config={slider}
            value={values[slider.id]}
            onChange={(v) => handleChange(slider.id, v)}
            isActive={activeKnob === slider.id}
            onActiveChange={(active) => setActiveKnob(active ? slider.id : null)}
            isChaos={isChaos}
          />
        ))}
      </div>

      <MeterBar values={values} isChaos={isChaos} />
    </div>
  );
}

function SliderKnob({
  config,
  value,
  onChange,
  isActive,
  onActiveChange,
  isChaos
}: {
  config: SliderConfig;
  value: number;
  onChange: (v: number) => void;
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
  isChaos: boolean;
}) {
  const Icon = config.icon;
  const color = isChaos ? config.chaosColor : config.color;

  return (
    <div
      className={`p-4 rounded-2xl transition-all ${isActive ? 'scale-105' : ''}`}
      style={{ background: 'var(--bg-accent)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          {config.label}
        </span>
        <span
          className="ml-auto text-sm font-bold tabular-nums"
          style={{ color }}
        >
          {value}%
        </span>
      </div>

      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{
            width: `${value}%`,
            background: color,
            boxShadow: isActive ? `0 0 12px ${color}` : undefined
          }}
        />
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseDown={() => onActiveChange(true)}
        onMouseUp={() => onActiveChange(false)}
        onTouchStart={() => onActiveChange(true)}
        onTouchEnd={() => onActiveChange(false)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ position: 'relative', marginTop: '-8px' }}
      />
    </div>
  );
}

function MeterBar({ values, isChaos }: { values: Record<string, number>; isChaos: boolean }) {
  const total = Object.values(values).reduce((a, b) => a + b, 0);
  const max = Object.values(values).length * 100;
  const percentage = (total / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>System Load</span>
        <span className="font-mono">{Math.round(percentage)}%</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-accent)' }}>
        <div
          className={`h-full rounded-full transition-all ${isChaos ? 'led-pulse' : ''}`}
          style={{
            width: `${percentage}%`,
            background: 'var(--accent-gradient)'
          }}
        />
      </div>
    </div>
  );
}
