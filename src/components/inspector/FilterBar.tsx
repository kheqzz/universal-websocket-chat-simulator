import React from 'react';
import type { InspectorEventType } from '@/types';

const EVENT_TYPES: InspectorEventType[] = ['connect', 'message-in', 'message-out', 'disconnect', 'error', 'reconnect'];

interface FilterBarProps {
  clients: string[];
  clientAliases: Record<string, string>;
  selectedClients: string[];
  selectedEvents: InspectorEventType[];
  onClientToggle: (id: string) => void;
  onEventToggle: (type: InspectorEventType) => void;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  clients, clientAliases, selectedClients, selectedEvents, onClientToggle, onEventToggle, onClear,
}) => {
  return (
    <div className="p-2 border-b border-slate-700 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Filters</span>
        <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-300">Clear logs</button>
      </div>
      <div className="flex flex-wrap gap-1">
        {clients.map((id) => (
          <button
            key={id}
            onClick={() => onClientToggle(id)}
            className={`text-[10px] px-2 py-0.5 rounded ${
              selectedClients.length === 0 || selectedClients.includes(id)
                ? 'bg-blue-600/30 text-blue-300'
                : 'bg-slate-700 text-slate-500'
            }`}
          >
            {clientAliases[id] || id.slice(0, 8)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onEventToggle(type)}
            className={`text-[10px] px-2 py-0.5 rounded ${
              selectedEvents.length === 0 || selectedEvents.includes(type)
                ? 'bg-slate-600 text-slate-200'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};