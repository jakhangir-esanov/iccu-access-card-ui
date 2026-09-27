import { CalendarDaysIcon } from 'lucide-react';
import { useState, type Ref } from 'react';
import { enGB, ru, uz } from 'react-day-picker/locale';
import { formatDateOnly } from '@core/i18n/date-format';
import type { Locale } from '@core/i18n/locale';
import { useLocale, useT } from '@core/i18n/use-i18n';
import { Calendar } from '@shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover';
import { fromLocalDate, toLocalDate } from '@shared/utils/date-only';
import { cn } from 'cn';

const CALENDAR_LOCALES = { uz, ru, en: enGB } as const satisfies Record<Locale, unknown>;
const DEFAULT_FIRST_YEAR = 2020;

const TRIGGER_CLASS =
  'flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 text-left text-[0.9375rem] tabular-nums transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[state=open]:border-ring dark:bg-input/30';

interface DatePickerProps {
  readonly id: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBlur?: () => void;
  readonly min?: string | undefined;
  readonly max?: string | undefined;
  readonly invalid?: boolean;
  readonly disabled?: boolean;
  readonly newestYearFirst?: boolean;
  readonly ref?: Ref<HTMLButtonElement>;
}

export function DatePicker({
  id,
  value,
  onChange,
  onBlur,
  min,
  max,
  invalid = false,
  disabled = false,
  newestYearFirst = false,
  ref,
}: DatePickerProps) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [today] = useState(() => new Date());
  const selected = toLocalDate(value);
  const first =
    (min === undefined ? undefined : toLocalDate(min)) ?? new Date(DEFAULT_FIRST_YEAR, 0);
  const last = (max === undefined ? undefined : toLocalDate(max)) ?? today;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          onBlur?.();
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          ref={ref}
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={invalid}
          className={TRIGGER_CLASS}
        >
          <span className={cn('truncate', selected === undefined && 'text-muted-foreground')}>
            {selected === undefined ? t('common.pickDate') : formatDateOnly(value)}
          </span>
          <CalendarDaysIcon className="size-4.5 shrink-0 text-gold-ink" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <Calendar
          mode="single"
          autoFocus
          captionLayout="dropdown"
          locale={CALENDAR_LOCALES[locale]}
          selected={selected}
          defaultMonth={selected ?? last}
          startMonth={first}
          endMonth={last}
          reverseYears={newestYearFirst}
          disabled={[{ before: first }, { after: last }]}
          onSelect={(date) => {
            onChange(date === undefined ? '' : fromLocalDate(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
