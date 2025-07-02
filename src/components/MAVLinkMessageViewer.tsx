import React, { useState, useRef, useEffect } from 'react';
import type { ParsedMAVLinkMessage } from '../types/serial';
import './MAVLinkMessageViewer.css';

interface MAVLinkMessageViewerProps {
  messages: ParsedMAVLinkMessage[];
  parserStats: { messageCount: number; bufferSize: number };
  onClearMessages: () => void;
}

export const MAVLinkMessageViewer: React.FC<MAVLinkMessageViewerProps> = ({
  messages,
  parserStats,
  onClearMessages
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Get unique message types for filter
  const messageTypes = Array.from(new Set(messages.map(msg => msg.type)));

  // Filter messages based on selected type
  const filteredMessages = filterType === 'all' 
    ? messages 
    : messages.filter(msg => msg.type === filterType);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderMessageContent = (message: ParsedMAVLinkMessage) => {
    switch (message.type) {
      case 'HEARTBEAT':
        return (
          <div className="message-content">
            <div className="message-row">
              <span className="label">System Type:</span>
              <span className="value">{message.systemType}</span>
            </div>
            <div className="message-row">
              <span className="label">Autopilot Type:</span>
              <span className="value">{message.autopilotType}</span>
            </div>
            <div className="message-row">
              <span className="label">Base Mode:</span>
              <span className="value">{message.baseMode.toString(2).padStart(8, '0')}</span>
            </div>
            <div className="message-row">
              <span className="label">System Status:</span>
              <span className="value">{message.systemStatus}</span>
            </div>
          </div>
        );

      case 'GPS_RAW_INT':
        return (
          <div className="message-content">
            <div className="message-row">
              <span className="label">Fix Type:</span>
              <span className="value">{message.fixType}</span>
            </div>
            <div className="message-row">
              <span className="label">Latitude:</span>
              <span className="value">{(message.lat / 1e7).toFixed(6)}°</span>
            </div>
            <div className="message-row">
              <span className="label">Longitude:</span>
              <span className="value">{(message.lon / 1e7).toFixed(6)}°</span>
            </div>
            <div className="message-row">
              <span className="label">Altitude:</span>
              <span className="value">{(message.alt / 1000).toFixed(1)}m</span>
            </div>
            <div className="message-row">
              <span className="label">Satellites:</span>
              <span className="value">{message.satellitesVisible}</span>
            </div>
          </div>
        );

      case 'ATTITUDE':
        return (
          <div className="message-content">
            <div className="message-row">
              <span className="label">Roll:</span>
              <span className="value">{(message.roll * 180 / Math.PI).toFixed(1)}°</span>
            </div>
            <div className="message-row">
              <span className="label">Pitch:</span>
              <span className="value">{(message.pitch * 180 / Math.PI).toFixed(1)}°</span>
            </div>
            <div className="message-row">
              <span className="label">Yaw:</span>
              <span className="value">{(message.yaw * 180 / Math.PI).toFixed(1)}°</span>
            </div>
            <div className="message-row">
              <span className="label">Roll Speed:</span>
              <span className="value">{(message.rollspeed * 180 / Math.PI).toFixed(1)}°/s</span>
            </div>
            <div className="message-row">
              <span className="label">Pitch Speed:</span>
              <span className="value">{(message.pitchspeed * 180 / Math.PI).toFixed(1)}°/s</span>
            </div>
            <div className="message-row">
              <span className="label">Yaw Speed:</span>
              <span className="value">{(message.yawspeed * 180 / Math.PI).toFixed(1)}°/s</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="message-content">
            <div className="message-row">
              <span className="label">Raw Payload:</span>
              <span className="value">{Array.from(message.payload).map((b: number) => b.toString(16).padStart(2, '0')).join(' ')}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mavlink-message-viewer">
      <div className="viewer-header">
        <h3>MAVLink Messages</h3>
        <div className="viewer-controls">
          <div className="stats">
            <span className="stat-item">
              Messages: {parserStats.messageCount}
            </span>
            <span className="stat-item">
              Buffer: {parserStats.bufferSize} bytes
            </span>
            <span className="stat-item">
              Displayed: {filteredMessages.length}
            </span>
          </div>
          
          <div className="controls">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {messageTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <label className="auto-scroll-label">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              Auto-scroll
            </label>
            
            <button
              onClick={onClearMessages}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {filteredMessages.length === 0 ? (
          <div className="no-messages">
            <p>No MAVLink messages received yet.</p>
            <p>Connect to a serial port to start receiving messages.</p>
          </div>
        ) : (
          <div className="messages-list">
            {filteredMessages.map((message, index) => (
              <div key={`${message.timestamp}-${index}`} className="message-item">
                <div className="message-header">
                  <span className="message-type">{message.type}</span>
                  <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                  <span className="message-id">ID: {message.messageId}</span>
                  <span className="message-system">SYS: {message.systemId}</span>
                  <span className="message-component">COMP: {message.componentId}</span>
                </div>
                {renderMessageContent(message)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}; 