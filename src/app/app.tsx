import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { FeedbackProvider } from '@core/feedback/feedback-provider';
import { I18nProvider } from '@core/i18n/i18n-provider';
import { ThemeProvider } from '@core/theme/theme-provider';
import { queryClient } from './query-client';
import { router } from './router';

export function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <FeedbackProvider>
            <RouterProvider router={router} />
          </FeedbackProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
