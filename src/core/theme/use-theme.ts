import { use } from 'react';
import { ThemeContext, type ThemeContextValue } from './theme-context';

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (context === null) {
    throw new Error('ThemeProvider is missing above this component');
  }
  return context;
}
