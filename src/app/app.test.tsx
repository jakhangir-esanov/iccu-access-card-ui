import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should render without errors when the router is created', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
