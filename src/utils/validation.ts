export function validateWsUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
      return { valid: false, error: 'URL must use ws:// or wss:// scheme' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

export function validateJson(input: string): { valid: boolean; value?: unknown; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Input is required' };
  }
  try {
    const value = JSON.parse(input);
    return { valid: true, value };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function validateAlias(alias: string, existing: string[] = []): { valid: boolean; error?: string } {
  if (!alias || typeof alias !== 'string') {
    return { valid: false, error: 'Alias is required' };
  }
  if (alias.length < 1 || alias.length > 30) {
    return { valid: false, error: 'Alias must be 1-30 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
    return { valid: false, error: 'Alias must be alphanumeric, hyphens, or underscores' };
  }
  if (existing.includes(alias)) {
    return { valid: false, error: 'Alias must be unique' };
  }
  return { valid: true };
}

export function validateRange(value: number, min: number, max: number): { valid: boolean; error?: string } {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: 'Value must be a number' };
  }
  if (value < min || value > max) {
    return { valid: false, error: `Value must be between ${min} and ${max}` };
  }
  return { valid: true };
}