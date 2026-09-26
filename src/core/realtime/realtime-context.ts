import type { HubConnection } from '@microsoft/signalr';
import { createContext } from 'react';

export type RealtimeStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export interface RealtimeContextValue {
  readonly connection: HubConnection | null;
  readonly status: RealtimeStatus;
}

export const RealtimeContext = createContext<RealtimeContextValue>({
  connection: null,
  status: 'disconnected',
});
