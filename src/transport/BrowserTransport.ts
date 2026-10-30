import type { Transport, TransportConfig, ConnectionState } from '@/types';

export class BrowserTransport implements Transport {
  private ws: WebSocket | null = null;
  private state: ConnectionState = 'disconnected';
  private messageHandlers = new Set<(data: unknown) => void>();
  private closeHandlers = new Set<(code: number, reason: string) => void>();
  private errorHandlers = new Set<(error: Error) => void>();
  private openHandlers = new Set<() => void>();

  async connect(config: TransportConfig): Promise<void> {
    this.state = 'connecting';
    const url = new URL(config.url);
    if (config.queryParams) {
      Object.entries(config.queryParams).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.ws?.close();
        this.state = 'error';
        reject(new Error('Connection timeout'));
      }, config.timeout * 1000);

      try {
        this.ws = new WebSocket(url.toString(), config.protocols);
      } catch (e) {
        clearTimeout(timeout);
        this.state = 'error';
        reject(e instanceof Error ? e : new Error('Failed to create WebSocket'));
        return;
      }

      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.state = 'connected';
        this.openHandlers.forEach((h) => h());
        resolve();
      };
      this.ws.onmessage = (e) => {
        let data: unknown;
        try {
          data = JSON.parse(e.data);
        } catch {
          data = e.data;
        }
        this.messageHandlers.forEach((h) => h(data));
      };
      this.ws.onclose = (e) => {
        this.state = 'disconnected';
        this.closeHandlers.forEach((h) => h(e.code, e.reason));
      };
      this.ws.onerror = () => {
        this.state = 'error';
        this.errorHandlers.forEach((h) => h(new Error('WebSocket error')));
      };
    });
  }

  send(data: string | object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }

  disconnect(code = 1000, reason = ''): void {
    this.ws?.close(code, reason);
    this.ws = null;
    this.state = 'disconnected';
  }

  getState(): ConnectionState {
    return this.state;
  }

  onMessage(cb: (data: unknown) => void): () => void {
    this.messageHandlers.add(cb);
    return () => this.messageHandlers.delete(cb);
  }

  onClose(cb: (code: number, reason: string) => void): () => void {
    this.closeHandlers.add(cb);
    return () => this.closeHandlers.delete(cb);
  }

  onError(cb: (error: Error) => void): () => void {
    this.errorHandlers.add(cb);
    return () => this.errorHandlers.delete(cb);
  }

  onOpen(cb: () => void): () => void {
    this.openHandlers.add(cb);
    return () => this.openHandlers.delete(cb);
  }
}