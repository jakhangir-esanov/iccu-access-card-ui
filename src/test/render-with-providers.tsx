import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { FeedbackProvider } from '@core/feedback/feedback-provider';
import { I18nProvider } from '@core/i18n/i18n-provider';

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

export function renderWithProviders(ui: ReactElement, route = '/') {
  return render(
    <I18nProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <FeedbackProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </FeedbackProvider>
      </QueryClientProvider>
    </I18nProvider>,
  );
}
