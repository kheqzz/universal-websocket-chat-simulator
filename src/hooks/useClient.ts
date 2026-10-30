import { useAppStore } from '@/store';

export function useClient() {
  const clients = useAppStore((s) => s.clients);
  const clientOrder = useAppStore((s) => s.clientOrder);
  const addClient = useAppStore((s) => s.addClient);
  const updateClient = useAppStore((s) => s.updateClient);
  const removeClient = useAppStore((s) => s.removeClient);

  return { clients, clientOrder, addClient, updateClient, removeClient };
}