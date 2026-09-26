import { cn } from 'cn';

const STAR_PATH =
  'M12 0 L15.5 3.5 H20.5 V8.5 L24 12 L20.5 15.5 V20.5 H15.5 L12 24 L8.5 20.5 H3.5 V15.5 L0 12 L3.5 8.5 V3.5 H8.5 Z';

export function KhatamStar({ className }: Readonly<{ className?: string }>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-3 shrink-0 fill-current', className)}>
      <path d={STAR_PATH} />
    </svg>
  );
}
