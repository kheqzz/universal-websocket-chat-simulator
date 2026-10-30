import React, { useRef, useEffect } from 'react';
import { useInspector } from '@/hooks/useInspector';
import { useAppStore } from '@/store';
import { InspectorEntryComponent } from './InspectorEntry';
import { FilterBar } from './FilterBar';

export const InspectorLog: React.FC = () => {
  const { filters, setFilters, clearLog, getFilteredEntries } = useInspector();
  const clients = useAppStore((s) => s.clients);
  const clientOrder = useAppStore((s) => s.clientOrder);
  const scrollRef = useRef<HTMLDivElement>(null);

  const entries = getFilteredEntries();
  const clientAliases = Object.fromEntries(
    Object.entries(clients).map(([id, c]) => [id, c.alias])
  );

  const handleClientToggle = (id: string) => {
    const current = filters.clients;
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    // If all selected, reset to empty (show all)
    setFilters({ clients: next.length === clientOrder.length ? [] : next });
  };

  const handleEventToggle = (type: string) => {
    const current = filters.eventTypes;
    const next = current.includes(type as never)
      ? current.filter((t) => t !== type)
      : [...current, type as never];
    setFilters({ eventTypes: next.length === 6 ? [] : next });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-slate-200">WebSocket Inspector</h2>
      </div>
      <FilterBar
        clients={clientOrder}
        clientAliases={clientAliases}
        selectedClients={filters.clients}
        selectedEvents={filters.eventTypes}
        onClientToggle={handleClientToggle}
        onEventToggle={handleEventToggle}
        onClear={clearLog}
      />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {entries.length === 0 && (
          <div className="text-xs text-slate-500 text-center py-4">No events logged.</div>
        )}
        {entries.map((entry) => (
          <InspectorEntryComponent
            key={entry.id}
            entry={entry}
            clientAlias={clients[entry.clientId]?.alias || entry.clientId.slice(0, 8)}
          />
        ))}
      </div>
    </div>
  );
};