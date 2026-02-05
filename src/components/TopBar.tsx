import { useTheme } from '../context/ThemeContext';
import { Zap, Moon, Sun } from 'lucide-react';

export function TopBar() {
  const { mode, toggleMode, isChaos } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-gradient)' }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">0perA1te</span>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle mode={mode} onToggle={toggleMode} isChaos={isChaos} />
          <button
            className="hidden md:block px-4 py-2 rounded-full text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'var(--accent-gradient)' }}
          >
            Start Building
          </button>
        </div>
      </div>
    </header>
  );
}

function ModeToggle({ mode, onToggle, isChaos }: { mode: string; onToggle: () => void; isChaos: boolean }) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center gap-2 px-3 py-2 rounded-full panel cursor-pointer group"
      aria-label={`Switch to ${isChaos ? 'calm' : 'chaos'} mode`}
    >
      <div className="flex items-center gap-1.5">
        <Sun className={`w-4 h-4 transition-all ${!isChaos ? 'text-amber-500 scale-110' : 'text-gray-400 scale-90'}`} />
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {mode}
        </span>
        <Moon className={`w-4 h-4 transition-all ${isChaos ? 'scale-110' : 'text-gray-400 scale-90'}`} style={{ color: isChaos ? 'var(--accent-2)' : undefined }} />
      </div>
      <div
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
        style={{
          background: 'var(--accent-gradient)',
          filter: 'blur(8px)',
          zIndex: -1
        }}
      />
    </button>
  );
}
