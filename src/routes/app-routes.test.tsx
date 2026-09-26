import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { authApi } from '@core/auth/auth.service';
import { FeedbackProvider } from '@core/feedback/feedback-provider';
import { ApiError, HttpErrorCode } from '@core/http/api-error';
import { I18nProvider } from '@core/i18n/i18n-provider';
import { createTestQueryClient } from '@test/render-with-providers';
import { appRoutes } from './app-routes';

vi.mock('@core/auth/auth.service', () => ({
  authApi: { login: vi.fn(), refresh: vi.fn(), logout: vi.fn() },
}));

function renderAt(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(
    <I18nProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <FeedbackProvider>
          <RouterProvider router={router} />
        </FeedbackProvider>
      </QueryClientProvider>
    </I18nProvider>,
  );
  return router;
}

describe('appRoutes', () => {
  it('should send an anonymous visitor to the login page and remember the target', async () => {
    vi.mocked(authApi.refresh).mockRejectedValue(
      new ApiError({ status: 401, code: HttpErrorCode.Unauthorized }),
    );

    const router = renderAt('/admin/password');

    expect(await screen.findByRole('button', { name: 'Kirish' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/admin/login');
    expect(router.state.location.state).toEqual({ from: '/admin/password' });
  });

  it('should show the not found page when the public path is unknown', async () => {
    renderAt('/no-such-page');

    expect(await screen.findByText('Sahifa topilmadi')).toBeInTheDocument();
  });
});
