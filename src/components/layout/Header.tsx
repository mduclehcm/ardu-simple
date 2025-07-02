import React from 'react';

interface HeaderProps {
  connectionState: {
    isConnected: boolean;
    error: string | null;
  };
}

export const Header: React.FC<HeaderProps> = ({ connectionState }) => {
  const getStatusClass = () => {
    if (connectionState.isConnected) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (connectionState.error) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getStatusText = () => {
    if (connectionState.isConnected) return 'CONNECTED';
    if (connectionState.error) return 'ERROR';
    return 'DISCONNECTED';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Ardu-Simple
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              MAVLink Ground Station Control
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
              {getStatusText()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 