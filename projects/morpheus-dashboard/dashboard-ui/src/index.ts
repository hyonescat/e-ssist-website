// Type exports
export type {
  AgentStatus,
  StatusSize,
  StatusVariant,
  GlassCardVariant,
  GlassCardPadding,
  ButtonVariant,
  ButtonSize,
  Agent,
  AgentMetrics,
  GatewayInfo,
  GatewayHealth,
  LogEntry,
  ConnectionState,
} from './types/gateway.js';

// Component exports
export { NyxGlassCard } from './components/nyx-glass-card.js';
export { NyxButton } from './components/nyx-button.js';
export { NyxStatusIndicator } from './components/nyx-status-indicator.js';
export { NyxAgentCard } from './components/nyx-agent-card.js';
export { NyxAgentRoster } from './components/nyx-agent-roster.js';
export { NyxActivityLog } from './components/nyx-activity-log.js';
export { NyxDashboard } from './components/nyx-dashboard.js';

// Utility exports
export { 
  GatewayApiClient, 
  GatewayApiError, 
  gatewayApi,
  type ApiConfig,
  type ApiResponse,
  type ApiError 
} from './utils/api-client.js';

export { 
  WebSocketManager, 
  createGatewayWebSocket,
  type ConnectionState as WSConnectionState,
  type WebSocketConfig,
  type WebSocketMessage 
} from './utils/websocket-manager.js';

export { 
  AgentStatusPoller, 
  agentPoller,
  type PollingConfig 
} from './utils/agent-poller.js';

// Import and register all components
import './components/nyx-glass-card.js';
import './components/nyx-button.js';
import './components/nyx-status-indicator.js';
import './components/nyx-agent-card.js';
import './components/nyx-agent-roster.js';
import './components/nyx-activity-log.js';
import './components/nyx-dashboard.js';
