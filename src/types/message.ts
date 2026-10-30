export type MessageDirection = 'incoming' | 'outgoing';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  clientId: string;
  conversationId?: string;
  direction: MessageDirection;
  sender?: string;
  content: unknown;
  rawPayload: unknown;
  timestamp: number;
  status?: MessageStatus;
  protocolProfile?: string;
}