import { Outlet } from 'react-router';
import { BrandMark } from './brand-mark';
import { LocaleSwitcher } from './locale-switcher';

export function PublicLayout() {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,var(--color-accent),transparent_55%)]">
      <header className="mx-auto flex max-w-lg items-center justify-between gap-2 px-4 py-4">
        <BrandMark tone="dark" />
        <LocaleSwitcher />
      </header>
      <main className="mx-auto max-w-lg px-4 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
