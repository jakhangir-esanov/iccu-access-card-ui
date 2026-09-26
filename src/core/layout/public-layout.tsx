import { Outlet } from 'react-router';
import { ThemeToggle } from '@core/theme/theme-toggle';
import { CelestialBackground } from '@shared/components/celestial/celestial-background';
import { BrandMark } from './brand-mark';
import { LocaleSwitcher } from './locale-switcher';

export function PublicLayout() {
  return (
    <div className="relative min-h-svh">
      <CelestialBackground />
      <header className="relative z-10 mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-4">
        <BrandMark tone="dark" />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-lg px-4 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
