export type InspectorEventType = 'connect' | 'message-in' | 'message-out' | 'disconnect' | 'error' | 'reconnect';

export interface InspectorEntry {
  id: string;
  timestamp: number;
  clientId: string;
  eventType: InspectorEventType;
  summary: string;
  payload?: unknown;
  closeCode?: number;
  closeReason?: string;
}