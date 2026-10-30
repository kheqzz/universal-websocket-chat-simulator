import React from 'react';

interface ConversationSelectorProps {
  conversations: string[];
  selected: string;
  onSelect: (conv: string) => void;
}

export const ConversationSelector: React.FC<ConversationSelectorProps> = ({ conversations, selected, onSelect }) => {
  return (
    <div className="px-3 py-2 border-b border-slate-700">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-2 py-1 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="all">All Conversations</option>
        <option value="default">Default / Uncategorized</option>
        {conversations.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};