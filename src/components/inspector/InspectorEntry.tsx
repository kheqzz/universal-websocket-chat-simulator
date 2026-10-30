import React from 'react';
import { JsonViewer } from '../shared/JsonViewer';
import type { InspectorEntry } from '@/types';
import { formatTimestamp } from '@/utils';
import { Copy } from 'lucide-react';

const eventTypeColors: Record<string, string> = {
  connect: 'bg-green-600',
  'message-in': 'bg-blue-600',
  'message-out': 'bg-purple-600',
  disconnect: 'bg-slate-600',
  error: 'bg-red-600',
  reconnect: 'bg-yellow-600',
};

interface InspectorEntryProps {
  entry: InspectorEntry;
  clientAlias: string;
}

export const InspectorEntryComponent: React.FC<InspectorEntryProps> = ({ entry, clientAlias }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(entry.payload, null, 2));
  };

  return (
    <div className="border-b border-slate-700/50 py-2 px-3 hover:bg-slate-800/50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <span className="text-[10px] text-slate-500">{formatTimestamp(entry.timestamp)}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${eventTypeColors[entry.eventType] || 'bg-slate-600'}`}>
          {entry.eventType}
        </span>
        <span className="text-xs text-slate-400 truncate">{clientAlias}</span>
        <span className="text-xs text-slate-300 truncate flex-1">{entry.summary}</span>
      </div>
      {expanded && entry.payload !== undefined && (
        <div className="mt-2 ml-4">
          <JsonViewer data={entry.payload} />
          <button onClick={handleCopy} className="mt-1 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
            <Copy size={10} /> Copy
          </button>
        </div>
      )}
    </div>
  );
};