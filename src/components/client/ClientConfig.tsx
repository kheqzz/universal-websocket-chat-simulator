import React, { useState } from 'react';
import { useClient } from '@/hooks/useClient';
import { useProtocol } from '@/hooks/useProtocol';
import { Input } from '../shared/Input';
import { MaskedInput } from '../shared/MaskedInput';
import { Button } from '../shared/Button';
import type { AuthMethod, Client } from '@/types';
import { validateWsUrl } from '@/utils';

interface ClientConfigProps {
  client: Client;
}

const AUTH_METHODS: AuthMethod[] = ['none', 'bearer', 'headers', 'cookie', 'query', 'subprotocol'];

export const ClientConfig: React.FC<ClientConfigProps> = ({ client }) => {
  const { updateClient } = useClient();
  const { profiles } = useProtocol();
  const [alias, setAlias] = useState(client.alias);
  const [endpoint, setEndpoint] = useState(client.endpoint);
  const [username, setUsername] = useState(client.identity.username);
  const [role, setRole] = useState(client.identity.role || '');
  const [authMethod, setAuthMethod] = useState<AuthMethod>(client.authMethod);
  const [token, setToken] = useState(client.authConfig.token || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    const urlCheck = validateWsUrl(endpoint);
    if (!urlCheck.valid) {
      setError(urlCheck.error || 'Invalid URL');
      return;
    }
    updateClient(client.id, {
      alias,
      endpoint,
      identity: { ...client.identity, username, role },
      authMethod,
      authConfig: { ...client.authConfig, token },
    });
    setError('');
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-slate-200">Client Configuration</h3>

      <Input label="Alias" value={alias} onChange={(e) => setAlias(e.target.value)} />
      <Input label="Endpoint URL" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="ws://localhost:8000/ws" />
      {error && <span className="text-xs text-red-400">{error}</span>}

      <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="customer, technician, admin" />

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Auth Method</label>
        <select
          value={authMethod}
          onChange={(e) => setAuthMethod(e.target.value as AuthMethod)}
          className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {AUTH_METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {authMethod === 'bearer' && (
        <MaskedInput label="Bearer Token" value={token} onChange={(e) => setToken(e.target.value)} />
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Protocol Profile</label>
        <select
          value={client.protocolProfile || ''}
          onChange={(e) => updateClient(client.id, { protocolProfile: e.target.value || undefined })}
          className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Default (no mapping)</option>
          {Object.keys(profiles).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={client.autoReconnect}
            onChange={(e) => updateClient(client.id, { autoReconnect: e.target.checked })}
            className="rounded"
          />
          Auto-reconnect
        </label>
      </div>

      <Button onClick={handleSave} className="w-full">Save Configuration</Button>
    </div>
  );
};