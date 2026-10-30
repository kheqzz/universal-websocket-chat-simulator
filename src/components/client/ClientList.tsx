import React from 'react';
import { Plus } from 'lucide-react';
import { useClient } from '@/hooks/useClient';
import { ClientItem } from './ClientItem';

interface ClientListProps {
  selectedClientId: string | null;
  onSelectClient: (id: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ selectedClientId, onSelectClient }) => {
  const { clients, clientOrder, addClient, removeClient } = useClient();

  const handleAdd = () => {
    const alias = `Client ${clientOrder.length + 1}`;
    addClient({
      alias,
      endpoint: '',
      identity: { username: alias },
      authMethod: 'none',
      authConfig: {},
      autoReconnect: false,
      reconnectInterval: 5,
      reconnectMaxAttempts: 3,
      connectionTimeout: 10,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200">Clients</h2>
        <button onClick={handleAdd} className="p-1 text-slate-400 hover:text-blue-400 transition-colors">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {clientOrder.map((id) => {
          const client = clients[id];
          if (!client) return null;
          return (
            <ClientItem
              key={id}
              client={client}
              isSelected={selectedClientId === id}
              onSelect={() => onSelectClient(id)}
              onRemove={() => removeClient(id)}
            />
          );
        })}
        {clientOrder.length === 0 && (
          <div className="text-xs text-slate-500 text-center py-4">No clients. Click + to add.</div>
        )}
      </div>
    </div>
  );
};