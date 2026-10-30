import React, { useState } from 'react';
import { useProtocol } from '@/hooks/useProtocol';
import { JsonViewer } from '../shared/JsonViewer';
import { Button } from '../shared/Button';
import { validateJson } from '@/utils';
import type { ProtocolProfile } from '@/types';

const INTERNAL_FIELDS = ['sender', 'recipient', 'conversationId', 'content', 'messageId', 'timestamp', 'eventType'];

export const ProtocolEditor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { profiles, addProfile, deleteProfile } = useProtocol();
  const [name, setName] = useState('');
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [sampleJson, setSampleJson] = useState('');
  const [parsedResult, setParsedResult] = useState<unknown>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    const profile: ProtocolProfile = {
      name: name.trim(),
      mappings: mappings as ProtocolProfile['mappings'],
    };
    addProfile(profile);
    setName('');
    setMappings({});
  };

  const handleTestParse = () => {
    const check = validateJson(sampleJson);
    if (!check.valid) {
      setParsedResult({ error: check.error });
      return;
    }
    const result: Record<string, unknown> = {};
    for (const field of INTERNAL_FIELDS) {
      const path = mappings[field];
      if (path) {
        const parts = path.split('.');
        let val: unknown = check.value;
        for (const p of parts) {
          if (val && typeof val === 'object') val = (val as Record<string, unknown>)[p];
          else { val = undefined; break; }
        }
        result[field] = val;
      }
    }
    setParsedResult(result);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-slate-200">Protocol Profile Editor</h3>

      <div className="space-y-2">
        <label className="text-xs text-slate-400">Profile Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200"
          placeholder="my-protocol"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-slate-400">Field Mappings (internal → backend field name)</label>
        {INTERNAL_FIELDS.map((field) => (
          <div key={field} className="flex items-center gap-2">
            <span className="text-xs text-slate-300 w-28">{field}</span>
            <input
              value={mappings[field] || ''}
              onChange={(e) => setMappings({ ...mappings, [field]: e.target.value })}
              className="flex-1 px-2 py-1 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200"
              placeholder={`e.g., data.${field}`}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full">Save Profile</Button>

      <div className="space-y-2">
        <label className="text-xs text-slate-400">Test Parse</label>
        <textarea
          value={sampleJson}
          onChange={(e) => setSampleJson(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-600 rounded text-slate-200 font-mono"
          rows={4}
          placeholder='{"data": {"sender": "alice", "content": "hello"}}'
        />
        <Button onClick={handleTestParse} variant="secondary" className="w-full">Test Parse</Button>
        {parsedResult !== null && <JsonViewer data={parsedResult} />}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-slate-400">Saved Profiles</label>
        {Object.keys(profiles).length === 0 && <div className="text-xs text-slate-500">No profiles saved.</div>}
        {Object.keys(profiles).map((name) => (
          <div key={name} className="flex items-center justify-between bg-slate-800 rounded px-2 py-1">
            <span className="text-xs text-slate-300">{name}</span>
            <button onClick={() => deleteProfile(name)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
          </div>
        ))}
      </div>

      <Button onClick={onClose} variant="ghost" className="w-full">Close</Button>
    </div>
  );
};