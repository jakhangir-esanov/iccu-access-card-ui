import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  DayPicker,
  getDefaultClassNames,
  type ChevronProps,
  type DropdownProps,
} from 'react-day-picker';
import { cn } from 'cn';
import { buttonVariants } from '@shared/ui/button';
import { NativeSelect, NativeSelectOption } from '@shared/ui/native-select';

function CalendarChevron({ className, orientation }: ChevronProps) {
  if (orientation === 'left') {
    return <ChevronLeftIcon className={cn('size-4.5', className)} aria-hidden />;
  }
  if (orientation === 'right') {
    return <ChevronRightIcon className={cn('size-4.5', className)} aria-hidden />;
  }
  return <ChevronDownIcon className={cn('size-4', className)} aria-hidden />;
}

function CalendarDropdown({ options, value, onChange, disabled, ...props }: DropdownProps) {
  return (
    <NativeSelect
      size="sm"
      className="w-auto"
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={props['aria-label']}
    >
      {options?.map((option) => (
        <NativeSelectOption key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('w-fit select-none', className)}
      classNames={{
        root: cn('w-fit', defaults.root),
        months: cn('relative flex flex-col gap-4', defaults.months),
        month: cn('flex w-full flex-col gap-3', defaults.month),
        nav: cn('absolute inset-x-0 top-0 flex items-center justify-between', defaults.nav),
        button_previous: cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'aria-disabled:opacity-40',
          defaults.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'aria-disabled:opacity-40',
          defaults.button_next,
        ),
        month_caption: cn(
          'flex h-9 w-full items-center justify-center px-10',
          defaults.month_caption,
        ),
        dropdowns: cn('flex items-center justify-center gap-1.5', defaults.dropdowns),
        caption_label: cn('font-display text-xl font-semibold', defaults.caption_label),
        month_grid: cn('w-full border-collapse', defaults.month_grid),
        weekdays: cn('flex', defaults.weekdays),
        weekday: cn(
          'w-10 pb-1.5 text-[0.6875rem] font-bold tracking-[0.06em] text-muted-foreground uppercase',
          defaults.weekday,
        ),
        week: cn('mt-1 flex w-full', defaults.week),
        day: cn('relative size-10 p-0 text-center', defaults.day),
        day_button: cn(
          'flex size-10 items-center justify-center rounded-xl text-sm font-semibold tabular-nums transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
          defaults.day_button,
        ),
        selected: cn(
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:shadow-[inset_0_-2px_0_var(--color-gold)] [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
          defaults.selected,
        ),
        today: cn(
          'text-gold-ink [&>button]:ring-1 [&>button]:ring-gold [&>button]:ring-inset',
          defaults.today,
        ),
        outside: cn('text-muted-foreground/45', defaults.outside),
        disabled: cn('text-muted-foreground/35 [&>button]:pointer-events-none', defaults.disabled),
        hidden: cn('invisible', defaults.hidden),
        ...classNames,
      }}
      components={{ Chevron: CalendarChevron, Dropdown: CalendarDropdown, ...components }}
      {...props}
    />
  );
}

export { Calendar };
