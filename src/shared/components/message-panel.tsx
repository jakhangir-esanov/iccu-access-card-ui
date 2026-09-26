import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface MessagePanelProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}

export function MessagePanel({ icon: Icon, title, description, action }: MessagePanelProps) {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
      <span className="mb-2 flex h-24 w-20 items-end justify-center rounded-[50%_50%_1rem_1rem/62%_62%_1rem_1rem] bg-gold-soft pb-5 text-gold-ink">
        <Icon className="size-9" aria-hidden />
      </span>
      <h1 className="font-display text-4xl leading-tight font-semibold">{title}</h1>
      <p className="text-base text-muted-foreground">{description}</p>
      {action}
    </section>
  );
}
