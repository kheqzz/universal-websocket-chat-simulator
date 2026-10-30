import { BrowserTransport } from './BrowserTransport';
import type { Transport } from '@/types';

export function createTransport(_platform: string): Transport {
  // All platforms use BrowserTransport in the web app.
  // Electron/Flutter custom headers are documented but not executable in browser.
  return new BrowserTransport();
}

export const TransportFactory = { create: createTransport };