import type { RestEndpoint } from '@/types';

export interface SettingsSlice {
  platformMode: 'browser' | 'electron' | 'flutter';
  theme: 'light' | 'dark';
  defaultWsUrl: string;
  defaultApiUrl: string;
  restEndpoints: RestEndpoint[];
  setPlatformMode: (mode: 'browser' | 'electron' | 'flutter') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setDefaultWsUrl: (url: string) => void;
  setDefaultApiUrl: (url: string) => void;
  setRestEndpoints: (endpoints: RestEndpoint[]) => void;
}

export const createSettingsSlice = (
  set: (fn: (state: SettingsSlice) => Partial<SettingsSlice>) => void,
): SettingsSlice => ({
  platformMode: 'browser',
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  defaultWsUrl: import.meta.env.VITE_DEFAULT_WS_URL || '',
  defaultApiUrl: import.meta.env.VITE_DEFAULT_API_URL || '',
  restEndpoints: [],
  setPlatformMode: (mode) => set(() => ({ platformMode: mode })),
  setTheme: (theme) => {
    set(() => ({ theme }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },
  setDefaultWsUrl: (url) => set(() => ({ defaultWsUrl: url })),
  setDefaultApiUrl: (url) => set(() => ({ defaultApiUrl: url })),
  setRestEndpoints: (endpoints) => set(() => ({ restEndpoints: endpoints })),
});