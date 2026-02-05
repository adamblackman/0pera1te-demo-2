import { useState, useCallback, DragEvent } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mail, FileSpreadsheet, Users, MessageSquare, Globe, Tag, GitBranch, FileText, X, ChevronRight } from 'lucide-react';

interface Chip {
  id: string;
  label: string;
  icon: typeof Mail;
  color: string;
}

const availableChips: Chip[] = [
  { id: 'email', label: 'Email', icon: Mail, color: '#06b6d4' },
  { id: 'sheets', label: 'Sheets', icon: FileSpreadsheet, color: '#10b981' },
  { id: 'crm', label: 'CRM', icon: Users, color: '#8b5cf6' },
  { id: 'slack', label: 'Slack', icon: MessageSquare, color: '#f59e0b' },
  { id: 'scrape', label: 'Scrape', icon: Globe, color: '#ef4444' },
  { id: 'classify', label: 'Classify', icon: Tag, color: '#ec4899' },
  { id: 'route', label: 'Route', icon: GitBranch, color: '#14b8a6' },
  { id: 'summarize', label: 'Summarize', icon: FileText, color: '#6366f1' },
];

export function BuildStrip({ onLog }: { onLog?: (msg: string) => void }) {
  const { isChaos } = useTheme();
  const [workflow, setWorkflow] = useState<Chip[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [draggingChip, setDraggingChip] = useState<string | null>(null);

  const handleDragStart = useCallback((e: DragEvent, chip: Chip) => {
    e.dataTransfer.setData('chipId', chip.id);
    setDraggingChip(chip.id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingChip(null);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const chipId = e.dataTransfer.getData('chipId');
    if (chipId) {
      const chip = availableChips.find(c => c.id === chipId);
      if (chip) {
        setWorkflow(prev => [...prev, { ...chip, id: `${chip.id}-${Date.now()}` }]);
        onLog?.(`Added ${chip.label} to workflow`);
      }
    }
  }, [onLog]);

  const handleRemove = useCallback((id: string, label: string) => {
    setWorkflow(prev => prev.filter(c => c.id !== id));
    onLog?.(`Removed ${label} from workflow`);
  }, [onLog]);

  const handleClear = useCallback(() => {
    setWorkflow([]);
    onLog?.('Workflow cleared');
  }, [onLog]);

  return (
    <div className="panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Build Strip
        </h3>
        {workflow.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-red-500/20 text-red-500"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableChips.map((chip) => (
          <DraggableChip
            key={chip.id}
            chip={chip}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDragging={draggingChip === chip.id}
            isChaos={isChaos}
          />
        ))}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          min-h-[80px] rounded-2xl border-2 border-dashed p-4 transition-all
          flex items-center gap-2 overflow-x-auto scrollbar-hide
          ${dragOver ? 'scale-[1.02]' : ''}
        `}
        style={{
          borderColor: dragOver ? 'var(--accent-1)' : 'var(--bg-accent)',
          background: dragOver ? 'var(--bg-accent)' : 'transparent'
        }}
      >
        {workflow.length === 0 ? (
          <span className="text-sm w-full text-center" style={{ color: 'var(--text-secondary)' }}>
            Drop chips here to build
          </span>
        ) : (
          workflow.map((chip, index) => (
            <div key={chip.id} className="flex items-center">
              <WorkflowChip
                chip={chip}
                onRemove={() => handleRemove(chip.id, chip.label)}
                isChaos={isChaos}
              />
              {index < workflow.length - 1 && (
                <ChevronRight
                  className={`w-4 h-4 mx-1 flex-shrink-0 ${isChaos ? 'animate-pulse' : ''}`}
                  style={{ color: 'var(--accent-1)' }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {workflow.length > 0 && (
        <div
          className="text-xs text-center py-2 rounded-lg"
          style={{ background: 'var(--bg-accent)', color: 'var(--text-secondary)' }}
        >
          {workflow.length} step{workflow.length > 1 ? 's' : ''} configured
        </div>
      )}
    </div>
  );
}

function DraggableChip({
  chip,
  onDragStart,
  onDragEnd,
  isDragging,
  isChaos
}: {
  chip: Chip;
  onDragStart: (e: DragEvent, chip: Chip) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isChaos: boolean;
}) {
  const Icon = chip.icon;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, chip)}
      onDragEnd={onDragEnd}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl cursor-grab active:cursor-grabbing
        transition-all hover:scale-105 select-none
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isChaos ? 'hover:rotate-2' : ''}
      `}
      style={{
        background: `${chip.color}20`,
        border: `1px solid ${chip.color}40`
      }}
    >
      <Icon className="w-4 h-4" style={{ color: chip.color }} />
      <span className="text-xs font-medium" style={{ color: chip.color }}>
        {chip.label}
      </span>
    </div>
  );
}

function WorkflowChip({
  chip,
  onRemove,
  isChaos
}: {
  chip: Chip;
  onRemove: () => void;
  isChaos: boolean;
}) {
  const Icon = chip.icon;

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0
        transition-all group animate-float
        ${isChaos ? 'hover:rotate-3' : ''}
      `}
      style={{
        background: chip.color,
        animationDelay: `${Math.random() * 0.5}s`
      }}
    >
      <Icon className="w-4 h-4 text-white" />
      <span className="text-xs font-medium text-white">
        {chip.label}
      </span>
      <button
        onClick={onRemove}
        className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}
