import React, { useState } from 'react';
import { useSerial } from '../hooks/useSerial';

export const Settings: React.FC = () => {
  const { connectionState, disconnect } = useSerial();
  
  const [settings, setSettings] = useState({
    defaultBaudRate: 115200,
    autoConnect: false,
    messageLimit: 100,
    darkMode: true,
    showTimestamps: true,
    autoScroll: true
  });

  const baudRates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDisconnect = async () => {
    if (connectionState.isConnected) {
      await disconnect();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Connection preferences and application settings
        </p>
      </div>

      {/* Connection Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Connection Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Baud Rate
            </label>
            <select
              value={settings.defaultBaudRate}
              onChange={(e) => handleSettingChange('defaultBaudRate', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {baudRates.map(rate => (
                <option key={rate} value={rate}>
                  {rate} bps
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoConnect"
              checked={settings.autoConnect}
              onChange={(e) => handleSettingChange('autoConnect', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoConnect" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              Auto-connect on startup
            </label>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Display Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message History Limit
            </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={settings.messageLimit}
              onChange={(e) => handleSettingChange('messageLimit', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Maximum number of messages to keep in memory
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showTimestamps"
              checked={settings.showTimestamps}
              onChange={(e) => handleSettingChange('showTimestamps', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showTimestamps" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              Show timestamps in message viewer
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoScroll"
              checked={settings.autoScroll}
              onChange={(e) => handleSettingChange('autoScroll', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoScroll" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              Auto-scroll message viewer
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              checked={settings.darkMode}
              onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              Dark mode (requires page refresh)
            </label>
          </div>
        </div>
      </div>

      {/* Connection Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Connection Management
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Current Connection
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {connectionState.isConnected 
                  ? `Connected to ${connectionState.portInfo?.name || 'Unknown port'}`
                  : 'Not connected'
                }
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={!connectionState.isConnected}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disconnect
            </button>
          </div>

          {connectionState.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Connection Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {connectionState.error}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          About Ardu-Simple
        </h2>
        
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Ardu-Simple is a lightweight ground station control application designed for 
            hobby-level FPV plane users with ArduPilot autopilot systems.
          </p>
          <p>
            <strong>Version:</strong> 0.1.0<br />
            <strong>Built with:</strong> React, TypeScript, Tailwind CSS, Web Serial API<br />
            <strong>Protocol:</strong> MAVLink v2
          </p>
          <p>
            This application focuses on ease of use and reliability, providing essential 
            real-time monitoring and control capabilities through a clean, responsive web interface.
          </p>
        </div>
      </div>
    </div>
  );
}; 