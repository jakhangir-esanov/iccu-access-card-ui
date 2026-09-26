import { LanguagesIcon } from 'lucide-react';
import { LOCALES, isLocale } from '@core/i18n/locale';
import { useLocale, useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';

export function LocaleSwitcher() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <LanguagesIcon aria-hidden />
          <span className="sr-only">{t('layout.language')}:</span>
          {t(`locale.${locale}`)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('layout.language')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            if (isLocale(value)) {
              setLocale(value);
            }
          }}
        >
          {LOCALES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {t(`locale.${option}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
