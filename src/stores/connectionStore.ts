import { create } from 'zustand';
import { SerialConnectionState } from '../types/serial';

interface ConnectionStore {
  // Connection state
  connectionState: SerialConnectionState;
  isSupported: boolean;
  
  // Messages and stats
  messages: any[];
  parserStats: {
    totalMessages: number;
    validMessages: number;
    invalidMessages: number;
    lastMessageTime: number;
  };
  
  // Actions
  setConnectionState: (state: SerialConnectionState) => void;
  setIsSupported: (supported: boolean) => void;
  addMessage: (message: any) => void;
  clearMessages: () => void;
  updateParserStats: (stats: {
    totalMessages: number;
    validMessages: number;
    invalidMessages: number;
    lastMessageTime: number;
  }) => void;
  reset: () => void;
}

const initialState = {
  connectionState: SerialConnectionState.DISCONNECTED,
  isSupported: false,
  messages: [],
  parserStats: {
    totalMessages: 0,
    validMessages: 0,
    invalidMessages: 0,
    lastMessageTime: 0,
  },
};

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  ...initialState,

  setConnectionState: (state: SerialConnectionState) => {
    set({ connectionState: state });
  },

  setIsSupported: (supported: boolean) => {
    set({ isSupported: supported });
  },

  addMessage: (message: any) => {
    set((state) => ({
      messages: [...state.messages, message].slice(-1000), // Keep last 1000 messages
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  updateParserStats: (stats) => {
    set({ parserStats: stats });
  },

  reset: () => {
    set(initialState);
  },
})); 