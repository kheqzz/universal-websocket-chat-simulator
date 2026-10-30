import type { ProtocolAdapter, ProtocolProfile, ChatMessage } from '@/types';
import { getNestedValue, setNestedValue } from '@/utils';

export class JsonPathAdapter implements ProtocolAdapter {
  constructor(private profile: ProtocolProfile) {}

  fromBackend(raw: unknown): ChatMessage | null {
    const m = this.profile.mappings;
    const get = (path?: string) => (path ? getNestedValue(raw, path) : undefined);
    const content = get(m.content);
    if (content === undefined) return null;
    return {
      id: (get(m.messageId) as string) ?? crypto.randomUUID(),
      clientId: '',
      direction: 'incoming',
      sender: get(m.sender) as string | undefined,
      content,
      rawPayload: raw,
      timestamp: (get(m.timestamp) as number) ?? Date.now(),
      conversationId: get(m.conversationId) as string | undefined,
    };
  }

  toBackend(input: ChatMessage): unknown {
    const m = this.profile.mappings;
    const obj: Record<string, unknown> = {};
    if (m.sender && input.sender !== undefined) setNestedValue(obj, m.sender, input.sender);
    if (m.content && input.content !== undefined) setNestedValue(obj, m.content, input.content);
    if (m.conversationId && input.conversationId !== undefined) setNestedValue(obj, m.conversationId, input.conversationId);
    if (m.messageId) setNestedValue(obj, m.messageId, input.id);
    if (m.timestamp) setNestedValue(obj, m.timestamp, input.timestamp);
    return obj;
  }

  getEventName(type: string): string {
    return this.profile.eventNames?.[type] ?? type;
  }
}

export class ProfileManager {
  private profiles: Record<string, ProtocolProfile> = {};

  add(profile: ProtocolProfile): void {
    this.profiles[profile.name] = profile;
  }

  get(name: string): ProtocolProfile | undefined {
    return this.profiles[name];
  }

  list(): ProtocolProfile[] {
    return Object.values(this.profiles);
  }

  remove(name: string): void {
    delete this.profiles[name];
  }

  exportAll(): string {
    return JSON.stringify(Object.values(this.profiles), null, 2);
  }

  importAll(json: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) return { success: false, count: 0, error: 'Expected array' };
      let count = 0;
      for (const p of parsed) {
        if (p && typeof p.name === 'string') {
          this.profiles[p.name] = p as ProtocolProfile;
          count++;
        }
      }
      return { success: true, count };
    } catch (e) {
      return { success: false, count: 0, error: e instanceof Error ? e.message : 'Invalid JSON' };
    }
  }
}