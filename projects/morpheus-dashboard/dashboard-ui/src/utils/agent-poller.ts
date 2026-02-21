/**
 * Agent Status Polling
 * 
 * Handles polling for agent status updates with configurable intervals,
 * caching, and automatic cleanup.
 */

import { gatewayApi, GatewayApiClient } from './api-client.js';

export type AgentState = 'online' | 'offline' | 'busy' | 'idle' | 'error';

export interface Agent {
  id: string;
  name: string;
  type: string;
  state: AgentState;
  lastSeen: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentStatusResponse {
  agents: Agent[];
  total: number;
  timestamp: number;
}

export interface PollingConfig {
  interval?: number;
  enabled?: boolean;
  retryOnError?: boolean;
  errorRetryInterval?: number;
  maxRetries?: number;
}

type StatusCallback = (agents: Agent[], error?: Error) => void;
type AgentUpdateCallback = (agent: Agent) => void;

export class AgentStatusPoller {
  private config: Required<PollingConfig>;
  private api: GatewayApiClient;
  private timer?: number;
  private isRunning = false;
  private retryCount = 0;
  private lastData?: AgentStatusResponse;
  private cachedAgents = new Map<string, Agent>();
  
  private statusCallbacks = new Set<StatusCallback>();
  private updateCallbacks = new Set<AgentUpdateCallback>();
  private agentSpecificCallbacks = new Map<string, Set<AgentUpdateCallback>>();

  constructor(
    config: PollingConfig = {},
    api: GatewayApiClient = gatewayApi
  ) {
    this.config = {
      interval: 5000,
      enabled: true,
      retryOnError: true,
      errorRetryInterval: 10000,
      maxRetries: 5,
      ...config,
    };
    this.api = api;
  }

  /**
   * Start polling for agent status
   */
  start(): void {
    if (this.isRunning || !this.config.enabled) {
      return;
    }

    this.isRunning = true;
    this.retryCount = 0;
    this.poll();
  }

  /**
   * Stop polling
   */
  stop(): void {
    this.isRunning = false;
    this.clearTimer();
  }

  /**
   * Force an immediate status check
   */
  async refresh(): Promise<Agent[]> {
    return this.poll();
  }

  /**
   * Get the last known agent status
   */
  getLastStatus(): Agent[] | undefined {
    return this.lastData?.agents;
  }

  /**
   * Get a specific agent by ID
   */
  getAgent(id: string): Agent | undefined {
    return this.cachedAgents.get(id);
  }

  /**
   * Subscribe to all status updates
   */
  onStatusUpdate(callback: StatusCallback): () => void {
    this.statusCallbacks.add(callback);
    
    // Immediately call with cached data if available
    if (this.lastData) {
      callback(this.lastData.agents);
    }
    
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to individual agent updates
   */
  onAgentUpdate(callback: AgentUpdateCallback): () => void {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  /**
   * Subscribe to updates for a specific agent
   */
  onAgent(id: string, callback: AgentUpdateCallback): () => void {
    if (!this.agentSpecificCallbacks.has(id)) {
      this.agentSpecificCallbacks.set(id, new Set());
    }
    
    this.agentSpecificCallbacks.get(id)!.add(callback);
    
    // Immediately call with cached data if available
    const agent = this.cachedAgents.get(id);
    if (agent) {
      callback(agent);
    }
    
    return () => {
      this.agentSpecificCallbacks.get(id)?.delete(callback);
    };
  }

  /**
   * Update polling configuration
   */
  setConfig(config: Partial<PollingConfig>): void {
    const wasRunning = this.isRunning;
    
    this.stop();
    this.config = { ...this.config, ...config };
    
    if (wasRunning && this.config.enabled) {
      this.start();
    }
  }

  private async poll(): Promise<Agent[]> {
    if (!this.isRunning) {
      return [];
    }

    try {
      const response = await this.api.get<AgentStatusResponse>('/api/agents/status');
      const data = response.data;
      
      // Process and cache agents
      const agents = data.agents.map(agent => ({
        ...agent,
        lastSeen: new Date(agent.lastSeen),
      }));
      
      // Detect changes
      const changes = this.detectChanges(agents);
      
      // Update cache
      this.cachedAgents.clear();
      agents.forEach(agent => this.cachedAgents.set(agent.id, agent));
      
      this.lastData = {
        ...data,
        agents,
      };
      
      // Reset retry count on success
      this.retryCount = 0;
      
      // Notify subscribers
      this.notifyStatusUpdate(agents);
      changes.forEach(change => this.notifyAgentUpdate(change));
      
      // Schedule next poll
      this.scheduleNext();
      
      return agents;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  private detectChanges(newAgents: Agent[]): Agent[] {
    const changes: Agent[] = [];
    
    for (const agent of newAgents) {
      const cached = this.cachedAgents.get(agent.id);
      
      if (!cached || 
          cached.state !== agent.state ||
          cached.name !== agent.name) {
        changes.push(agent);
      }
    }
    
    // Check for removed agents
    for (const [id, cached] of this.cachedAgents) {
      if (!newAgents.find(a => a.id === id)) {
        changes.push({ ...cached, state: 'offline' as AgentState });
      }
    }
    
    return changes;
  }

  private handleError(error: Error): void {
    console.error('[AgentStatusPoller] Polling error:', error);
    
    // Notify error subscribers
    this.statusCallbacks.forEach(callback => {
      try {
        callback(this.lastData?.agents ?? [], error);
      } catch (e) {
        console.error('[AgentStatusPoller] Error in status callback:', e);
      }
    });
    
    // Retry logic
    if (this.config.retryOnError && this.retryCount < this.config.maxRetries) {
      this.retryCount++;
      this.scheduleNext(this.config.errorRetryInterval);
    } else {
      this.stop();
    }
  }

  private scheduleNext(interval: number = this.config.interval): void {
    if (!this.isRunning) return;
    
    this.clearTimer();
    this.timer = window.setTimeout(() => this.poll(), interval);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private notifyStatusUpdate(agents: Agent[]): void {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(agents);
      } catch (error) {
        console.error('[AgentStatusPoller] Error in status callback:', error);
      }
    });
  }

  private notifyAgentUpdate(agent: Agent): void {
    // Notify generic update handlers
    this.updateCallbacks.forEach(callback => {
      try {
        callback(agent);
      } catch (error) {
        console.error('[AgentStatusPoller] Error in update callback:', error);
      }
    });
    
    // Notify agent-specific handlers
    const specificHandlers = this.agentSpecificCallbacks.get(agent.id);
    specificHandlers?.forEach(callback => {
      try {
        callback(agent);
      } catch (error) {
        console.error('[AgentStatusPoller] Error in agent callback:', error);
      }
    });
  }
}

// Create singleton instance
export const agentPoller = new AgentStatusPoller();
