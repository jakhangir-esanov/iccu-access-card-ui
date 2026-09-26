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
    <section className="grid gap-5 rounded-xl border border-t-4 border-t-gold bg-card p-4 shadow-sm sm:p-6 [&_[data-slot=input]]:h-10 [&_[data-slot=native-select]]:h-10">
      <header className="grid gap-1">
        <h1 className="text-xl font-semibold">{t('publicRegistration.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('publicRegistration.subtitle')}</p>
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
