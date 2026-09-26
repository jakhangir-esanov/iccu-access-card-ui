import { ChevronDownIcon, GlobeIcon } from 'lucide-react';
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
        <Button variant="outline" className="rounded-full px-4">
          <GlobeIcon aria-hidden />
          <span className="sr-only">{t('layout.language')}:</span>
          {t(`locale.${locale}`)}
          <ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-44">
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
