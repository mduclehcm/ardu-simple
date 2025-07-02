import { useState, useEffect, useCallback, useRef } from 'react';
import type { SerialConnectionState, ParsedMAVLinkMessage } from '../types/serial';
import { SerialManager } from '../utils/serialManager';

export const useSerial = () => {
  const [connectionState, setConnectionState] = useState<SerialConnectionState>({
    isConnected: false,
    port: null,
    portInfo: null,
    error: null
  });
  
  const [messages, setMessages] = useState<ParsedMAVLinkMessage[]>([]);
  const [parserStats, setParserStats] = useState({ messageCount: 0, bufferSize: 0 });
  
  const serialManagerRef = useRef<SerialManager | null>(null);

  // Initialize serial manager
  useEffect(() => {
    serialManagerRef.current = new SerialManager();
    
    // Set up callbacks
    serialManagerRef.current.onStateChange((state) => {
      setConnectionState(state);
    });
    
    serialManagerRef.current.onMessage((message) => {
      setMessages(prev => [...prev, message]);
      // Keep only last 100 messages to prevent memory issues
      if (messages.length > 100) {
        setMessages(prev => prev.slice(-100));
      }
    });

    // Update parser stats periodically
    const statsInterval = setInterval(() => {
      if (serialManagerRef.current) {
        setParserStats(serialManagerRef.current.getParserStats());
      }
    }, 1000);

    return () => {
      clearInterval(statsInterval);
      if (serialManagerRef.current) {
        serialManagerRef.current.disconnect();
      }
    };
  }, []);

  // Check if Web Serial is supported
  const isSupported = useCallback(() => {
    return serialManagerRef.current?.isSupported() ?? false;
  }, []);

  // Request port selection
  const requestPort = useCallback(async () => {
    if (!serialManagerRef.current) return null;
    return await serialManagerRef.current.requestPort();
  }, []);

  // Connect to selected port
  const connect = useCallback(async (baudRate: number = 115200) => {
    if (!serialManagerRef.current) return false;
    return await serialManagerRef.current.connect(baudRate);
  }, []);

  // Disconnect from port
  const disconnect = useCallback(async () => {
    if (!serialManagerRef.current) return;
    await serialManagerRef.current.disconnect();
  }, []);

  // Write data to port
  const writeData = useCallback(async (data: Uint8Array) => {
    if (!serialManagerRef.current) return false;
    return await serialManagerRef.current.writeData(data);
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    if (serialManagerRef.current) {
      serialManagerRef.current.clearParser();
    }
  }, []);

  // Clear parser buffer
  const clearParser = useCallback(() => {
    if (serialManagerRef.current) {
      serialManagerRef.current.clearParser();
    }
  }, []);

  return {
    // State
    connectionState,
    messages,
    parserStats,
    
    // Methods
    isSupported,
    requestPort,
    connect,
    disconnect,
    writeData,
    clearMessages,
    clearParser
  };
}; 