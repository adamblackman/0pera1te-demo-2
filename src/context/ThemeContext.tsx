import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Mode = 'calm' | 'chaos';

interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
  isChaos: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('calm');

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'calm' ? 'chaos' : 'calm');
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, isChaos: mode === 'chaos' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
