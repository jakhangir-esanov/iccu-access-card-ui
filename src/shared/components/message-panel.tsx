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
    <section className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <Icon className="size-12 text-gold" aria-hidden />
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {action}
    </section>
  );
}
