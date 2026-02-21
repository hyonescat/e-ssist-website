import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { Agent } from '../types/gateway.js';
import './nyx-agent-card.js';
import './nyx-glass-card.js';

@customElement('nyx-agent-roster')
export class NyxAgentRoster extends LitElement {
  @state() private agents: Agent[] = [];
  @state() private filter: string = 'all';
  @state() private search: string = '';
  @state() private isLoading = true;

  static styles = css`
    :host { display: block; }
    
    .roster-container {
      padding: 1.5rem;
    }
    
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .header span {
      color: #00ff41;
    }
    
    .controls {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    
    .search-input {
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: #fff;
      font-size: 0.875rem;
      width: 200px;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #00ff41;
    }
    
    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    
    .filter-btn {
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.75rem;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 150ms ease;
    }
    
    .filter-btn:hover, .filter-btn.active {
      border-color: #00ff41;
      color: #00ff41;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    
    .loading {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .empty {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.5);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadAgents();
  }

  private async loadAgents() {
    // Mock agents for demo
    this.agents = [
      { id: 'research-user', name: 'Research User', type: 'research', state: 'idle', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
      { id: 'ui-designer', name: 'UI Designer', type: 'creative', state: 'online', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
      { id: 'frontend-dev', name: 'Frontend Dev', type: 'coding', state: 'idle', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
      { id: 'backend-dev', name: 'Backend Dev', type: 'coding', state: 'idle', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
      { id: 'software-architect', name: 'Software Architect', type: 'system', state: 'idle', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
      { id: 'fullstack-dev', name: 'Fullstack Dev', type: 'coding', state: 'online', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
      { id: 'qa-engineer', name: 'QA Engineer', type: 'analysis', state: 'idle', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
      { id: 'devops-engineer', name: 'DevOps Engineer', type: 'system', state: 'idle', capabilities: [], metadata: {}, lastSeen: new Date(), createdAt: new Date() },
    ];
    this.isLoading = false;
  }

  private get filteredAgents() {
    let filtered = this.agents;
    
    if (this.filter !== 'all') {
      filtered = filtered.filter(a => a.state === this.filter);
    }
    
    if (this.search) {
      const search = this.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search) ||
        a.id.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }

  render() {
    return html`
      <div class="roster-container">
        <div class="header">
          <h2>Agent Roster <span>(${this.agents.length})</span></h2>
          <div class="controls">
            <input 
              class="search-input"
              type="text" 
              placeholder="Search agents..."
              .value=${this.search}
              @input=${(e: InputEvent) => this.search = (e.target as HTMLInputElement).value}
            />
            <button 
              class="filter-btn ${this.filter === 'all' ? 'active' : ''}"
              @click=${() => this.filter = 'all'}
            >All</button>
            <button 
              class="filter-btn ${this.filter === 'online' ? 'active' : ''}"
              @click=${() => this.filter = 'online'}
            >Active</button>
          </div>
        </div>
        
        ${this.isLoading 
          ? html`<div class="loading">Loading agents...</div>`
          : html`
            <div class="grid">
              ${this.filteredAgents.map(agent => html`
                <nyx-agent-card .agent=${agent}></nyx-agent-card>
              `)}
            </div>
            ${this.filteredAgents.length === 0 
              ? html`<div class="empty">No agents found</div>` 
              : ''}
          `
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nyx-agent-roster': NyxAgentRoster;
  }
}
