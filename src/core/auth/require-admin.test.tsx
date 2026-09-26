import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { RequireAdmin } from './require-admin';
import { useAuth, type Auth } from './use-auth';

vi.mock('./use-auth', () => ({ useAuth: vi.fn() }));

function renderUsersRoute(isAdmin: boolean) {
  vi.mocked(useAuth).mockReturnValue({ isAdmin } as Auth);
  render(
    <MemoryRouter initialEntries={['/admin/users']}>
      <Routes>
        <Route element={<RequireAdmin />}>
          <Route path="/admin/users" element={<p>users page</p>} />
        </Route>
        <Route path="/admin/forbidden" element={<p>forbidden page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAdmin', () => {
  it('should open the page when the user is an admin', () => {
    renderUsersRoute(true);

    expect(screen.getByText('users page')).toBeInTheDocument();
  });

  it('should send the user to the forbidden page when the user is a receptionist', () => {
    renderUsersRoute(false);

    expect(screen.getByText('forbidden page')).toBeInTheDocument();
    expect(screen.queryByText('users page')).not.toBeInTheDocument();
  });
});
