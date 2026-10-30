import React, { useRef, useEffect, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAppStore } from '@/store';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { ConversationSelector } from './ConversationSelector';

interface ChatViewProps {
  clientId: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ clientId }) => {
  const { messages, conversations, sendMessage } = useMessages(clientId);
  const [selectedConv, setSelectedConv] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const client = useAppStore((s) => s.clients[clientId]);
  const isConnected = client?.connectionState === 'connected';

  const filteredMessages = selectedConv === 'all'
    ? messages
    : selectedConv === 'default'
      ? messages.filter((m) => !m.conversationId)
      : messages.filter((m) => m.conversationId === selectedConv);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 50);
  };

  const handleSend = (content: unknown) => {
    const convId = selectedConv === 'all' || selectedConv === 'default' ? undefined : selectedConv;
    sendMessage(content, convId, client?.protocolProfile);
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationSelector
        conversations={conversations}
        selected={selectedConv}
        onSelect={setSelectedConv}
      />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {filteredMessages.length === 0 && (
          <div className="text-sm text-slate-500 text-center py-8">No messages yet.</div>
        )}
        {filteredMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.direction === 'outgoing'} />
        ))}
      </div>
      <MessageComposer onSend={handleSend} disabled={!isConnected} />
    </div>
  );
};