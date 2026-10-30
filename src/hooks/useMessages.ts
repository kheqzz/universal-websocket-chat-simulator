import { useAppStore } from '@/store';
import type { ChatMessage } from '@/types';

export function useMessages(clientId: string) {
  const messages = useAppStore((s) => s.messages[clientId] || []);
  const conversations = useAppStore((s) => s.conversations[clientId] || []);
  const addMessage = useAppStore((s) => s.addMessage);

  const sendMessage = (content: unknown, conversationId?: string, protocolProfile?: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      clientId,
      direction: 'outgoing',
      content,
      rawPayload: content,
      timestamp: Date.now(),
      conversationId,
      protocolProfile,
      status: 'sent',
    };
    addMessage(msg);
    useAppStore.getState().addEntry({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      clientId,
      eventType: 'message-out',
      summary: 'Message sent',
      payload: content,
    });
    return msg;
  };

  return { messages, conversations, sendMessage };
}