import type { ChatMessage } from './message';

export interface ProtocolMapping {
  sender?: string;
  recipient?: string;
  conversationId?: string;
  content?: string;
  messageId?: string;
  timestamp?: string;
  eventType?: string;
}

export interface ProtocolProfile {
  name: string;
  description?: string;
  mappings: ProtocolMapping;
  eventNames?: Record<string, string>;
}

export interface ProtocolAdapter {
  toBackend(input: ChatMessage): unknown;
  fromBackend(raw: unknown): ChatMessage | null;
  getEventName(type: string): string;
}