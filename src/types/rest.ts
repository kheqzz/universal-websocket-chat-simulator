export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RestEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  bodyTemplate?: string;
  autoTrigger: 'none' | 'onConnect' | 'manual';
  lastResponse?: unknown;
}