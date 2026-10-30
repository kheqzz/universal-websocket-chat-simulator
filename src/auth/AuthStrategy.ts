import type { AuthStrategy, AuthConfig } from '@/types';

export class BearerTokenAuth implements AuthStrategy {
  constructor(private token: string) {}
  apply(url: string) {
    return { url, headers: { Authorization: `Bearer ${this.token}` } };
  }
  maskCredentials() {
    const tail = this.token.slice(-4);
    return `Bearer ****${tail}`;
  }
}

export class CustomHeadersAuth implements AuthStrategy {
  constructor(private headers: Record<string, string>) {}
  apply(url: string, existingHeaders?: Record<string, string>) {
    return { url, headers: { ...existingHeaders, ...this.headers } };
  }
  maskCredentials() {
    return Object.keys(this.headers).join(', ') + ': ****';
  }
}

export class CookieAuth implements AuthStrategy {
  constructor(private cookies: string) {}
  apply(url: string) {
    // Browser manages cookies; document that headers cannot be injected
    return { url };
  }
  maskCredentials() {
    return `Cookie: ****${this.cookies.slice(-4)}`;
  }
}

export class QueryParamAuth implements AuthStrategy {
  constructor(private params: Record<string, string>) {}
  apply(url: string) {
    const u = new URL(url);
    Object.entries(this.params).forEach(([k, v]) => u.searchParams.set(k, v));
    return { url: u.toString() };
  }
  maskCredentials() {
    return Object.keys(this.params).join(', ') + '=****';
  }
}

export class SubprotocolAuth implements AuthStrategy {
  constructor(private subprotocol: string) {}
  apply(url: string) {
    return { url, protocols: [this.subprotocol] };
  }
  maskCredentials() {
    return `Subprotocol: ${this.subprotocol}`;
  }
}

export class NoneAuth implements AuthStrategy {
  apply(url: string) {
    return { url };
  }
  maskCredentials() {
    return 'None';
  }
}

export function createAuthStrategy(config: AuthConfig, method: string): AuthStrategy {
  switch (method) {
    case 'bearer':
      return new BearerTokenAuth(config.token || '');
    case 'headers':
      return new CustomHeadersAuth(config.headers || {});
    case 'cookie':
      return new CookieAuth(config.cookies || '');
    case 'query':
      return new QueryParamAuth(config.queryParams || {});
    case 'subprotocol':
      return new SubprotocolAuth(config.subprotocol || '');
    case 'none':
    default:
      return new NoneAuth();
  }
}