import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TopBar } from './components/TopBar';
import { AutomationMixer } from './components/AutomationMixer';
import { BuildStrip } from './components/BuildStrip';
import { MagneticButton } from './components/MagneticButton';
import { StatusLEDs } from './components/StatusLEDs';
import { FlipCardWall } from './components/FlipCardWall';
import { ConsolePeek, useConsoleLog } from './components/ConsolePeek';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { isChaos } = useTheme();
  const { logs, addLog } = useConsoleLog();

  return (
    <div className={isChaos ? 'chaos-mode' : ''}>
      <TopBar />

      <main className="min-h-screen pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <HeroSection isChaos={isChaos} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-6">
              <AutomationMixer onLog={addLog} />
              <StatusLEDs onLog={addLog} />
            </div>

            <div className="lg:col-span-7 space-y-6">
              <BuildStrip onLog={addLog} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MagneticButton onLog={addLog} />
                <ConsolePeek logs={logs} />
              </div>
            </div>
          </div>

          <FlipCardWall onLog={addLog} />

          <Footer />
        </div>
      </main>
    </div>
  );
}

function HeroSection({ isChaos }: { isChaos: boolean }) {
  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter ${isChaos ? 'animate-float' : ''}`}>
              <span className="accent-text">0perA1te</span>
            </h1>
            <div
              className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${isChaos ? 'animate-wiggle' : ''}
              `}
              style={{
                background: 'var(--accent-gradient)',
                color: 'white'
              }}
            >
              AI Agency
            </div>
          </div>

          <p className="text-xl md:text-2xl font-medium" style={{ color: 'var(--text-secondary)' }}>
            Automate Anything
          </p>

          <p className="text-sm max-w-md" style={{ color: 'var(--text-secondary)' }}>
            Build intelligent workflows in seconds. No code required.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <MetricBadge
            label="Workflows"
            value="2.4k+"
            isChaos={isChaos}
          />
          <MetricBadge
            label="Hours Saved"
            value="150k+"
            isChaos={isChaos}
          />
        </div>
      </div>
    </section>
  );
}

function MetricBadge({ label, value, isChaos }: { label: string; value: string; isChaos: boolean }) {
  return (
    <div
      className={`
        panel px-4 py-3 text-center min-w-[100px]
        ${isChaos ? 'hover:rotate-2' : 'hover:scale-105'}
        transition-transform cursor-default
      `}
    >
      <p className="text-2xl font-bold accent-text">{value}</p>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pt-12 pb-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-1)' }} />
          <span>Built for builders</span>
        </div>

        <div className="flex items-center gap-6">
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Docs</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="hover:opacity-80 transition-opacity"
      style={{ color: 'var(--text-secondary)' }}
    >
      {children}
    </a>
  );
}

export default App;
