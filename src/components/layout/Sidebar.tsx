import React from 'react';
import { ClientList } from '../client/ClientList';

interface SidebarProps {
  selectedClientId: string | null;
  onSelectClient: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedClientId, onSelectClient }) => {
  return <ClientList selectedClientId={selectedClientId} onSelectClient={onSelectClient} />;
};