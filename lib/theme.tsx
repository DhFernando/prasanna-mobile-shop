/**
 * Theme System
 * - Dark/Light mode: User preference (stored in localStorage)
 * - Color theme: Admin setting (stored on server, applies to all users)
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Available color themes (admin can choose)
export const colorThemes = {
  teal: {
    name: 'Teal',
    primary: '168 75% 32%',
    primaryHex: '#0d9488',
    primaryLight: '#2dd4bf',
    primaryDark: '#0f766e',
  },
  purple: {
    name: 'Purple',
    primary: '263 70% 66%',
    primaryHex: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
  },
  blue: {
    name: 'Blue',
    primary: '217 91% 60%',
    primaryHex: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
  },
  orange: {
    name: 'Orange',
    primary: '25 95% 53%',
    primaryHex: '#f97316',
    primaryLight: '#fb923c',
    primaryDark: '#ea580c',
  },
  rose: {
    name: 'Rose',
    primary: '350 89% 60%',
    primaryHex: '#f43f5e',
    primaryLight: '#fb7185',
    primaryDark: '#e11d48',
  },
  emerald: {
    name: 'Emerald',
    primary: '160 84% 39%',
    primaryHex: '#10b981',
    primaryLight: '#34d399',
    primaryDark: '#059669',
  },
  amber: {
    name: 'Amber',
    primary: '38 92% 50%',
    primaryHex: '#f59e0b',
    primaryLight: '#fbbf24',
    primaryDark: '#d97706',
  },
  indigo: {
    name: 'Indigo',
    primary: '239 84% 67%',
    primaryHex: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
  },
} as const;

export type ColorTheme = keyof typeof colorThemes;
export type Mode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  // User preference (localStorage)
  mode: Mode;
  setMode: (mode: Mode) => void;
  isDark: boolean;
  
  // Admin setting (server)
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => Promise<boolean>; // Admin only, saves to server
  currentTheme: typeof colorThemes[ColorTheme];
  
  // Loading state
  isLoading: boolean;
  refreshColorTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Apply theme to DOM
function applyTheme(colorTheme: ColorTheme, isDark: boolean) {
  const root = document.documentElement;
  const theme = colorThemes[colorTheme];
  
  // Apply color theme CSS variables
  root.style.setProperty('--p', theme.primary);
  root.style.setProperty('--pf', theme.primary);
  root.style.setProperty('--color-primary', theme.primaryHex);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--color-primary-dark', theme.primaryDark);
  root.setAttribute('data-color-theme', colorTheme);
  
  // Apply dark/light mode
  if (isDark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('system');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('teal');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch color theme from server (admin setting)
  const fetchColorTheme = useCallback(async () => {
    try {
      const res = await fetch('/api/theme');
      const data = await res.json();
      if (data.success && data.data.colorTheme) {
        const theme = data.data.colorTheme as ColorTheme;
        if (colorThemes[theme]) {
          setColorThemeState(theme);
          return theme;
        }
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
    return 'teal' as ColorTheme;
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      // Load user's dark/light preference from localStorage
      const savedMode = localStorage.getItem('theme-mode') as Mode | null;
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setModeState(savedMode);
      }
      
      // Load color theme from server
      await fetchColorTheme();
      
      setMounted(true);
      setIsLoading(false);
    };
    
    init();
  }, [fetchColorTheme]);

  // Handle dark/light mode changes
  useEffect(() => {
    if (!mounted) return;

    const updateDarkMode = () => {
      let dark = false;
      
      if (mode === 'dark') {
        dark = true;
      } else if (mode === 'light') {
        dark = false;
      } else {
        // System mode - detect OS preference
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(dark);
      applyTheme(colorTheme, dark);
    };

    updateDarkMode();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        updateDarkMode();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, colorTheme, mounted]);

  // Set dark/light mode (user preference, saves to localStorage)
  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // Set color theme (admin only, saves to server)
  const setColorTheme = async (newTheme: ColorTheme): Promise<boolean> => {
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorTheme: newTheme }),
      });
      
      if (res.ok) {
        setColorThemeState(newTheme);
        applyTheme(newTheme, isDark);
        return true;
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
    return false;
  };

  // Refresh color theme from server
  const refreshColorTheme = async () => {
    const theme = await fetchColorTheme();
    applyTheme(theme, isDark);
  };

  // Prevent flash - apply theme immediately
  useEffect(() => {
    if (mounted) {
      applyTheme(colorTheme, isDark);
    }
  }, [colorTheme, isDark, mounted]);

  // Return default values during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        isDark,
        colorTheme,
        setColorTheme,
        currentTheme: colorThemes[colorTheme],
        isLoading,
        refreshColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Return safe defaults during SSR
  if (context === undefined) {
    return {
      mode: 'system' as Mode,
      setMode: () => {},
      isDark: false,
      colorTheme: 'teal' as ColorTheme,
      setColorTheme: async () => false,
      currentTheme: colorThemes.teal,
      isLoading: true,
      refreshColorTheme: async () => {},
    };
  }
  return context;
}
