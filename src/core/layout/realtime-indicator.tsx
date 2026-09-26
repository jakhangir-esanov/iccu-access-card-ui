import { useT } from '@core/i18n/use-i18n';
import type { RealtimeStatus } from '@core/realtime/realtime-context';
import { useRealtimeStatus } from '@core/realtime/use-registration-submitted';
import { cn } from 'cn';

const DOT_CLASSES: Readonly<Record<RealtimeStatus, string>> = {
  connected: 'bg-turquoise',
  connecting: 'bg-gold animate-pulse',
  reconnecting: 'bg-gold animate-pulse',
  disconnected: 'bg-destructive',
};

export function RealtimeIndicator() {
  const t = useT();
  const status = useRealtimeStatus();
  const label = t(status === 'connected' ? 'realtime.live' : 'realtime.offline');
  return (
    <span role="status" className="mr-auto flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn('size-2 rounded-full', DOT_CLASSES[status])} aria-hidden />
      {label}
    </span>
  );
}
