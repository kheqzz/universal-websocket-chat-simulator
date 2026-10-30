import React from 'react';
import type { ConnectionState } from '@/types';

interface ConnectionBadgeProps {
  state: ConnectionState;
  duration?: number;
}

const stateColors: Record<ConnectionState, string> = {
  connected: 'bg-green-500',
  connecting: 'bg-yellow-500 animate-pulse',
  reconnecting: 'bg-yellow-500 animate-pulse',
  disconnected: 'bg-slate-500',
  error: 'bg-red-500',
};

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({ state, duration }) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${stateColors[state]}`} />
      <span className="text-xs text-slate-400 capitalize">{state}</span>
      {state === 'connected' && duration !== undefined && duration > 0 && (
        <span className="text-xs text-slate-500">{Math.floor(duration / 1000)}s</span>
      )}
    </div>
  );
};