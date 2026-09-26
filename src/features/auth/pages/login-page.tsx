import { useT } from '@core/i18n/use-i18n';
import { BrandMark } from '@core/layout/brand-mark';
import { LocaleSwitcher } from '@core/layout/locale-switcher';
import { ThemeToggle } from '@core/theme/theme-toggle';
import emblemUrl from '@shared/assets/iccu-emblem.png';
import { PortalArch } from '@shared/components/ornaments/portal-arch';
import { LoginForm } from '../components/login-form';

function LoginShowcase() {
  const t = useT();
  return (
    <section className="ornament-girih relative hidden overflow-hidden bg-sidebar text-sidebar-foreground [--ornament-opacity:0.15] lg:flex lg:items-end lg:justify-center">
      <div className="relative aspect-[440/604] w-[min(27.5rem,72%)]">
        <PortalArch className="absolute inset-0 size-full text-sidebar-primary" />
        <div className="absolute inset-x-[15%] top-[26%] flex flex-col items-center gap-6 text-center">
          <img src={emblemUrl} alt="" className="size-40 object-contain xl:size-44" />
          <p className="text-[0.7rem] leading-relaxed font-bold tracking-[0.22em] text-sidebar-primary uppercase">
            {t('app.center')}
          </p>
          <p className="font-display text-5xl leading-none font-semibold">{t('app.library')}</p>
        </div>
      </div>
    </section>
  );
}

export function LoginPage() {
  const t = useT();
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <LoginShowcase />
      <div className="flex min-h-svh flex-col px-6 py-6 sm:px-14 sm:py-10">
        <div className="flex justify-end gap-2.5">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="grid w-full max-w-[27.5rem] gap-9">
            <div className="lg:hidden">
              <BrandMark tone="dark" />
            </div>
            <header className="grid gap-4">
              <div className="ornament-strip w-24" />
              <h1 className="font-display text-5xl leading-none font-semibold">
                {t('auth.login.title')}
              </h1>
            </header>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
