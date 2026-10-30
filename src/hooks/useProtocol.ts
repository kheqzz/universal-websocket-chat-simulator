import { useAppStore } from '@/store';

export function useProtocol() {
  const profiles = useAppStore((s) => s.protocolProfiles);
  const activeProfilePerClient = useAppStore((s) => s.activeProfilePerClient);
  const addProfile = useAppStore((s) => s.addProfile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const deleteProfile = useAppStore((s) => s.deleteProfile);
  const setActiveProfile = useAppStore((s) => s.setActiveProfile);
  const getProfile = useAppStore((s) => s.getProfile);

  return { profiles, activeProfilePerClient, addProfile, updateProfile, deleteProfile, setActiveProfile, getProfile };
}