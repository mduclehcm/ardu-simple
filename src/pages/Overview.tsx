import React from 'react';
import { useSerial } from '../hooks/useSerial';

export const Dashboard: React.FC = () => {
  const { connectionState, messages, parserStats } = useSerial();

  // Extract latest telemetry data from messages
  const latestHeartbeat = messages.find(msg => msg.type === 'HEARTBEAT');
  const latestGPS = messages.find(msg => msg.type === 'GPS_RAW_INT');
  const latestAttitude = messages.find(msg => msg.type === 'ATTITUDE');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of critical flight data and system status
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Connection Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              connectionState.isConnected 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {connectionState.isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {parserStats.messageCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Messages Received
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {parserStats.bufferSize}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Buffer Size
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPS Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            GPS Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-medium">
                {latestGPS ? 'Active' : 'No Data'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Message ID:</span>
              <span className="font-medium">
                {latestGPS ? latestGPS.messageId : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">System ID:</span>
              <span className="font-medium">
                {latestGPS ? latestGPS.systemId : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
              <span className="font-medium">
                {latestGPS ? new Date(latestGPS.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Attitude Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Attitude
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-medium">
                {latestAttitude ? 'Active' : 'No Data'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Message ID:</span>
              <span className="font-medium">
                {latestAttitude ? latestAttitude.messageId : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">System ID:</span>
              <span className="font-medium">
                {latestAttitude ? latestAttitude.systemId : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
              <span className="font-medium">
                {latestAttitude ? new Date(latestAttitude.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">
            Connect to Vehicle
          </button>
          <button className="btn-secondary">
            Clear Messages
          </button>
          <button className="btn-secondary">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}; 