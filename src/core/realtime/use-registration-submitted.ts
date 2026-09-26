import { use, useEffect, useEffectEvent } from 'react';
import { RealtimeContext, type RealtimeStatus } from './realtime-context';
import {
  REGISTRATION_SUBMITTED_EVENT,
  toRegistrationSubmittedNotice,
  type RegistrationSubmittedNotice,
} from './registration-events';

export function useRegistrationSubmitted(
  handler: (notice: RegistrationSubmittedNotice) => void,
): void {
  const { connection } = use(RealtimeContext);
  const onNotice = useEffectEvent(handler);

  useEffect(() => {
    if (connection === null) {
      return;
    }
    const listener = (payload: unknown) => {
      const notice = toRegistrationSubmittedNotice(payload);
      if (notice !== null) {
        onNotice(notice);
      }
    };
    connection.on(REGISTRATION_SUBMITTED_EVENT, listener);
    return () => {
      connection.off(REGISTRATION_SUBMITTED_EVENT, listener);
    };
  }, [connection]);
}

export function useRealtimeStatus(): RealtimeStatus {
  return use(RealtimeContext).status;
}
