import type { ProtocolProfile } from '@/types';

export function exportProfiles(profiles: ProtocolProfile[]): string {
  return JSON.stringify(profiles, null, 2);
}

export function importProfiles(json: string): { success: boolean; profiles?: ProtocolProfile[]; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return { success: false, error: 'Expected an array of profiles' };
    }
    return { success: true, profiles: parsed as ProtocolProfile[] };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function downloadJson(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}