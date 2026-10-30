import { describe, it, expect } from 'vitest';
import { validateWsUrl, validateJson, validateAlias, validateRange } from '@/utils/validation';
import { getNestedValue, setNestedValue } from '@/utils/jsonPath';

describe('validation', () => {
  it('validates ws URLs', () => {
    expect(validateWsUrl('ws://localhost:8000/ws').valid).toBe(true);
    expect(validateWsUrl('wss://example.com/ws').valid).toBe(true);
    expect(validateWsUrl('http://example.com').valid).toBe(false);
    expect(validateWsUrl('').valid).toBe(false);
  });

  it('validates JSON', () => {
    expect(validateJson('{"a":1}').valid).toBe(true);
    expect(validateJson('invalid').valid).toBe(false);
  });

  it('validates alias', () => {
    expect(validateAlias('client1').valid).toBe(true);
    expect(validateAlias('').valid).toBe(false);
    expect(validateAlias('a'.repeat(31)).valid).toBe(false);
    expect(validateAlias('client1', ['client1']).valid).toBe(false);
  });

  it('validates range', () => {
    expect(validateRange(5, 1, 10).valid).toBe(true);
    expect(validateRange(0, 1, 10).valid).toBe(false);
  });
});

describe('jsonPath', () => {
  it('gets nested values', () => {
    const obj = { data: { message: { content: 'hello' } } };
    expect(getNestedValue(obj, 'data.message.content')).toBe('hello');
    expect(getNestedValue(obj, 'data.missing')).toBeUndefined();
  });

  it('sets nested values', () => {
    const obj: Record<string, unknown> = {};
    setNestedValue(obj, 'data.message.content', 'hello');
    expect(getNestedValue(obj, 'data.message.content')).toBe('hello');
  });
});