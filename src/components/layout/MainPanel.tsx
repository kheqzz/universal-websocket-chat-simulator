import React from 'react';
import { useAppStore } from '@/store';
import { ChatView } from '../chat/ChatView';
import { ClientConfig } from '../client/ClientConfig';

interface MainPanelProps {
  selectedClientId: string | null;
}

export const MainPanel: React.FC<MainPanelProps> = ({ selectedClientId }) => {
  const client = useAppStore((s) => (selectedClientId ? s.clients[selectedClientId] : null));
  const [showConfig, setShowConfig] = React.useState(false);

  if (!selectedClientId || !client) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Select or add a client to start.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200">{client.alias}</h2>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          {showConfig ? 'Chat' : 'Config'}
        </button>
      </div>
      <div className="flex-1 min-h-0">
        {showConfig ? <ClientConfig client={client} /> : <ChatView clientId={selectedClientId} />}
      </div>
    </div>
  );
};