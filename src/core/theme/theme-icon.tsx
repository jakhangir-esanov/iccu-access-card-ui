import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { Theme } from './theme';

export function ThemeIcon({ theme }: Readonly<{ theme: Theme }>) {
  if (theme === 'dark') {
    return <MoonIcon aria-hidden />;
  }
  if (theme === 'light') {
    return <SunIcon aria-hidden />;
  }
  return <MonitorIcon aria-hidden />;
}
