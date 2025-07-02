// Web Serial API type declarations
declare global {
  interface SerialPort {
    readable: ReadableStream<Uint8Array> | null;
    writable: WritableStream<Uint8Array> | null;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
    getSignals(): Promise<SerialOutputSignals>;
    setSignals(signals: SerialInputSignals): Promise<void>;
  }

  interface SerialOptions {
    baudRate: number;
    dataBits?: number;
    stopBits?: number;
    parity?: string;
    bufferSize?: number;
    flowControl?: string;
  }

  interface SerialOutputSignals {
    dataTerminalReady?: boolean;
    requestToSend?: boolean;
    break?: boolean;
  }

  interface SerialInputSignals {
    dataTerminalReady?: boolean;
    requestToSend?: boolean;
    break?: boolean;
  }

  interface SerialPortRequestOptions {
    filters?: SerialPortFilter[];
  }

  interface SerialPortFilter {
    usbVendorId?: number;
    usbProductId?: number;
  }

  interface Serial {
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
    getPorts(): Promise<SerialPort[]>;
  }

  interface Navigator {
    serial: Serial;
  }
}

// Serial communication types
export interface SerialPortInfo {
  port: SerialPort;
  name: string;
  manufacturer?: string;
  serialNumber?: string;
  productId?: number;
  vendorId?: number;
}

export interface SerialConnectionState {
  isConnected: boolean;
  port: SerialPort | null;
  portInfo: SerialPortInfo | null;
  error: string | null;
}

// MAVLink message types
export interface MAVLinkMessage {
  messageId: number;
  payload: Uint8Array;
  sequence: number;
  systemId: number;
  componentId: number;
  timestamp: number;
}

export interface MAVLinkHeader {
  magic: number;
  payloadLength: number;
  incompatibilityFlags: number;
  compatibilityFlags: number;
  packetSequence: number;
  systemId: number;
  componentId: number;
  messageId: number;
}

// Common MAVLink message types
export interface HeartbeatMessage extends MAVLinkMessage {
  type: 'HEARTBEAT';
  systemType: number;
  autopilotType: number;
  baseMode: number;
  customMode: number;
  systemStatus: number;
}

export interface GPSRawIntMessage extends MAVLinkMessage {
  type: 'GPS_RAW_INT';
  timeUsec: number;
  fixType: number;
  lat: number;
  lon: number;
  alt: number;
  eph: number;
  epv: number;
  vel: number;
  cog: number;
  satellitesVisible: number;
}

export interface AttitudeMessage extends MAVLinkMessage {
  type: 'ATTITUDE';
  timeBootMs: number;
  roll: number;
  pitch: number;
  yaw: number;
  rollspeed: number;
  pitchspeed: number;
  yawspeed: number;
}

export interface UnknownMessage extends MAVLinkMessage {
  type: 'UNKNOWN';
}

export type ParsedMAVLinkMessage = HeartbeatMessage | GPSRawIntMessage | AttitudeMessage | UnknownMessage; 