import React, { useState } from 'react';
import type { SerialPortInfo } from '../types/serial';
import './SerialPortSelector.css';

interface SerialPortSelectorProps {
  isSupported: boolean;
  connectionState: {
    isConnected: boolean;
    portInfo: SerialPortInfo | null;
    error: string | null;
  };
  onRequestPort: () => Promise<SerialPortInfo | null>;
  onConnect: (baudRate: number) => Promise<boolean>;
  onDisconnect: () => Promise<void>;
}

export const SerialPortSelector: React.FC<SerialPortSelectorProps> = ({
  isSupported,
  connectionState,
  onRequestPort,
  onConnect,
  onDisconnect
}) => {
  const [baudRate, setBaudRate] = useState(115200);
  const [isLoading, setIsLoading] = useState(false);

  const commonBaudRates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

  const handleRequestPort = async () => {
    setIsLoading(true);
    try {
      await onRequestPort();
    } catch (error) {
      console.error('Error requesting port:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await onConnect(baudRate);
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await onDisconnect();
    } catch (error) {
      console.error('Error disconnecting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="serial-port-selector">
        <div className="error-message">
          <h3>⚠️ Web Serial API Not Supported</h3>
          <p>
            Your browser doesn't support the Web Serial API. Please use a modern browser like Chrome, Edge, or Opera.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="serial-port-selector">
      <div className="connection-panel">
        <h3>Serial Connection</h3>
        
        {/* Port Selection */}
        <div className="port-section">
          <label>Port:</label>
          <div className="port-info">
            {connectionState.portInfo ? (
              <span className="port-name">{connectionState.portInfo.name}</span>
            ) : (
              <span className="no-port">No port selected</span>
            )}
          </div>
          <button
            onClick={handleRequestPort}
            disabled={isLoading || connectionState.isConnected}
            className="btn btn-secondary"
          >
            {isLoading ? 'Selecting...' : 'Select Port'}
          </button>
        </div>

        {/* Baud Rate Selection */}
        <div className="baudrate-section">
          <label>Baud Rate:</label>
          <select
            value={baudRate}
            onChange={(e) => setBaudRate(Number(e.target.value))}
            disabled={connectionState.isConnected}
            className="baudrate-select"
          >
            {commonBaudRates.map(rate => (
              <option key={rate} value={rate}>{rate}</option>
            ))}
          </select>
        </div>

        {/* Connection Controls */}
        <div className="connection-controls">
          {!connectionState.isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isLoading || !connectionState.portInfo}
              className="btn btn-primary"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="btn btn-danger"
            >
              {isLoading ? 'Disconnecting...' : 'Disconnect'}
            </button>
          )}
        </div>

        {/* Status */}
        <div className="status-section">
          <div className={`status-indicator ${connectionState.isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {connectionState.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {connectionState.error && (
            <div className="error-message">
              <span>Error: {connectionState.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 