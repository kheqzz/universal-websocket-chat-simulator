import { useAppStore } from '@/store';

export function useInspector() {
  const inspectorLog = useAppStore((s) => s.inspectorLog);
  const filters = useAppStore((s) => s.inspectorFilters);
  const setFilters = useAppStore((s) => s.setFilters);
  const clearLog = useAppStore((s) => s.clearLog);
  const getFilteredEntries = useAppStore((s) => s.getFilteredEntries);

  return { inspectorLog, filters, setFilters, clearLog, getFilteredEntries };
}