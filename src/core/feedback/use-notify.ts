import { useMemo } from 'react';
import { toast, type ExternalToast } from 'sonner';
import type { Translate, TranslationParams } from '@core/i18n/translate';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import { useErrorMessage } from './use-message';

export interface NotifyAction {
  readonly label: TranslationKey;
  readonly onClick: () => void;
}

type NotifyByKey = (key: TranslationKey, params?: TranslationParams, action?: NotifyAction) => void;

export interface Notify {
  readonly success: NotifyByKey;
  readonly info: NotifyByKey;
  readonly warning: NotifyByKey;
  readonly error: NotifyByKey;
  readonly failure: (error: unknown) => void;
}

function toastOptions(t: Translate, action: NotifyAction | undefined): ExternalToast {
  if (action === undefined) {
    return {};
  }
  return { action: { label: t(action.label), onClick: action.onClick } };
}

export function useNotify(): Notify {
  const t = useT();
  const errorMessage = useErrorMessage();
  return useMemo(
    () => ({
      success: (key, params, action) => toast.success(t(key, params), toastOptions(t, action)),
      info: (key, params, action) => toast.info(t(key, params), toastOptions(t, action)),
      warning: (key, params, action) => toast.warning(t(key, params), toastOptions(t, action)),
      error: (key, params, action) => toast.error(t(key, params), toastOptions(t, action)),
      failure: (error) => toast.error(errorMessage(error)),
    }),
    [t, errorMessage],
  );
}
