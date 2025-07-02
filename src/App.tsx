import React from 'react';
import { SerialPortSelector } from './components/SerialPortSelector';
import { MAVLinkMessageViewer } from './components/MAVLinkMessageViewer';
import { useSerial } from './hooks/useSerial';
import './App.css';

function App() {
  const {
    connectionState,
    messages,
    parserStats,
    isSupported,
    requestPort,
    connect,
    disconnect,
    clearMessages
  } = useSerial();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Ardu-Simple
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                MAVLink Serial Communication Tool
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                connectionState.isConnected 
                  ? 'status-connected' 
                  : connectionState.error 
                  ? 'status-error' 
                  : 'status-disconnected'
              }`}>
                {connectionState.isConnected ? 'CONNECTED' : connectionState.error ? 'ERROR' : 'DISCONNECTED'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Connection Controls */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Connection
              </h2>
              <SerialPortSelector
                isSupported={isSupported()}
                connectionState={connectionState}
                onRequestPort={requestPort}
                onConnect={connect}
                onDisconnect={disconnect}
              />
            </div>
          </div>

          {/* Right Panel - Message Viewer */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  MAVLink Messages
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {parserStats.messageCount} messages
                  </div>
                  <button
                    onClick={clearMessages}
                    className="btn-secondary text-sm"
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
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Built with React, TypeScript, Tailwind CSS, and Web Serial API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
