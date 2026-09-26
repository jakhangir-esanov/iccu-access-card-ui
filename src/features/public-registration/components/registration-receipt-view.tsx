import { CircleCheckIcon } from 'lucide-react';
import { formatDateTime } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import type { RegistrationReceipt } from '../models/registration-receipt';

interface RegistrationReceiptViewProps {
  readonly receipt: RegistrationReceipt;
  readonly onRestart: () => void;
}

export function RegistrationReceiptView({ receipt, onRestart }: RegistrationReceiptViewProps) {
  const t = useT();
  return (
    <Card className="border-t-4 border-t-gold">
      <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
        <CircleCheckIcon className="size-12 text-turquoise" aria-hidden />
        <h1 className="font-display text-3xl leading-tight font-semibold">
          {t('publicRegistration.successTitle')}
        </h1>
        <div className="grid gap-1">
          <span className="text-sm text-muted-foreground">{t('publicRegistration.codeLabel')}</span>
          <output
            aria-live="polite"
            className="font-mono text-7xl font-bold tracking-[0.2em] text-primary tabular-nums"
          >
            {receipt.code}
          </output>
        </div>
        <p className="text-lg font-medium">{t('publicRegistration.codeHint')}</p>
        <p className="text-sm text-muted-foreground">
          {t('publicRegistration.validUntil', { time: formatDateTime(receipt.expiresAt) })}
        </p>
        <Button variant="outline" onClick={onRestart}>
          {t('publicRegistration.newForm')}
        </Button>
      </CardContent>
    </Card>
  );
}
