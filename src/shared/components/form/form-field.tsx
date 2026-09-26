import type { ReactNode } from 'react';
import { isTranslationKey } from '@core/i18n/translation-key';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import { Label } from '@shared/ui/label';

interface FormFieldProps {
  readonly id: string;
  readonly label: TranslationKey;
  readonly error?: string | undefined;
  readonly children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  const t = useT();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{t(label)}</Label>
      {children}
      {error !== undefined && error !== '' && (
        <p className="text-sm text-destructive">{isTranslationKey(error) ? t(error) : error}</p>
      )}
    </div>
  );
}
