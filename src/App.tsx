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
    <div className="app">
      <header className="app-header">
        <h1>Ardu-Simple</h1>
        <p>MAVLink Serial Communication Tool</p>
      </header>

      <main className="app-main">
        <div className="app-layout">
          <div className="left-panel">
            <SerialPortSelector
              isSupported={isSupported()}
              connectionState={connectionState}
              onRequestPort={requestPort}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>

          <div className="right-panel">
            <MAVLinkMessageViewer
              messages={messages}
              parserStats={parserStats}
              onClearMessages={clearMessages}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with React, TypeScript, and Web Serial API
        </p>
      </footer>
    </div>
  );
}

export default App;
