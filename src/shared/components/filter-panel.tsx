import type { ReactNode } from 'react';
import { cn } from 'cn';

interface FilterPanelProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function FilterPanel({ children, className }: FilterPanelProps) {
  return (
    <div className={cn('grid gap-4 rounded-2xl border bg-card p-5', className)}>{children}</div>
  );
}
