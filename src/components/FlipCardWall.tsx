import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Clock, Zap, AlertCircle, CheckCircle, FileText, Bot, Users, BarChart3 } from 'lucide-react';

interface FlipCardData {
  id: string;
  before: { icon: typeof Clock; text: string; subtext: string };
  after: { icon: typeof Zap; text: string; subtext: string };
}

const cards: FlipCardData[] = [
  {
    id: 'time',
    before: { icon: Clock, text: '4 hours', subtext: 'Manual data entry' },
    after: { icon: Zap, text: '4 seconds', subtext: 'Auto-synced' },
  },
  {
    id: 'errors',
    before: { icon: AlertCircle, text: '12% error rate', subtext: 'Human mistakes' },
    after: { icon: CheckCircle, text: '0.1% errors', subtext: 'AI validated' },
  },
  {
    id: 'reports',
    before: { icon: FileText, text: 'Weekly report', subtext: 'Compiled manually' },
    after: { icon: Bot, text: 'Real-time', subtext: 'Auto-generated' },
  },
  {
    id: 'team',
    before: { icon: Users, text: '5 people', subtext: 'Processing tasks' },
    after: { icon: BarChart3, text: '5 people', subtext: 'Strategic work' },
  },
];

export function FlipCardWall({ onLog }: { onLog?: (msg: string) => void }) {
  const { isChaos } = useTheme();

  return (
    <div className="panel p-6 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        Before / After
      </h3>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        Tap to flip
      </p>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <FlipCard
            key={card.id}
            card={card}
            isChaos={isChaos}
            onFlip={(isAfter) => onLog?.(`Flipped ${card.id} → ${isAfter ? 'after' : 'before'}`)}
          />
        ))}
      </div>
    </div>
  );
}

function FlipCard({
  card,
  isChaos,
  onFlip
}: {
  card: FlipCardData;
  isChaos: boolean;
  onFlip: (isAfter: boolean) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(f => !f);
    onFlip(!isFlipped);
  };

  const BeforeIcon = card.before.icon;
  const AfterIcon = card.after.icon;

  return (
    <div
      className="relative h-32 cursor-pointer perspective-1000"
      onClick={handleFlip}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          absolute inset-0 transition-transform preserve-3d
          ${isChaos ? 'duration-300' : 'duration-500'}
        `}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl p-4 flex flex-col items-center justify-center backface-hidden"
          style={{
            background: 'var(--bg-accent)',
            backfaceVisibility: 'hidden'
          }}
        >
          <BeforeIcon
            className="w-8 h-8 mb-2"
            style={{ color: isChaos ? '#f43f5e' : '#f59e0b' }}
          />
          <p className="text-sm font-bold">{card.before.text}</p>
          <p className="text-[10px] text-center" style={{ color: 'var(--text-secondary)' }}>
            {card.before.subtext}
          </p>
          <span
            className="absolute top-2 right-2 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            Before
          </span>
        </div>

        <div
          className="absolute inset-0 rounded-2xl p-4 flex flex-col items-center justify-center"
          style={{
            background: 'var(--accent-gradient)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <AfterIcon className="w-8 h-8 mb-2 text-white" />
          <p className="text-sm font-bold text-white">{card.after.text}</p>
          <p className="text-[10px] text-center text-white/80">
            {card.after.subtext}
          </p>
          <span
            className="absolute top-2 right-2 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/20 text-white"
          >
            After
          </span>
        </div>
      </div>
    </div>
  );
}
