import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  applyThemeClass,
  isTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  THEME_STORAGE_KEY,
} from './theme';

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('validates theme values', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('system')).toBe(true);
    expect(isTheme('invalid')).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(123)).toBe(false);
  });

  it('reads stored theme with fallback to system', () => {
    expect(readStoredTheme()).toBe('system');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(readStoredTheme()).toBe('dark');
    localStorage.setItem(THEME_STORAGE_KEY, 'garbage');
    expect(readStoredTheme()).toBe('system');
  });

  it('stores theme to localStorage', () => {
    expect(storeTheme('dark')).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('resolves system theme based on preference', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('applies dark theme class and style to documentElement', () => {
    applyThemeClass('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');

    applyThemeClass('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});
