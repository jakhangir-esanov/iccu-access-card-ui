import { Outlet } from 'react-router';
import { ThemeToggle } from '@core/theme/theme-toggle';
import { BrandMark } from './brand-mark';
import { LocaleSwitcher } from './locale-switcher';

export function PublicLayout() {
  return (
    <div className="min-h-svh">
      <div className="ornament-girih bg-sidebar text-sidebar-foreground [--ornament-opacity:0.15]">
        <header className="mx-auto grid max-w-lg gap-5 px-4 pt-4 pb-6">
          <div className="flex justify-end gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <BrandMark tone="light" />
        </header>
      </div>
      <div className="ornament-strip opacity-70" />
      <main className="mx-auto max-w-lg px-4 pt-6 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
