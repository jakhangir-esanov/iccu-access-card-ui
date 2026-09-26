import { useMemo } from 'react';
import { toast } from 'sonner';
import type { TranslationParams } from '@core/i18n/translate';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import { useErrorMessage } from './use-message';

type NotifyByKey = (key: TranslationKey, params?: TranslationParams) => void;

export interface Notify {
  readonly success: NotifyByKey;
  readonly info: NotifyByKey;
  readonly warning: NotifyByKey;
  readonly error: NotifyByKey;
  readonly failure: (error: unknown) => void;
}

export function useNotify(): Notify {
  const t = useT();
  const errorMessage = useErrorMessage();
  return useMemo(
    () => ({
      success: (key, params) => toast.success(t(key, params)),
      info: (key, params) => toast.info(t(key, params)),
      warning: (key, params) => toast.warning(t(key, params)),
      error: (key, params) => toast.error(t(key, params)),
      failure: (error) => toast.error(errorMessage(error)),
    }),
    [t, errorMessage],
  );
}
