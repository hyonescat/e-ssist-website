/**
 * WebSocket Connection Manager
 * 
 * Manages WebSocket connections with automatic reconnection,
 * heartbeat/ping-pong, and event handling.
 */

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string | object;
  autoConnect?: boolean;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

type MessageHandler<T = unknown> = (message: T) => void;
type StateChangeHandler = (state: ConnectionState) => void;

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private reconnectAttempts = 0;
  private reconnectTimer?: number;
  private heartbeatTimer?: number;
  private state: ConnectionState = 'disconnected';
  
  private messageHandlers = new Map<string, Set<MessageHandler>>();
  private stateChangeHandlers = new Set<StateChangeHandler>();
  private genericMessageHandlers = new Set<MessageHandler>();

  constructor(config: WebSocketConfig) {
    this.config = {
      protocols: [],
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      heartbeatMessage: { type: 'ping' },
      autoConnect: true,
      ...config,
    };

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  /**
   * Current connection state
   */
  get connectionState(): ConnectionState {
    return this.state;
  }

  /**
   * Whether the connection is currently open
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): void {
    if (this.isConnected) {
      return;
    }

    this.setState('connecting');

    try {
      const protocols = Array.isArray(this.config.protocols) 
        ? this.config.protocols 
        : this.config.protocols ? [this.config.protocols] : [];

      this.ws = new WebSocket(this.config.url, protocols);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      this.setState('error');
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    this.clearTimers();
    this.reconnectAttempts = 0;
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.setState('disconnected');
  }

  /**
   * Send a message to the server
   */
  send<T>(type: string, payload: T): void;
  send(message: string | object): void;
  send<T>(typeOrMessage: string | object, payload?: T): void {
    if (!this.isConnected) {
      console.warn('[WebSocketManager] Cannot send message: not connected');
      return;
    }

    let message: string;
    
    if (typeof typeOrMessage === 'string' && payload !== undefined) {
      message = JSON.stringify({ type: typeOrMessage, payload, timestamp: Date.now() });
    } else if (typeof typeOrMessage === 'object') {
      message = JSON.stringify(typeOrMessage);
    } else {
      message = typeOrMessage as string;
    }

    this.ws!.send(message);
  }

  /**
   * Subscribe to messages of a specific type
   */
  on<T>(type: string, handler: MessageHandler<T>): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    
    this.messageHandlers.get(type)!.add(handler as MessageHandler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(type)?.delete(handler as MessageHandler);
    };
  }

  /**
   * Subscribe to all messages
   */
  onMessage<T>(handler: MessageHandler<T>): () => void {
    this.genericMessageHandlers.add(handler as MessageHandler);
    
    return () => {
      this.genericMessageHandlers.delete(handler as MessageHandler);
    };
  }

  /**
   * Subscribe to connection state changes
   */
  onStateChange(handler: StateChangeHandler): () => void {
    this.stateChangeHandlers.add(handler);
    
    // Immediately call with current state
    handler(this.state);
    
    return () => {
      this.stateChangeHandlers.delete(handler);
    };
  }

  private setState(state: ConnectionState): void {
    if (this.state !== state) {
      this.state = state;
      this.stateChangeHandlers.forEach(handler => handler(state));
    }
  }

  private handleOpen(): void {
    this.setState('connected');
    this.reconnectAttempts = 0;
    this.startHeartbeat();
  }

  private handleClose(event: CloseEvent): void {
    this.clearTimers();
    
    if (event.wasClean) {
      this.setState('disconnected');
    } else {
      this.setState('disconnected');
      this.scheduleReconnect();
    }
  }

  private handleMessage(event: MessageEvent): void {
    let data: unknown;
    
    try {
      data = JSON.parse(event.data);
    } catch {
      data = event.data;
    }

    // Notify generic handlers
    this.genericMessageHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('[WebSocketManager] Error in message handler:', error);
      }
    });

    // Notify type-specific handlers
    if (data && typeof data === 'object' && 'type' in data) {
      const typedMessage = data as WebSocketMessage;
      const handlers = this.messageHandlers.get(typedMessage.type);
      
      handlers?.forEach(handler => {
        try {
          handler(typedMessage.payload);
        } catch (error) {
          console.error(`[WebSocketManager] Error in handler for type '${typedMessage.type}':`, error);
        }
      });
    }
  }

  private handleError(event: Event): void {
    this.setState('error');
    console.error('[WebSocketManager] WebSocket error:', event);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('[WebSocketManager] Max reconnection attempts reached');
      return;
    }

    this.setState('reconnecting');
    this.reconnectAttempts++;

    this.reconnectTimer = window.setTimeout(() => {
      console.log(`[WebSocketManager] Reconnecting (attempt ${this.reconnectAttempts})...`);
      this.connect();
    }, this.config.reconnectInterval);
  }

  private startHeartbeat(): void {
    if (this.config.heartbeatInterval <= 0) return;

    this.heartbeatTimer = window.setInterval(() => {
      if (this.isConnected) {
        const message = typeof this.config.heartbeatMessage === 'object'
          ? JSON.stringify(this.config.heartbeatMessage)
          : this.config.heartbeatMessage;
        this.ws!.send(message);
      }
    }, this.config.heartbeatInterval);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }
}

// Factory function for creating Gateway WebSocket connections
export function createGatewayWebSocket(gatewayUrl: string): WebSocketManager {
  // Convert http/https to ws/wss
  const wsUrl = gatewayUrl.replace(/^http/, 'ws') + '/ws';
  
  return new WebSocketManager({
    url: wsUrl,
    heartbeatInterval: 30000,
    reconnectInterval: 5000,
    maxReconnectAttempts: 20,
  });
}
