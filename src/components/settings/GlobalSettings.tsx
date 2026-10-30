import React from 'react';
import { useAppStore } from '@/store';
import { Button } from '../shared/Button';

export const GlobalSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const platformMode = useAppStore((s) => s.platformMode);
  const theme = useAppStore((s) => s.theme);
  const defaultWsUrl = useAppStore((s) => s.defaultWsUrl);
  const defaultApiUrl = useAppStore((s) => s.defaultApiUrl);
  const setPlatformMode = useAppStore((s) => s.setPlatformMode);
  const setTheme = useAppStore((s) => s.setTheme);
  const setDefaultWsUrl = useAppStore((s) => s.setDefaultWsUrl);
  const setDefaultApiUrl = useAppStore((s) => s.setDefaultApiUrl);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-slate-200">Global Settings</h3>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Platform Mode</label>
        <select
          value={platformMode}
          onChange={(e) => setPlatformMode(e.target.value as 'browser' | 'electron' | 'flutter')}
          className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200"
        >
          <option value="browser">Browser</option>
          <option value="electron">Electron</option>
          <option value="flutter">Flutter</option>
        </select>
        <span className="text-[10px] text-slate-500">
          {platformMode === 'browser'
            ? 'Browser: custom headers not supported. Use cookies or tickets.'
            : 'Custom handshake headers supported.'}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
          className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Default WebSocket URL</label>
        <input
          value={defaultWsUrl}
          onChange={(e) => setDefaultWsUrl(e.target.value)}
          className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200"
          placeholder="ws://localhost:8000"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Default API URL</label>
        <input
          value={defaultApiUrl}
          onChange={(e) => setDefaultApiUrl(e.target.value)}
          className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200"
          placeholder="http://localhost:8000"
        />
      </div>

      <Button onClick={onClose} className="w-full">Close</Button>
    </div>
  );
};