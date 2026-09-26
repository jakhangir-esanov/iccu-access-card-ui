import { useT } from '@core/i18n/use-i18n';
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@shared/ui/dropdown-menu';
import { THEMES, isTheme } from './theme';
import { ThemeIcon } from './theme-icon';
import { useTheme } from './use-theme';

const SEGMENT_CLASS =
  'flex-col justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-muted-foreground data-[state=checked]:bg-card data-[state=checked]:text-foreground data-[state=checked]:shadow-sm [&>[data-slot=dropdown-menu-radio-item-indicator]]:hidden';

export function ThemeMenuGroup() {
  const t = useT();
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenuRadioGroup
      aria-label={t('theme.title')}
      className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
      value={theme}
      onValueChange={(value) => {
        if (isTheme(value)) {
          setTheme(value);
        }
      }}
    >
      {THEMES.map((option) => (
        <DropdownMenuRadioItem
          key={option}
          value={option}
          className={SEGMENT_CLASS}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <ThemeIcon theme={option} />
          {t(`theme.short.${option}`)}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
