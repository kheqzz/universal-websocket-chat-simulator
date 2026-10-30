import type { InspectorEntry, InspectorEventType } from '@/types';

export interface InspectorSlice {
  inspectorLog: InspectorEntry[];
  inspectorFilters: { clients: string[]; eventTypes: InspectorEventType[] };
  addEntry: (entry: InspectorEntry) => void;
  clearLog: () => void;
  setFilters: (filters: Partial<{ clients: string[]; eventTypes: InspectorEventType[] }>) => void;
  getFilteredEntries: () => InspectorEntry[];
}

const MAX_INSPECTOR_ENTRIES = 10000;

export const createInspectorSlice = (
  set: (fn: (state: InspectorSlice) => Partial<InspectorSlice>) => void,
  get: () => InspectorSlice,
): InspectorSlice => ({
  inspectorLog: [],
  inspectorFilters: { clients: [], eventTypes: [] },
  addEntry: (entry) => {
    set((state) => {
      let log = [...state.inspectorLog, entry];
      if (log.length > MAX_INSPECTOR_ENTRIES) {
        log = log.slice(log.length - MAX_INSPECTOR_ENTRIES);
      }
      return { inspectorLog: log };
    });
  },
  clearLog: () => set(() => ({ inspectorLog: [] })),
  setFilters: (filters) => {
    set((state) => ({
      inspectorFilters: { ...state.inspectorFilters, ...filters },
    }));
  },
  getFilteredEntries: () => {
    const { inspectorLog, inspectorFilters } = get();
    return inspectorLog.filter((entry) => {
      const clientMatch = inspectorFilters.clients.length === 0 || inspectorFilters.clients.includes(entry.clientId);
      const eventMatch = inspectorFilters.eventTypes.length === 0 || inspectorFilters.eventTypes.includes(entry.eventType);
      return clientMatch && eventMatch;
    });
  },
});