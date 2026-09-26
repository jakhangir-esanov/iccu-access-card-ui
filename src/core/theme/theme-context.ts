import { createContext } from 'react';
import type { ResolvedTheme, Theme } from './theme';

export interface ThemeContextValue {
  readonly theme: Theme;
  readonly resolvedTheme: ResolvedTheme;
  readonly setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
