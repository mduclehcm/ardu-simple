import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  // Serial settings
  baudRate: number;
  autoConnect: boolean;
  
  // UI settings
  theme: 'light' | 'dark' | 'auto';
  messageLimit: number;
  autoScroll: boolean;
  
  // Display settings
  showTimestamp: boolean;
  showRawData: boolean;
  messageFilter: string[];
  
  // Actions
  setBaudRate: (rate: number) => void;
  setAutoConnect: (auto: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setMessageLimit: (limit: number) => void;
  setAutoScroll: (auto: boolean) => void;
  setShowTimestamp: (show: boolean) => void;
  setShowRawData: (show: boolean) => void;
  setMessageFilter: (filter: string[]) => void;
  reset: () => void;
}

const defaultSettings = {
  baudRate: 115200,
  autoConnect: false,
  theme: 'auto' as const,
  messageLimit: 1000,
  autoScroll: true,
  showTimestamp: true,
  showRawData: false,
  messageFilter: ['HEARTBEAT', 'GPS_RAW_INT', 'ATTITUDE'],
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setBaudRate: (rate: number) => {
        set({ baudRate: rate });
      },

      setAutoConnect: (auto: boolean) => {
        set({ autoConnect: auto });
      },

      setTheme: (theme: 'light' | 'dark' | 'auto') => {
        set({ theme });
      },

      setMessageLimit: (limit: number) => {
        set({ messageLimit: limit });
      },

      setAutoScroll: (auto: boolean) => {
        set({ autoScroll: auto });
      },

      setShowTimestamp: (show: boolean) => {
        set({ showTimestamp: show });
      },

      setShowRawData: (show: boolean) => {
        set({ showRawData: show });
      },

      setMessageFilter: (filter: string[]) => {
        set({ messageFilter: filter });
      },

      reset: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'ardu-simple-settings',
      version: 1,
    }
  )
); 