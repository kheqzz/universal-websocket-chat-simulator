import React from 'react';
import { formatTimestamp } from '@/utils';
import { JsonViewer } from '../shared/JsonViewer';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const isJson = typeof message.content === 'object' && message.content !== null;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[75%] rounded-lg px-3 py-2 ${isOwn ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
        {!isOwn && message.sender && (
          <div className="text-xs font-medium text-slate-400 mb-1">{message.sender}</div>
        )}
        {isJson ? (
          <JsonViewer data={message.content} />
        ) : (
          <div className="text-sm whitespace-pre-wrap break-words">{String(message.content ?? '')}</div>
        )}
        <div className={`text-[10px] mt-1 ${isOwn ? 'text-blue-200' : 'text-slate-500'}`}>
          {formatTimestamp(message.timestamp)}
          {message.status && ` · ${message.status}`}
        </div>
      </div>
    </div>
  );
};