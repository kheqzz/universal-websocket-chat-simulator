import type { ConnectionState } from './client';

export interface TransportConfig {
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  timeout: number;
}

export interface Transport {
  connect(config: TransportConfig): Promise<void>;
  send(data: string | object): void;
  disconnect(code?: number, reason?: string): void;
  getState(): ConnectionState;
  onMessage(cb: (data: unknown) => void): () => void;
  onClose(cb: (code: number, reason: string) => void): () => void;
  onError(cb: (error: Error) => void): () => void;
  onOpen(cb: () => void): () => void;
}