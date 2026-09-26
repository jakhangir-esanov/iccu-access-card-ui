import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  applyThemeClass,
  getSystemTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  type Theme,
} from './theme';
import { ThemeContext, type ThemeContextValue } from './theme-context';

function useSystemPrefersDark(): boolean {
  const [matches, setMatches] = useState<boolean>(() => getSystemTheme() === 'dark');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  return matches;
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const systemDark = useSystemPrefersDark();
  const resolvedTheme = useMemo(() => resolveTheme(theme, systemDark), [theme, systemDark]);

  useEffect(() => {
    applyThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    storeTheme(next);
    setThemeState(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
