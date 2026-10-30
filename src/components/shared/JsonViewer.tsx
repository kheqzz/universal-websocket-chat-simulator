import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: unknown;
  className?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let formatted: string;
  try {
    formatted = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  } catch {
    formatted = String(data);
  }

  return (
    <div className={`relative group ${className}`}>
      <pre className="text-xs font-mono text-slate-300 bg-slate-900/50 p-2 rounded overflow-auto max-h-60 whitespace-pre-wrap break-all">
        {formatted}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-1 right-1 p-1 text-slate-400 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
};