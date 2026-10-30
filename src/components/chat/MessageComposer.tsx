import React, { useState } from 'react';
import { Send, Code } from 'lucide-react';
import { Button } from '../shared/Button';
import { validateJson } from '@/utils';

interface MessageComposerProps {
  onSend: (content: unknown, isJson: boolean) => void;
  disabled: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonError, setJsonError] = useState('');

  const handleSend = () => {
    if (disabled) return;
    if (jsonMode) {
      const check = validateJson(text);
      if (!check.valid) {
        setJsonError(check.error || 'Invalid JSON');
        return;
      }
      onSend(check.value, true);
    } else {
      if (!text.trim()) return;
      onSend(text, false);
    }
    setText('');
    setJsonError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-700 p-3">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setJsonMode(!jsonMode)}
          className={`p-1 rounded ${jsonMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          title="Toggle JSON mode"
        >
          <Code size={14} />
        </button>
        {jsonMode && <span className="text-xs text-slate-400">JSON mode</span>}
      </div>
      {jsonError && <div className="text-xs text-red-400 mb-1">{jsonError}</div>}
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setJsonError(''); }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={jsonMode ? '{"message": "hello"}' : 'Type a message...'}
          rows={2}
          className="flex-1 px-3 py-2 text-sm bg-slate-800 border border-slate-600 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-50"
        />
        <Button onClick={handleSend} disabled={disabled || !text.trim()} size="md">
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
};