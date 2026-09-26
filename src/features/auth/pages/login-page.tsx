import { useT } from '@core/i18n/use-i18n';
import { LocaleSwitcher } from '@core/layout/locale-switcher';
import { ThemeToggle } from '@core/theme/theme-toggle';
import emblemUrl from '@shared/assets/iccu-emblem.png';
import { CelestialBackground } from '@shared/components/celestial/celestial-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { LoginForm } from '../components/login-form';

function LoginHero() {
  const t = useT();
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <div className="pointer-events-none absolute size-36 rounded-full bg-gold/25 blur-3xl" />
        <img
          src={emblemUrl}
          alt=""
          className="relative size-24 object-contain drop-shadow-[0_4px_24px_rgba(212,175,55,0.4)] sm:size-28"
        />
      </div>
      <div className="flex w-full max-w-xl items-center justify-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-turquoise/60" />
        <span className="px-1 text-center text-[0.7rem] font-semibold tracking-[0.25em] text-turquoise uppercase sm:text-xs">
          {t('app.center')}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-turquoise/60" />
      </div>
      <h1 className="max-w-2xl px-2 text-center text-xl font-bold tracking-wider text-foreground uppercase sm:text-2xl md:text-3xl dark:bg-gradient-to-r dark:from-slate-100 dark:via-amber-100 dark:to-amber-300 dark:bg-clip-text dark:text-transparent">
        {t('app.fullName')}
      </h1>
    </div>
  );
}

export function LoginPage() {
  const t = useT();
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-12">
      <CelestialBackground />
      <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
      <LoginHero />
      <Card className="w-full max-w-[495px] border-t-4 border-t-gold bg-card/90 shadow-2xl backdrop-blur-sm [--card-spacing:--spacing(7)] sm:[--card-spacing:--spacing(9)]">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t('auth.login.title')}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground sm:text-base">
            {t('auth.login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
