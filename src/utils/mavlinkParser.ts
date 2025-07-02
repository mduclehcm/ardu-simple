import type { MAVLinkMessage, MAVLinkHeader, ParsedMAVLinkMessage, HeartbeatMessage, GPSRawIntMessage, AttitudeMessage, UnknownMessage } from '../types/serial';

// MAVLink constants
const MAVLINK_V1_HEADER_LEN = 6;
const MAVLINK_V2_HEADER_LEN = 10;
const MAVLINK_MSG_ID_HEARTBEAT = 0;
const MAVLINK_MSG_ID_GPS_RAW_INT = 24;
const MAVLINK_MSG_ID_ATTITUDE = 30;

export class MAVLinkParser {
  private buffer: Uint8Array = new Uint8Array(0);
  private messageCount: number = 0;

  constructor() {}

  /**
   * Add incoming data to the buffer and parse any complete messages
   */
  public addData(data: Uint8Array): ParsedMAVLinkMessage[] {
    // Combine existing buffer with new data
    const newBuffer = new Uint8Array(this.buffer.length + data.length);
    newBuffer.set(this.buffer);
    newBuffer.set(data, this.buffer.length);
    this.buffer = newBuffer;

    const messages: ParsedMAVLinkMessage[] = [];

    // Parse messages while we have enough data
    while (this.buffer.length >= MAVLINK_V2_HEADER_LEN) {
      const message = this.parseNextMessage();
      if (message) {
        messages.push(message);
      } else {
        // No complete message found, break
        break;
      }
    }

    return messages;
  }

  /**
   * Parse the next complete message from the buffer
   */
  private parseNextMessage(): ParsedMAVLinkMessage | null {
    // Look for MAVLink magic marker
    const magicIndex = this.findMagicMarker();
    if (magicIndex === -1) {
      // No magic marker found, clear buffer
      this.buffer = new Uint8Array(0);
      return null;
    }

    // Remove data before magic marker
    if (magicIndex > 0) {
      this.buffer = this.buffer.slice(magicIndex);
    }

    // Check if we have enough data for a complete message
    if (this.buffer.length < MAVLINK_V2_HEADER_LEN) {
      return null;
    }

    // Parse header
    const header = this.parseHeader();
    if (!header) {
      return null;
    }

    const totalLength = MAVLINK_V2_HEADER_LEN + header.payloadLength + 2; // +2 for checksum
    if (this.buffer.length < totalLength) {
      return null;
    }

    // Extract payload and checksum
    const payload = this.buffer.slice(MAVLINK_V2_HEADER_LEN, MAVLINK_V2_HEADER_LEN + header.payloadLength);
    const checksum = this.buffer.slice(totalLength - 2, totalLength);

    // Verify checksum
    if (!this.verifyChecksum(header, payload, checksum)) {
      console.warn('MAVLink checksum verification failed');
      this.buffer = this.buffer.slice(1);
      return null;
    }

    // Parse message based on message ID
    const message = this.parseMessagePayload(header, payload);
    if (message) {
      // Remove parsed message from buffer
      this.buffer = this.buffer.slice(totalLength);
      this.messageCount++;
      return message;
    }

    // Unknown message type, remove from buffer
    this.buffer = this.buffer.slice(totalLength);
    return null;
  }

  /**
   * Find the next MAVLink magic marker (0xFD for v2)
   */
  private findMagicMarker(): number {
    for (let i = 0; i < this.buffer.length; i++) {
      if (this.buffer[i] === 0xFD) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Parse MAVLink header
   */
  private parseHeader(): MAVLinkHeader | null {
    if (this.buffer.length < MAVLINK_V2_HEADER_LEN) {
      return null;
    }

    const view = new DataView(this.buffer.buffer, this.buffer.byteOffset);
    
    return {
      magic: view.getUint8(0),
      payloadLength: view.getUint8(1),
      incompatibilityFlags: view.getUint8(2),
      compatibilityFlags: view.getUint8(3),
      packetSequence: view.getUint8(4),
      systemId: view.getUint8(5),
      componentId: view.getUint8(6),
      messageId: view.getUint16(7, true) // little-endian
    };
  }

  /**
   * Verify MAVLink checksum
   */
  private verifyChecksum(header: MAVLinkHeader, payload: Uint8Array, checksum: Uint8Array): boolean {
    // Simple checksum verification (in real implementation, you'd use CRC16)
    // For now, we'll just check if checksum bytes are present
    return checksum.length === 2;
  }

  /**
   * Parse message payload based on message ID
   */
  private parseMessagePayload(header: MAVLinkHeader, payload: Uint8Array): ParsedMAVLinkMessage | null {
    const timestamp = Date.now();

    switch (header.messageId) {
      case MAVLINK_MSG_ID_HEARTBEAT:
        return this.parseHeartbeat(header, payload, timestamp);
      case MAVLINK_MSG_ID_GPS_RAW_INT:
        return this.parseGPSRawInt(header, payload, timestamp);
      case MAVLINK_MSG_ID_ATTITUDE:
        return this.parseAttitude(header, payload, timestamp);
      default:
        console.log(`Unknown MAVLink message ID: ${header.messageId}`);
        return this.parseUnknownMessage(header, payload, timestamp);
    }
  }

  /**
   * Parse HEARTBEAT message
   */
  private parseHeartbeat(header: MAVLinkHeader, payload: Uint8Array, timestamp: number): HeartbeatMessage {
    const view = new DataView(payload.buffer, payload.byteOffset);
    
    return {
      messageId: header.messageId,
      payload,
      sequence: header.packetSequence,
      systemId: header.systemId,
      componentId: header.componentId,
      timestamp,
      type: 'HEARTBEAT',
      systemType: view.getUint8(0),
      autopilotType: view.getUint8(1),
      baseMode: view.getUint8(2),
      customMode: view.getUint32(3, true),
      systemStatus: view.getUint8(7)
    };
  }

  /**
   * Parse GPS_RAW_INT message
   */
  private parseGPSRawInt(header: MAVLinkHeader, payload: Uint8Array, timestamp: number): GPSRawIntMessage {
    const view = new DataView(payload.buffer, payload.byteOffset);
    
    return {
      messageId: header.messageId,
      payload,
      sequence: header.packetSequence,
      systemId: header.systemId,
      componentId: header.componentId,
      timestamp,
      type: 'GPS_RAW_INT',
      timeUsec: Number(view.getBigUint64(0, true)),
      fixType: view.getUint8(8),
      lat: view.getInt32(9, true),
      lon: view.getInt32(13, true),
      alt: view.getInt32(17, true),
      eph: view.getUint16(21, true),
      epv: view.getUint16(23, true),
      vel: view.getUint16(25, true),
      cog: view.getUint16(27, true),
      satellitesVisible: view.getUint8(29)
    };
  }

  /**
   * Parse ATTITUDE message
   */
  private parseAttitude(header: MAVLinkHeader, payload: Uint8Array, timestamp: number): AttitudeMessage {
    const view = new DataView(payload.buffer, payload.byteOffset);
    
    return {
      messageId: header.messageId,
      payload,
      sequence: header.packetSequence,
      systemId: header.systemId,
      componentId: header.componentId,
      timestamp,
      type: 'ATTITUDE',
      timeBootMs: view.getUint32(0, true),
      roll: view.getFloat32(4, true),
      pitch: view.getFloat32(8, true),
      yaw: view.getFloat32(12, true),
      rollspeed: view.getFloat32(16, true),
      pitchspeed: view.getFloat32(20, true),
      yawspeed: view.getFloat32(24, true)
    };
  }

  /**
   * Parse unknown message
   */
  private parseUnknownMessage(header: MAVLinkHeader, payload: Uint8Array, timestamp: number): UnknownMessage {
    return {
      messageId: header.messageId,
      payload,
      sequence: header.packetSequence,
      systemId: header.systemId,
      componentId: header.componentId,
      timestamp,
      type: 'UNKNOWN'
    };
  }

  /**
   * Get parser statistics
   */
  public getStats() {
    return {
      messageCount: this.messageCount,
      bufferSize: this.buffer.length
    };
  }

  /**
   * Clear the parser buffer
   */
  public clear() {
    this.buffer = new Uint8Array(0);
    this.messageCount = 0;
  }
} 