import { useCallback } from 'react';
import { useLocale, useT } from '@core/i18n/use-i18n';
import { describeError, resolveMessage, type MessageSource } from './error-message';

export function useMessage(): (source: MessageSource) => string {
  const t = useT();
  const { locale } = useLocale();
  return useCallback((source) => resolveMessage(source, t, locale), [t, locale]);
}

export function useErrorMessage(): (error: unknown) => string {
  const message = useMessage();
  return useCallback((error) => message(describeError(error)), [message]);
}
