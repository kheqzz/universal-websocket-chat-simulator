export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

export interface ClientIdentity {
  username: string;
  userId?: string;
  role?: string;
  metadata?: Record<string, unknown>;
}

export type AuthMethod = 'bearer' | 'headers' | 'cookie' | 'query' | 'subprotocol' | 'none';

export interface AuthConfig {
  token?: string;
  headers?: Record<string, string>;
  cookies?: string;
  queryParams?: Record<string, string>;
  subprotocol?: string;
}

export interface ClientConfig {
  alias: string;
  endpoint: string;
  identity: ClientIdentity;
  authMethod: AuthMethod;
  authConfig: AuthConfig;
  protocolProfile?: string;
  autoReconnect: boolean;
  reconnectInterval: number;
  reconnectMaxAttempts: number;
  connectionTimeout: number;
}

export interface Client extends ClientConfig {
  id: string;
  connectionState: ConnectionState;
  connectedAt: number | null;
  lastError: string | null;
}