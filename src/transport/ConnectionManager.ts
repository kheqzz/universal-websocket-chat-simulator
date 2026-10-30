import type { Transport, TransportConfig } from '@/types';

export interface ConnectionConfig {
  autoReconnect: boolean;
  reconnectInterval: number;
  reconnectMaxAttempts: number;
}

export class ConnectionManager {
  private transport: Transport;
  private config: ConnectionConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectedAt: number | null = null;

  constructor(transport: Transport, config: ConnectionConfig) {
    this.transport = transport;
    this.config = config;
  }

  async connect(transportConfig: TransportConfig): Promise<void> {
    try {
      await this.transport.connect(transportConfig);
      this.reconnectAttempts = 0;
      this.connectedAt = Date.now();
    } catch (err) {
      if (this.config.autoReconnect && this.reconnectAttempts < this.config.reconnectMaxAttempts) {
        this.reconnectAttempts++;
        this.scheduleReconnect(transportConfig);
      } else {
        throw err;
      }
    }
  }

  private scheduleReconnect(transportConfig: TransportConfig): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.transport.connect(transportConfig).then(() => {
        this.reconnectAttempts = 0;
        this.connectedAt = Date.now();
      }).catch(() => {
        if (this.config.autoReconnect && this.reconnectAttempts < this.config.reconnectMaxAttempts) {
          this.reconnectAttempts++;
          this.scheduleReconnect(transportConfig);
        }
      });
    }, this.config.reconnectInterval * 1000);
  }

  disconnect(code?: number, reason?: string): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.transport.disconnect(code, reason);
    this.connectedAt = null;
    this.reconnectAttempts = 0;
  }

  async reconnect(transportConfig: TransportConfig): Promise<void> {
    this.disconnect();
    await this.connect(transportConfig);
  }

  getDuration(): number {
    if (!this.connectedAt) return 0;
    return Date.now() - this.connectedAt;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  getTransport(): Transport {
    return this.transport;
  }
}