import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Client } from '@/types';
import { ConnectionBadge } from './ConnectionBadge';

interface ClientItemProps {
  client: Client;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const ClientItem: React.FC<ClientItemProps> = ({ client, isSelected, onSelect, onRemove }) => {
  const duration = client.connectedAt ? Date.now() - client.connectedAt : 0;
  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-600/20 border border-blue-500/50' : 'hover:bg-slate-700/50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-200 truncate">{client.alias}</div>
        <div className="text-xs text-slate-400 truncate">{client.identity.username || client.identity.userId || 'No identity'}</div>
        <ConnectionBadge state={client.connectionState} duration={duration} />
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};