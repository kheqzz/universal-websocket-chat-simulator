import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { RestClient } from '@/services';
import { Button } from '../shared/Button';
import { JsonViewer } from '../shared/JsonViewer';
import type { RestEndpoint } from '@/types';

export const RestConfig: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const restEndpoints = useAppStore((s) => s.restEndpoints);
  const setRestEndpoints = useAppStore((s) => s.setRestEndpoints);
  const [name, setName] = useState('');
  const [method, setMethod] = useState<RestEndpoint['method']>('GET');
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState<unknown>(null);

  const handleAdd = () => {
    if (!name.trim() || !url.trim()) return;
    const endpoint: RestEndpoint = {
      id: crypto.randomUUID(),
      name: name.trim(),
      method,
      url: url.trim(),
      autoTrigger: 'manual',
    };
    setRestEndpoints([...restEndpoints, endpoint]);
    setName('');
    setUrl('');
  };

  const handleExecute = async (ep: RestEndpoint) => {
    const client = new RestClient();
    const result = await client.execute(ep, {});
    setResponse(result);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-slate-200">REST Endpoints</h3>

      <div className="space-y-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200" />
        <div className="flex gap-2">
          <select value={method} onChange={(e) => setMethod(e.target.value as RestEndpoint['method'])} className="px-2 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200">
            <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
          </select>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className="flex-1 px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200" />
        </div>
        <Button onClick={handleAdd} className="w-full">Add Endpoint</Button>
      </div>

      <div className="space-y-2">
        {restEndpoints.map((ep) => (
          <div key={ep.id} className="flex items-center justify-between bg-slate-800 rounded px-2 py-1">
            <span className="text-xs text-slate-300">{ep.method} {ep.name}</span>
            <Button size="sm" variant="secondary" onClick={() => handleExecute(ep)}>Run</Button>
          </div>
        ))}
      </div>

      {response !== null && <JsonViewer data={response} />}

      <Button onClick={onClose} variant="ghost" className="w-full">Close</Button>
    </div>
  );
};