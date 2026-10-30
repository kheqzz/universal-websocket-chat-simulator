import type { ProtocolProfile } from '@/types';

export interface ProtocolSlice {
  protocolProfiles: Record<string, ProtocolProfile>;
  activeProfilePerClient: Record<string, string>;
  addProfile: (profile: ProtocolProfile) => void;
  updateProfile: (name: string, updates: Partial<ProtocolProfile>) => void;
  deleteProfile: (name: string) => void;
  setActiveProfile: (clientId: string, profileName: string) => void;
  getProfile: (name: string) => ProtocolProfile | undefined;
}

export const createProtocolSlice = (
  set: (fn: (state: ProtocolSlice) => Partial<ProtocolSlice>) => void,
  get: () => ProtocolSlice,
): ProtocolSlice => ({
  protocolProfiles: {},
  activeProfilePerClient: {},
  addProfile: (profile) => {
    set((state) => ({
      protocolProfiles: { ...state.protocolProfiles, [profile.name]: profile },
    }));
  },
  updateProfile: (name, updates) => {
    set((state) => {
      const existing = state.protocolProfiles[name];
      if (!existing) return {};
      return {
        protocolProfiles: { ...state.protocolProfiles, [name]: { ...existing, ...updates } },
      };
    });
  },
  deleteProfile: (name) => {
    set((state) => {
      const rest = { ...state.protocolProfiles };
      delete rest[name];
      const activeUpdated = { ...state.activeProfilePerClient };
      for (const key of Object.keys(activeUpdated)) {
        if (activeUpdated[key] === name) delete activeUpdated[key];
      }
      return { protocolProfiles: rest, activeProfilePerClient: activeUpdated };
    });
  },
  setActiveProfile: (clientId, profileName) => {
    set((state) => ({
      activeProfilePerClient: { ...state.activeProfilePerClient, [clientId]: profileName },
    }));
  },
  getProfile: (name) => get().protocolProfiles[name],
});