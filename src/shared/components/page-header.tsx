import type { ReactNode } from 'react';

interface PageHeaderProps {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly leading?: ReactNode;
  readonly actions?: ReactNode;
}

export function PageHeader({ title, description, leading, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="grid min-w-0 gap-1.5">
          <h1 className="font-display text-4xl leading-tight font-semibold text-balance">
            {title}
          </h1>
          {description !== undefined && (
            <p className="text-[0.9375rem] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions !== undefined && (
        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">{actions}</div>
      )}
    </header>
  );
}
