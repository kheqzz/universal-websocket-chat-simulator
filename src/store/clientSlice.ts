import type { Client, ClientConfig, ConnectionState } from '@/types';

const VALID_TRANSITIONS: Record<ConnectionState, ConnectionState[]> = {
  disconnected: ['connecting'],
  connecting: ['connected', 'error'],
  connected: ['disconnected', 'reconnecting', 'error'],
  reconnecting: ['connected', 'error', 'disconnected'],
  error: ['connecting', 'disconnected'],
};

export function isValidTransition(from: ConnectionState, to: ConnectionState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export interface ClientSlice {
  clients: Record<string, Client>;
  clientOrder: string[];
  addClient: (config: ClientConfig) => string;
  updateClient: (id: string, updates: Partial<Client>) => void;
  removeClient: (id: string) => void;
  setConnectionState: (id: string, state: ConnectionState) => void;
  setConnectedAt: (id: string, timestamp: number | null) => void;
  setLastError: (id: string, error: string | null) => void;
}

export const createClientSlice = (
  set: (fn: (state: ClientSlice) => Partial<ClientSlice>) => void,
): ClientSlice => ({
  clients: {},
  clientOrder: [],
  addClient: (config) => {
    const id = crypto.randomUUID();
    set((state) => ({
      clients: {
        ...state.clients,
        [id]: { ...config, id, connectionState: 'disconnected', connectedAt: null, lastError: null },
      },
      clientOrder: [...state.clientOrder, id],
    }));
    return id;
  },
  updateClient: (id, updates) => {
    set((state) => {
      if (!state.clients[id]) return {};
      return {
        clients: { ...state.clients, [id]: { ...state.clients[id], ...updates } },
      };
    });
  },
  removeClient: (id) => {
    set((state) => {
      const rest = { ...state.clients };
      delete rest[id];
      return {
        clients: rest,
        clientOrder: state.clientOrder.filter((c) => c !== id),
      };
    });
  },
  setConnectionState: (id, newState) => {
    set((state) => {
      const client = state.clients[id];
      if (!client) return {};
      if (!isValidTransition(client.connectionState, newState)) return {};
      return {
        clients: { ...state.clients, [id]: { ...client, connectionState: newState } },
      };
    });
  },
  setConnectedAt: (id, timestamp) => {
    set((state) => {
      const client = state.clients[id];
      if (!client) return {};
      return { clients: { ...state.clients, [id]: { ...client, connectedAt: timestamp } } };
    });
  },
  setLastError: (id, error) => {
    set((state) => {
      const client = state.clients[id];
      if (!client) return {};
      return { clients: { ...state.clients, [id]: { ...client, lastError: error } } };
    });
  },
});