import { describe, it, expect } from 'vitest';
import { createAuthStrategy } from '@/auth';

describe('auth strategies', () => {
  it('creates bearer auth', () => {
    const auth = createAuthStrategy({ token: 'secret123' }, 'bearer');
    const result = auth.apply('ws://localhost:8000');
    expect(result.headers?.Authorization).toBe('Bearer secret123');
    expect(auth.maskCredentials()).toContain('****');
    expect(auth.maskCredentials()).not.toContain('secret123');
  });

  it('creates query param auth', () => {
    const auth = createAuthStrategy({ queryParams: { token: 'abc' } }, 'query');
    const result = auth.apply('ws://localhost:8000/ws');
    expect(result.url).toContain('token=abc');
  });

  it('creates none auth', () => {
    const auth = createAuthStrategy({}, 'none');
    const result = auth.apply('ws://localhost:8000');
    expect(result.url).toBe('ws://localhost:8000');
  });
});