import { describe, expect, it } from 'vitest';
import { menuFor } from './admin-menu';

const labelsOf = (isAdmin: boolean) => menuFor(isAdmin).map((item) => item.label);

describe('menuFor', () => {
  it('should hide admin-only items when the user is a receptionist', () => {
    expect(labelsOf(false)).not.toContain('nav.users');
    expect(labelsOf(false)).toContain('nav.readers');
  });

  it('should show every item when the user is an admin', () => {
    expect(labelsOf(true)).toContain('nav.users');
  });
});
