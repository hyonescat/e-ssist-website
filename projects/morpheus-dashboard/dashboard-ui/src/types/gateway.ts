/**
 * Gateway Types
 * 
 * Shared type definitions for the Nyx Gateway Dashboard
 */

// Agent Status Types
export type AgentStatus = 'online' | 'offline' | 'busy' | 'idle' | 'error' | 'connecting';

// Status Indicator Types
export type StatusSize = 'sm' | 'md' | 'lg';
export type StatusVariant = 'dot' | 'pulse' | 'badge';

// Glass Card Types
export type GlassCardVariant = 'default' | 'elevated' | 'outlined' | 'glow';
export type GlassCardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Button Types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: string;
  state: AgentStatus;
  status?: string;
  capabilities: string[];
  metadata: Record<string, unknown>;
  lastSeen: Date;
  createdAt: Date;
}

export interface AgentMetrics {
  messagesProcessed: number;
  errors: number;
  uptime: number;
  memoryUsage: number;
}

// Gateway Types
export interface GatewayInfo {
  version: string;
  uptime: number;
  connectedAgents: number;
  totalMessages: number;
}

export interface GatewayHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: Date;
}

// Connection Types
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface ConnectionOptions {
  url: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// Gateway Message Types
export interface GatewayMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  agentId?: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  capabilities?: string[];
  metadata?: Record<string, unknown>;
  enabled?: boolean;
}

// Log Types
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'success';
  message: string;
  source?: string;
  agentId?: string;
  metadata?: Record<string, unknown>;
}
