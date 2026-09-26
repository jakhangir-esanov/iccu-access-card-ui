import { describe, expect, it } from 'vitest';
import { readReturnPath, toReturnState } from './return-path';

describe('readReturnPath', () => {
  it('should return the saved admin path when the state has one', () => {
    expect(readReturnPath(toReturnState('/admin/readers', '?search=ali'))).toBe(
      '/admin/readers?search=ali',
    );
  });

  it.each([null, undefined, 'text', {}, { from: 42 }])(
    'should fall back to /admin when the state is %j',
    (state) => {
      expect(readReturnPath(state)).toBe('/admin');
    },
  );

  it('should not return outside the admin zone when the saved path is foreign', () => {
    expect(readReturnPath({ from: 'https://evil.example/admin' })).toBe('/admin');
  });

  it('should not return to the login page when it was saved', () => {
    expect(readReturnPath({ from: '/admin/login' })).toBe('/admin');
  });
});
