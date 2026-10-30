import { useAppStore } from '@/store';
import type { InspectorEntry, InspectorEventType } from '@/types';

export class InspectorService {
  private static instance: InspectorService;

  static getInstance(): InspectorService {
    if (!InspectorService.instance) {
      InspectorService.instance = new InspectorService();
    }
    return InspectorService.instance;
  }

  log(clientId: string, eventType: InspectorEventType, summary: string, payload?: unknown, closeCode?: number, closeReason?: string): void {
    const entry: InspectorEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      clientId,
      eventType,
      summary,
      payload,
      closeCode,
      closeReason,
    };
    useAppStore.getState().addEntry(entry);
  }
}