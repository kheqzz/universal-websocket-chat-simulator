import type { ChatMessage } from '@/types';

export interface MessageSlice {
  messages: Record<string, ChatMessage[]>;
  conversations: Record<string, string[]>;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: (clientId?: string) => void;
  getMessagesByConversation: (clientId: string, conversationId?: string) => ChatMessage[];
}

const MAX_MESSAGES_PER_CLIENT = 10000;

export const createMessageSlice = (
  set: (fn: (state: MessageSlice) => Partial<MessageSlice>) => void,
  get: () => MessageSlice,
): MessageSlice => ({
  messages: {},
  conversations: {},
  addMessage: (msg) => {
    set((state) => {
      const clientMessages = state.messages[msg.clientId] || [];
      let updated = [...clientMessages, msg];
      if (updated.length > MAX_MESSAGES_PER_CLIENT) {
        updated = updated.slice(updated.length - MAX_MESSAGES_PER_CLIENT);
      }
      const convSet = new Set(state.conversations[msg.clientId] || []);
      if (msg.conversationId) convSet.add(msg.conversationId);
      return {
        messages: { ...state.messages, [msg.clientId]: updated },
        conversations: { ...state.conversations, [msg.clientId]: Array.from(convSet) },
      };
    });
  },
  clearMessages: (clientId) => {
    set((state) => {
      if (clientId) {
        const rest = { ...state.messages };
        delete rest[clientId];
        const restConv = { ...state.conversations };
        delete restConv[clientId];
        return { messages: rest, conversations: restConv };
      }
      return { messages: {}, conversations: {} };
    });
  },
  getMessagesByConversation: (clientId, conversationId) => {
    const msgs = get().messages[clientId] || [];
    if (!conversationId) return msgs;
    return msgs.filter((m) => m.conversationId === conversationId || (!m.conversationId && conversationId === 'default'));
  },
});