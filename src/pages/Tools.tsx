import React, { useState } from 'react';
import { useSerial } from '../hooks/useSerial';
import { MAVLinkMessageViewer } from '../components/MAVLinkMessageViewer';

export const Tools: React.FC = () => {
  const { connectionState, messages, parserStats, clearMessages } = useSerial();
  const [activeTab, setActiveTab] = useState<'telemetry' | 'parameters' | 'logs' | 'calibration'>('telemetry');

  const tabs = [
    { id: 'telemetry', label: 'Telemetry', icon: '📡' },
    { id: 'parameters', label: 'Parameters', icon: '⚙️' },
    { id: 'logs', label: 'Logs', icon: '📋' },
    { id: 'calibration', label: 'Calibration', icon: '🎯' }
  ];

  // Mock parameter data
  const parameters = [
    { name: 'WPNAV_SPEED', value: '15.0', type: 'FLOAT', description: 'Waypoint navigation speed' },
    { name: 'RTL_ALT', value: '100.0', type: 'FLOAT', description: 'Return to launch altitude' },
    { name: 'ARMING_CHECK', value: '1', type: 'INT8', description: 'Arming check enable' },
    { name: 'FS_SHORT_ACTN', value: '2', type: 'INT8', description: 'Short failsafe action' },
    { name: 'FS_LONG_ACTN', value: '2', type: 'INT8', description: 'Long failsafe action' }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredParameters = parameters.filter(param =>
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Diagnostic Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          System diagnostics, parameter configuration, and utilities
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Tool Status
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {connectionState.isConnected ? 'Connected to vehicle' : 'Not connected'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            connectionState.isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {connectionState.isConnected ? 'READY' : 'DISCONNECTED'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Telemetry Tab */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  MAVLink Telemetry
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {parserStats.messageCount} messages
                  </div>
                  <button
                    onClick={clearMessages}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <MAVLinkMessageViewer
                messages={messages}
                parserStats={parserStats}
                onClearMessages={clearMessages}
              />
            </div>
          )}

          {/* Parameters Tab */}
          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Vehicle Parameters
                </h3>
                <div className="flex space-x-2">
                  <button
                    disabled={!connectionState.isConnected}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Download All
                  </button>
                  <button
                    disabled={!connectionState.isConnected}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload All
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Parameter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredParameters.map((param) => (
                      <tr key={param.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {param.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {param.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {param.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {param.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  System Logs
                </h3>
                <div className="flex space-x-2">
                  <button
                    disabled={!connectionState.isConnected}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Download Logs
                  </button>
                  <button
                    disabled={!connectionState.isConnected}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📋</div>
                  <div className="text-sm">System Logs</div>
                  <div className="text-xs">Coming Soon</div>
                </div>
              </div>
            </div>
          )}

          {/* Calibration Tab */}
          {activeTab === 'calibration' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Sensor Calibration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Accelerometer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Calibrate the accelerometer for proper level detection
                  </p>
                  <button
                    disabled={!connectionState.isConnected}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Calibration
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Compass</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Calibrate the compass for accurate heading
                  </p>
                  <button
                    disabled={!connectionState.isConnected}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Calibration
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Radio</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Calibrate radio control inputs
                  </p>
                  <button
                    disabled={!connectionState.isConnected}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Calibration
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Airspeed</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Calibrate airspeed sensor
                  </p>
                  <button
                    disabled={!connectionState.isConnected}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Calibration
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 