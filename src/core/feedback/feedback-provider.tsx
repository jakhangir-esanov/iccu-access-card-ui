import type { ReactNode } from 'react';
import { Toaster } from '@shared/ui/sonner';
import { ConfirmProvider } from './confirm-provider';

export function FeedbackProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ConfirmProvider>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </ConfirmProvider>
  );
}
