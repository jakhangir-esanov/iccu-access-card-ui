import { useState } from 'react';
import { useT } from '@core/i18n/use-i18n';
import { RegistrationForm } from '../components/registration-form';
import { RegistrationReceiptView } from '../components/registration-receipt-view';
import type { RegistrationReceipt } from '../models/registration-receipt';

export function PublicRegistrationPage() {
  const t = useT();
  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null);

  if (receipt !== null) {
    return (
      <RegistrationReceiptView
        receipt={receipt}
        onRestart={() => {
          setReceipt(null);
        }}
      />
    );
  }

  return (
    <section className="grid gap-6 rounded-2xl border border-t-4 border-t-gold bg-card p-5 shadow-sm sm:p-7">
      <header className="grid gap-2">
        <h1 className="font-display text-3xl leading-tight font-semibold">
          {t('publicRegistration.title')}
        </h1>
        <p className="text-[0.9375rem] text-muted-foreground">{t('publicRegistration.subtitle')}</p>
      </header>
      <RegistrationForm
        onSubmitted={(submitted) => {
          setReceipt(submitted);
          window.scrollTo({ top: 0 });
        }}
      />
    </section>
  );
}
