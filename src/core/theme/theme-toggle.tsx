import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';
import { THEMES, isTheme, type Theme } from './theme';
import { useTheme } from './use-theme';

function ThemeIcon({ theme }: Readonly<{ theme: Theme }>) {
  if (theme === 'dark') {
    return <MoonIcon aria-hidden />;
  }
  if (theme === 'light') {
    return <SunIcon aria-hidden />;
  }
  return <MonitorIcon aria-hidden />;
}

export function ThemeToggle() {
  const t = useT();
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t('theme.title')}>
          {resolvedTheme === 'dark' ? <MoonIcon aria-hidden /> : <SunIcon aria-hidden />}
          <span className="sr-only">{t('theme.title')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('theme.title')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            if (isTheme(value)) {
              setTheme(value);
            }
          }}
        >
          {THEMES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              <ThemeIcon theme={option} />
              <span>{t(`theme.${option}`)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
