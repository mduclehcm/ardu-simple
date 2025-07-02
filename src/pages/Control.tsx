import React from 'react';
import { useSerial } from '../hooks/useSerial';

export const Control: React.FC = () => {
  const { connectionState, messages } = useSerial();

  // Extract latest flight data
  const latestGPS = messages.find(msg => msg.type === 'GPS_RAW_INT');
  const latestAttitude = messages.find(msg => msg.type === 'ATTITUDE');
  const latestVFR = messages.find(msg => msg.type === 'UNKNOWN'); // Placeholder for VFR_HUD

  // Mock flight data (in real app, this would come from parsed MAVLink messages)
  const flightData = {
    altitude: latestVFR ? '1250m' : 'N/A',
    airspeed: latestVFR ? '45m/s' : 'N/A',
    groundspeed: latestGPS ? '42m/s' : 'N/A',
    heading: latestVFR ? '180°' : 'N/A',
    throttle: latestVFR ? '75%' : 'N/A',
    climbRate: latestVFR ? '+2.5m/s' : 'N/A'
  };

  const attitudeData = {
    roll: latestAttitude ? 15 : 0,
    pitch: latestAttitude ? -5 : 0,
    yaw: latestAttitude ? 180 : 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Primary Flight Display
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Real-time flight data and control interface
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Flight Status
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
            {connectionState.isConnected ? 'FLIGHT READY' : 'DISCONNECTED'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Flight Instruments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attitude Indicator */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Attitude Indicator
            </h3>
            <div className="flex justify-center">
              <div className="relative w-64 h-64 bg-blue-900 rounded-full border-4 border-gray-300 dark:border-gray-600">
                {/* Artificial Horizon */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-blue-400 to-brown-400 rounded-full"
                  style={{
                    transform: `rotate(${attitudeData.roll}deg) translateY(${attitudeData.pitch * 2}px)`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-white opacity-80"></div>
                  </div>
                </div>
                
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-800"></div>
                </div>
                
                {/* Roll indicators */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white opacity-60"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white opacity-60"></div>
                
                {/* Pitch ladder */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-white opacity-60"></div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-white opacity-60"></div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {attitudeData.roll}°
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Roll</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {attitudeData.pitch}°
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pitch</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {attitudeData.yaw}°
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Yaw</div>
              </div>
            </div>
          </div>

          {/* Flight Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Flight Data
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {flightData.altitude}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Altitude</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {flightData.airspeed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Airspeed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {flightData.heading}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Heading</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {flightData.throttle}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Throttle</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {flightData.climbRate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Climb Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {flightData.groundspeed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ground Speed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map and Controls */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Map View
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-sm">Map View</div>
                <div className="text-xs">Coming Soon</div>
              </div>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Controls
            </h3>
            <div className="space-y-3">
              <button
                disabled={!connectionState.isConnected}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Return to Launch
              </button>
              <button
                disabled={!connectionState.isConnected}
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Loiter Mode
              </button>
              <button
                disabled={!connectionState.isConnected}
                className="w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Guided Mode
              </button>
              <button
                disabled={!connectionState.isConnected}
                className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Emergency Stop
              </button>
            </div>
          </div>

          {/* Flight Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Flight Mode
            </h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                FBWA
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Fly By Wire A
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 