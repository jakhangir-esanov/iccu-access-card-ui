import { HubConnectionBuilder, LogLevel, type HubConnection } from '@microsoft/signalr';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { sessionStore } from '@core/auth/session';
import { RealtimeContext, type RealtimeStatus } from './realtime-context';
import { REGISTRATIONS_HUB_URL } from './registration-events';

function createConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(REGISTRATIONS_HUB_URL, {
      accessTokenFactory: async () => (await sessionStore.freshAccessToken()) ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}

export function RealtimeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [status, setStatus] = useState<RealtimeStatus>('connecting');

  useEffect(() => {
    let active = true;
    const hub = createConnection();
    const update = (next: RealtimeStatus) => {
      if (active) {
        setStatus(next);
      }
    };
    hub.onreconnecting(() => {
      update('reconnecting');
    });
    hub.onreconnected(() => {
      update('connected');
    });
    hub.onclose(() => {
      update('disconnected');
    });
    hub.start().then(
      () => {
        if (active) {
          setConnection(hub);
          setStatus('connected');
        }
      },
      () => {
        update('disconnected');
      },
    );
    return () => {
      active = false;
      void hub.stop();
    };
  }, []);

  const value = useMemo(() => ({ connection, status }), [connection, status]);

  return <RealtimeContext value={value}>{children}</RealtimeContext>;
}
