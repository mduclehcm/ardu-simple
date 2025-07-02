import React, { useState } from 'react';
import { useSerial } from '../hooks/useSerial';

interface Waypoint {
  id: number;
  type: 'WAYPOINT' | 'RTL' | 'LOITER' | 'LAND';
  latitude: number;
  longitude: number;
  altitude: number;
  action: string;
}

export const Mission: React.FC = () => {
  const { connectionState } = useSerial();
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    {
      id: 1,
      type: 'WAYPOINT',
      latitude: 37.7749,
      longitude: -122.4194,
      altitude: 100,
      action: 'Navigate to waypoint'
    },
    {
      id: 2,
      type: 'WAYPOINT',
      latitude: 37.7849,
      longitude: -122.4094,
      altitude: 150,
      action: 'Navigate to waypoint'
    },
    {
      id: 3,
      type: 'LOITER',
      latitude: 37.7949,
      longitude: -122.3994,
      altitude: 200,
      action: 'Loiter for 30 seconds'
    },
    {
      id: 4,
      type: 'RTL',
      latitude: 37.7749,
      longitude: -122.4194,
      altitude: 100,
      action: 'Return to launch'
    }
  ]);

  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const addWaypoint = () => {
    const newWaypoint: Waypoint = {
      id: waypoints.length + 1,
      type: 'WAYPOINT',
      latitude: 0,
      longitude: 0,
      altitude: 100,
      action: 'Navigate to waypoint'
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const removeWaypoint = (id: number) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const uploadMission = () => {
    // Placeholder for mission upload
    console.log('Uploading mission:', waypoints);
  };

  const downloadMission = () => {
    // Placeholder for mission download
    console.log('Downloading mission');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Mission Planning
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create and manage flight missions with waypoints
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mission Status
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission Map */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mission Map
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={downloadMission}
                  disabled={!connectionState.isConnected}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download
                </button>
                <button
                  onClick={uploadMission}
                  disabled={!connectionState.isConnected}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload
                </button>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-sm">Mission Map</div>
                <div className="text-xs">Coming Soon</div>
                <div className="text-xs mt-2">
                  {waypoints.length} waypoints loaded
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Waypoint List */}
        <div className="space-y-6">
          {/* Mission Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Mission Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={addWaypoint}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Waypoint
              </button>
              <button
                disabled={!connectionState.isConnected}
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Start Mission
              </button>
              <button
                disabled={!connectionState.isConnected}
                className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Stop Mission
              </button>
              <button
                className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Mission
              </button>
            </div>
          </div>

          {/* Waypoints */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Waypoints ({waypoints.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {waypoints.map((waypoint) => (
                <div
                  key={waypoint.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedWaypoint?.id === waypoint.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedWaypoint(waypoint)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        WP{waypoint.id} - {waypoint.type}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {waypoint.latitude.toFixed(6)}, {waypoint.longitude.toFixed(6)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Alt: {waypoint.altitude}m
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWaypoint(waypoint.id);
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Waypoint Details */}
      {selectedWaypoint && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Waypoint Details - WP{selectedWaypoint.id}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={selectedWaypoint.type}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, type: e.target.value as Waypoint['type'] };
                  setWaypoints(waypoints.map(wp => wp.id === selectedWaypoint.id ? updated : wp));
                  setSelectedWaypoint(updated);
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="WAYPOINT">Waypoint</option>
                <option value="RTL">Return to Launch</option>
                <option value="LOITER">Loiter</option>
                <option value="LAND">Land</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Altitude (m)
              </label>
              <input
                type="number"
                value={selectedWaypoint.altitude}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, altitude: parseInt(e.target.value) };
                  setWaypoints(waypoints.map(wp => wp.id === selectedWaypoint.id ? updated : wp));
                  setSelectedWaypoint(updated);
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={selectedWaypoint.latitude}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, latitude: parseFloat(e.target.value) };
                  setWaypoints(waypoints.map(wp => wp.id === selectedWaypoint.id ? updated : wp));
                  setSelectedWaypoint(updated);
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={selectedWaypoint.longitude}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, longitude: parseFloat(e.target.value) };
                  setWaypoints(waypoints.map(wp => wp.id === selectedWaypoint.id ? updated : wp));
                  setSelectedWaypoint(updated);
                }}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 