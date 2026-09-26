import { useNavigate } from 'react-router';
import { AppPath } from '@core/config/app-paths';
import { useNotify } from '@core/feedback/use-notify';
import { playChime } from './chime';
import { useRegistrationSubmitted } from './use-registration-submitted';

export function RegistrationAlerts() {
  const notify = useNotify();
  const navigate = useNavigate();

  useRegistrationSubmitted((notice) => {
    void playChime();
    notify.info(
      'realtime.submitted',
      { code: notice.code, name: notice.fullName },
      {
        label: 'realtime.open',
        onClick: () => {
          void navigate(`${AppPath.registrationRequests}/${notice.id}`);
        },
      },
    );
  });

  return null;
}
