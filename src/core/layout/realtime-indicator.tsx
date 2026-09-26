import { useT } from '@core/i18n/use-i18n';
import type { RealtimeStatus } from '@core/realtime/realtime-context';
import { useRealtimeStatus } from '@core/realtime/use-registration-submitted';
import { cn } from 'cn';

const DOT_CLASSES: Readonly<Record<RealtimeStatus, string>> = {
  connected: 'bg-turquoise ring-turquoise/20',
  connecting: 'bg-gold ring-gold/20 animate-pulse',
  reconnecting: 'bg-gold ring-gold/20 animate-pulse',
  disconnected: 'bg-destructive ring-destructive/20',
};

export function RealtimeIndicator() {
  const t = useT();
  const status = useRealtimeStatus();
  const label = t(status === 'connected' ? 'realtime.live' : 'realtime.offline');
  return (
    <span
      role="status"
      className="flex items-center gap-3 rounded-xl border border-sidebar-border px-4 py-3 text-[0.8125rem] font-semibold text-sidebar-foreground/85"
    >
      <span className={cn('size-2.5 rounded-full ring-4', DOT_CLASSES[status])} aria-hidden />
      {label}
    </span>
  );
}
