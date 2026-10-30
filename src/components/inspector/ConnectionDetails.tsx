import React from 'react';
import { formatDuration } from '@/utils';
import type { Client } from '@/types';

interface ConnectionDetailsProps {
  client: Client;
}

export const ConnectionDetails: React.FC<ConnectionDetailsProps> = ({ client }) => {
  const duration = client.connectedAt ? Date.now() - client.connectedAt : 0;

  return (
    <div className="p-3 space-y-2 text-xs">
      <h3 className="text-sm font-semibold text-slate-200">Connection Details</h3>
      <div className="space-y-1 text-slate-400">
        <div><span className="text-slate-500">URL:</span> {client.endpoint || '—'}</div>
        <div><span className="text-slate-500">State:</span> {client.connectionState}</div>
        <div><span className="text-slate-500">Auth:</span> {client.authMethod}</div>
        <div><span className="text-slate-500">Duration:</span> {formatDuration(duration)}</div>
        {client.lastError && <div className="text-red-400"><span className="text-slate-500">Error:</span> {client.lastError}</div>}
      </div>
    </div>
  );
};