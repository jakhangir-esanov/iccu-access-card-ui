import { createContext } from 'react';
import type { TranslationParams } from '@core/i18n/translate';
import type { TranslationKey } from '@core/i18n/translations/dictionary';

export interface ConfirmOptions {
  readonly title?: TranslationKey;
  readonly description: TranslationKey;
  readonly params?: TranslationParams;
  readonly confirmLabel?: TranslationKey;
  readonly destructive?: boolean;
}

export type Confirm = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<Confirm | null>(null);
