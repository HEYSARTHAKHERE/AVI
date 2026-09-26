import React, { createContext, useContext, useState, useEffect } from 'react';

export type PlatformMode = 'creator' | 'brand' | 'admin';

interface ModeContextType {
  activeMode: PlatformMode;
  setMode: (mode: PlatformMode) => void;
  toggleMode: () => void;
  isDemoDataEnabled: boolean;
  toggleDemoData: () => void;
  activeCurrency: string;
  setCurrency: (currency: string) => void;
}

const MODE_STORAGE_KEY = 'kollavo_active_platform_mode';
const DEMO_STORAGE_KEY = 'kollavo_demo_data_enabled';
const CURRENCY_STORAGE_KEY = 'kollavo_active_currency';

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMode, setActiveModeState] = useState<PlatformMode>(() => {
    try {
      const stored = localStorage.getItem(MODE_STORAGE_KEY) as PlatformMode;
      if (stored === 'creator' || stored === 'brand' || stored === 'admin') {
        return stored;
      }
    } catch {}
    return 'creator';
  });

  const [isDemoDataEnabled, setIsDemoDataEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {}
    return true; // Default to true in preview environment to allow testing workflows
  });

  const [activeCurrency, setActiveCurrency] = useState<string>(() => {
    try {
      return localStorage.getItem(CURRENCY_STORAGE_KEY) || 'USD';
    } catch {
      return 'USD';
    }
  });

  const setMode = (mode: PlatformMode) => {
    setActiveModeState(mode);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch {}
  };

  const toggleMode = () => {
    const next = activeMode === 'creator' ? 'brand' : 'creator';
    setMode(next);
  };

  const toggleDemoData = () => {
    setIsDemoDataEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const setCurrency = (curr: string) => {
    setActiveCurrency(curr);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, curr);
    } catch {}
  };

  return (
    <ModeContext.Provider
      value={{
        activeMode,
        setMode,
        toggleMode,
        isDemoDataEnabled,
        toggleDemoData,
        activeCurrency,
        setCurrency,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
