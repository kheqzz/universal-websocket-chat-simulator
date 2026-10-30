import { useAppStore } from '@/store';
import { createAuthStrategy } from '@/auth';
import { createTransport, ConnectionManager } from '@/transport';

export function useConnection(clientId: string) {
  const client = useAppStore((s) => s.clients[clientId]);
  const setConnectionState = useAppStore((s) => s.setConnectionState);
  const setConnectedAt = useAppStore((s) => s.setConnectedAt);
  const setLastError = useAppStore((s) => s.setLastError);

  const connect = async () => {
    if (!client) return;
    setConnectionState(clientId, 'connecting');
    const auth = createAuthStrategy(client.authConfig, client.authMethod);
    const authResult = auth.apply(client.endpoint);
    const transport = createTransport(useAppStore.getState().platformMode);
    const cm = new ConnectionManager(transport, {
      autoReconnect: client.autoReconnect,
      reconnectInterval: client.reconnectInterval,
      reconnectMaxAttempts: client.reconnectMaxAttempts,
    });

    transport.onOpen(() => {
      setConnectionState(clientId, 'connected');
      setConnectedAt(clientId, Date.now());
    });

    transport.onClose((code, reason) => {
      setConnectionState(clientId, 'disconnected');
      setConnectedAt(clientId, null);
      useAppStore.getState().addEntry?.({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        clientId,
        eventType: 'disconnect',
        summary: `Disconnected (code: ${code})`,
        closeCode: code,
        closeReason: reason,
      });
    });

    transport.onError((err) => {
      setConnectionState(clientId, 'error');
      setLastError(clientId, err.message);
    });

    transport.onMessage((data) => {
      const profile = client.protocolProfile
        ? useAppStore.getState().getProfile(client.protocolProfile)
        : undefined;
      if (profile) {
        // Use protocol adapter to parse
      }
      // Log to inspector
      useAppStore.getState().addEntry({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        clientId,
        eventType: 'message-in',
        summary: 'Message received',
        payload: data,
      });
    });

    try {
      await cm.connect({
        url: authResult.url,
        protocols: authResult.protocols,
        headers: authResult.headers,
        queryParams: client.authMethod === 'query' ? client.authConfig.queryParams : undefined,
        timeout: client.connectionTimeout,
      });
    } catch (err) {
      setConnectionState(clientId, 'error');
      setLastError(clientId, err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const disconnect = () => {
    setConnectionState(clientId, 'disconnected');
    setConnectedAt(clientId, null);
  };

  const reconnect = async () => {
    disconnect();
    await connect();
  };

  return { client, connect, disconnect, reconnect };
}