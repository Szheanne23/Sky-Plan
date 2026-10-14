import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'night',
  setTheme: () => {},
  toggleTheme: () => {},
  isDay: false,
  isNight: true,
});

const STORAGE_KEY = 'skyplan_theme';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'day' || saved === 'night') return saved;
      return 'night';
    } catch {
      return 'night';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'day') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'day');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'night');
      root.style.colorScheme = 'dark';
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      console.warn('Failed to persist theme:', err);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    const valid = newTheme === 'day' ? 'day' : 'night';
    setThemeState(valid);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'night' ? 'day' : 'night'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDay: theme === 'day',
        isNight: theme === 'night',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
