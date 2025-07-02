import type { SerialPortInfo, SerialConnectionState, ParsedMAVLinkMessage } from '../types/serial';
import { MAVLinkParser } from './mavlinkParser';

export class SerialManager {
  private connectionState: SerialConnectionState = {
    isConnected: false,
    port: null,
    portInfo: null,
    error: null
  };
  
  private mavlinkParser: MAVLinkParser;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private reading = false;
  private onMessageCallback: ((message: ParsedMAVLinkMessage) => void) | null = null;
  private onStateChangeCallback: ((state: SerialConnectionState) => void) | null = null;

  constructor() {
    this.mavlinkParser = new MAVLinkParser();
  }

  /**
   * Check if Web Serial API is supported
   */
  public isSupported(): boolean {
    return 'serial' in navigator;
  }

  /**
   * Request user to select a serial port
   */
  public async requestPort(): Promise<SerialPortInfo | null> {
    try {
      if (!this.isSupported()) {
        throw new Error('Web Serial API is not supported in this browser');
      }

      const port = await navigator.serial.requestPort();
      const portInfo = await this.getPortInfo(port);
      
      this.connectionState.port = port;
      this.connectionState.portInfo = portInfo;
      this.connectionState.error = null;
      
      this.notifyStateChange();
      return portInfo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.connectionState.error = errorMessage;
      this.notifyStateChange();
      console.error('Error requesting port:', error);
      return null;
    }
  }

  /**
   * Get information about a serial port
   */
  private async getPortInfo(port: SerialPort): Promise<SerialPortInfo> {
    // Note: getInfo() is not widely supported yet, so we'll use a basic approach
    return {
      port,
      name: 'Serial Port',
      manufacturer: undefined,
      serialNumber: undefined,
      productId: undefined,
      vendorId: undefined
    };
  }

  /**
   * Connect to the selected serial port
   */
  public async connect(baudRate: number = 115200): Promise<boolean> {
    try {
      if (!this.connectionState.port) {
        throw new Error('No port selected');
      }

      await this.connectionState.port.open({ baudRate });
      this.connectionState.isConnected = true;
      this.connectionState.error = null;
      
      this.notifyStateChange();
      this.startReading();
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.connectionState.error = errorMessage;
      this.notifyStateChange();
      console.error('Error connecting to port:', error);
      return false;
    }
  }

  /**
   * Disconnect from the serial port
   */
  public async disconnect(): Promise<void> {
    try {
      this.stopReading();
      
      if (this.connectionState.port) {
        await this.connectionState.port.close();
      }
      
      this.connectionState.isConnected = false;
      this.connectionState.port = null;
      this.connectionState.portInfo = null;
      this.connectionState.error = null;
      
      this.notifyStateChange();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  /**
   * Start reading data from the serial port
   */
  private async startReading(): Promise<void> {
    if (!this.connectionState.port || !this.connectionState.port.readable) {
      return;
    }

    this.reading = true;
    this.reader = this.connectionState.port.readable.getReader();

    try {
      while (this.reading) {
        const { value, done } = await this.reader.read();
        
        if (done) {
          break;
        }

        if (value) {
          this.processIncomingData(value);
        }
      }
    } catch (error) {
      console.error('Error reading from serial port:', error);
      this.connectionState.error = 'Read error: ' + (error instanceof Error ? error.message : 'Unknown error');
      this.notifyStateChange();
    } finally {
      if (this.reader) {
        this.reader.releaseLock();
        this.reader = null;
      }
    }
  }

  /**
   * Stop reading data from the serial port
   */
  private stopReading(): void {
    this.reading = false;
    if (this.reader) {
      this.reader.cancel();
      this.reader.releaseLock();
      this.reader = null;
    }
  }

  /**
   * Process incoming data and parse MAVLink messages
   */
  private processIncomingData(data: Uint8Array): void {
    const messages = this.mavlinkParser.addData(data);
    
    messages.forEach(message => {
      if (this.onMessageCallback) {
        this.onMessageCallback(message);
      }
    });
  }

  /**
   * Write data to the serial port
   */
  public async writeData(data: Uint8Array): Promise<boolean> {
    try {
      if (!this.connectionState.port || !this.connectionState.port.writable) {
        throw new Error('Port not connected or not writable');
      }

      const writer = this.connectionState.port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      
      return true;
    } catch (error) {
      console.error('Error writing to serial port:', error);
      return false;
    }
  }

  /**
   * Set callback for when MAVLink messages are received
   */
  public onMessage(callback: (message: ParsedMAVLinkMessage) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * Set callback for when connection state changes
   */
  public onStateChange(callback: (state: SerialConnectionState) => void): void {
    this.onStateChangeCallback = callback;
  }

  /**
   * Notify state change callback
   */
  private notifyStateChange(): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ ...this.connectionState });
    }
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): SerialConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Get MAVLink parser statistics
   */
  public getParserStats() {
    return this.mavlinkParser.getStats();
  }

  /**
   * Clear parser buffer
   */
  public clearParser(): void {
    this.mavlinkParser.clear();
  }
} 