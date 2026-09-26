import { describe, expect, it } from 'vitest';
import { MenuGroup, menuFor, menuSectionsFor } from './admin-menu';

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

describe('menuSectionsFor', () => {
  it('should group items in menu order when the user is an admin', () => {
    const sections = menuSectionsFor(true);

    expect(sections.map((section) => section.group)).toEqual([
      MenuGroup.main,
      MenuGroup.management,
    ]);
    expect(sections[1]?.items.map((item) => item.label)).toEqual(['nav.reports', 'nav.users']);
  });

  it('should leave admin-only items out of their section when the user is a receptionist', () => {
    const management = menuSectionsFor(false).find(
      (section) => section.group === MenuGroup.management,
    );

    expect(management?.items.map((item) => item.label)).toEqual(['nav.reports']);
  });
});
