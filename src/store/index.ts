import { create } from 'zustand';
import { createClientSlice, type ClientSlice } from './clientSlice';
import { createMessageSlice, type MessageSlice } from './messageSlice';
import { createInspectorSlice, type InspectorSlice } from './inspectorSlice';
import { createSettingsSlice, type SettingsSlice } from './settingsSlice';
import { createProtocolSlice, type ProtocolSlice } from './protocolSlice';

export type AppState = ClientSlice & MessageSlice & InspectorSlice & SettingsSlice & ProtocolSlice;

export const useAppStore = create<AppState>()((set, get) => ({
  ...createClientSlice(set as never),
  ...createMessageSlice(set as never, get as never),
  ...createInspectorSlice(set as never, get as never),
  ...createSettingsSlice(set as never),
  ...createProtocolSlice(set as never, get as never),
}));