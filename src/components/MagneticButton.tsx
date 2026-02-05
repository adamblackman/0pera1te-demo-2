import { useState, useRef, useCallback, MouseEvent } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Sparkles, X, Rocket, Check } from 'lucide-react';

export function MagneticButton({ onLog }: { onLog?: (msg: string) => void }) {
  const { isChaos } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const magnetStrength = isChaos ? 0.4 : 0.2;
    setPosition({
      x: distX * magnetStrength,
      y: distY * magnetStrength
    });
  }, [isChaos]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(() => {
    setShowModal(true);
    onLog?.('Modal opened → ready for demo');
  }, [onLog]);

  return (
    <>
      <div className="panel p-6 flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-secondary)' }}>
          Try the magnetic effect
        </p>

        <div
          className="relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={`
              relative px-8 py-4 rounded-2xl font-semibold text-white
              transition-all flex items-center gap-3
              ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : ''}
            `}
            style={{
              background: 'var(--accent-gradient)',
              transform: `translate(${position.x}px, ${position.y}px) scale(${isPressed ? 0.95 : isHovered ? 1.05 : 1})`,
              boxShadow: isHovered
                ? `0 20px 40px -10px ${isChaos ? 'rgba(244, 63, 94, 0.5)' : 'rgba(6, 182, 212, 0.5)'}`
                : undefined
            }}
          >
            <Sparkles className={`w-5 h-5 ${isHovered && isChaos ? 'animate-spin' : ''}`} />
            <span>Launch Demo</span>
            <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
          </button>

          {isHovered && (
            <div
              className="absolute inset-0 rounded-2xl -z-10"
              style={{
                background: 'var(--accent-gradient)',
                filter: 'blur(20px)',
                opacity: 0.5,
                transform: `translate(${position.x}px, ${position.y}px)`
              }}
            />
          )}
        </div>
      </div>

      {showModal && (
        <DemoModal
          onClose={() => {
            setShowModal(false);
            onLog?.('Modal closed');
          }}
          isChaos={isChaos}
          onLog={onLog}
        />
      )}
    </>
  );
}

function DemoModal({
  onClose,
  isChaos,
  onLog
}: {
  onClose: () => void;
  isChaos: boolean;
  onLog?: (msg: string) => void;
}) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Rocket, text: 'Initializing agents...' },
    { icon: Sparkles, text: 'Configuring workflows...' },
    { icon: Check, text: 'Ready to automate!' },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
      onLog?.(`Demo step ${step + 2}: ${steps[step + 1].text}`);
    } else {
      onClose();
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`
          relative panel p-8 max-w-md w-full space-y-6
          ${isChaos ? 'animate-wiggle' : ''}
        `}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-gray-500/20"
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <div className="text-center space-y-4">
          <div
            className={`
              w-20 h-20 mx-auto rounded-2xl flex items-center justify-center
              ${isChaos ? 'animate-float' : ''}
            `}
            style={{ background: 'var(--accent-gradient)' }}
          >
            <CurrentIcon className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-xl font-bold">{steps[step].text}</h3>

          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'w-6' : ''}`}
                style={{
                  background: i <= step ? 'var(--accent-1)' : 'var(--bg-accent)'
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--accent-gradient)' }}
        >
          {step < steps.length - 1 ? 'Continue' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}
