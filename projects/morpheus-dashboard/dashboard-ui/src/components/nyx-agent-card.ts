import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Agent } from '../types/gateway.js';

// Agent emoji mappings
const AGENT_EMOJIS: Record<string, string> = {
  'research-user': '🔍',
  'research-market': '📊',
  'ux-designer': '🎨',
  'ui-designer': '🖼️',
  'prototyper': '📐',
  'content-designer': '✍️',
  'design-ops': '⚙️',
  'dev-handoff': '📤',
  'presenter': '🎭',
  'software-architect': '🏛️',
  'frontend-dev': '💻',
  'backend-dev': '⚡',
  'fullstack-dev': '🔗',
  'mobile-dev': '📱',
  'devops-engineer': '🚀',
  'qa-engineer': '🔬',
  'security-engineer': '🛡️',
  'database-engineer': '🗄️',
  'iot-engineer': '🔌',
  'hardware-designer': '🔧',
  'systems-integrator': '🔀'
};

// Manga nickname mappings
const MANGA_NAMES: Record<string, string> = {
  'research-user': 'Chise',
  'research-market': 'Shikamaru',
  'ux-designer': 'Yor',
  'ui-designer': 'Faye',
  'prototyper': 'Ed',
  'content-designer': 'Misa',
  'design-ops': 'Levi',
  'dev-handoff': 'Robin',
  'presenter': 'Loid',
  'software-architect': 'Armin',
  'frontend-dev': 'Killua',
  'backend-dev': 'Gojo',
  'fullstack-dev': 'Gon',
  'mobile-dev': 'Kaneda',
  'devops-engineer': 'Roy Mustang',
  'qa-engineer': 'Kurapika',
  'security-engineer': 'Motoko',
  'database-engineer': 'Index',
  'iot-engineer': 'Senku',
  'hardware-designer': 'Winry',
  'systems-integrator': 'Togusa'
};

@customElement('nyx-agent-card')
export class NyxAgentCard extends LitElement {
  @property({ type: Object }) agent!: Agent;
  @state() private isSpawning = false;

  static styles = css`
    :host { display: block; }
    
    .agent-card {
      position: relative;
      padding: 1.25rem;
      background: rgba(18, 18, 26, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 255, 65, 0.1);
      border-radius: 12px;
      transition: all 250ms ease;
      cursor: pointer;
    }
    
    .agent-card:hover {
      transform: translateY(-2px);
      border-color: rgba(0, 255, 65, 0.3);
      box-shadow: 0 0 30px rgba(0, 255, 65, 0.15);
    }
    
    .agent-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00ff41, transparent);
      opacity: 0;
      transition: opacity 250ms;
    }
    
    .agent-card:hover::before {
      opacity: 1;
    }
    
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(0, 255, 65, 0.1);
      border: 1px solid rgba(0, 255, 65, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .info {
      margin-bottom: 1rem;
    }
    
    .name {
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
      margin: 0 0 0.25rem 0;
    }
    
    .manga-name {
      font-size: 0.875rem;
      color: #00ff41;
      font-family: 'JetBrains Mono', monospace;
      margin: 0;
    }
    
    .type {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }
    
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    
    .spawn-btn {
      flex: 1;
      padding: 0.5rem 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background: transparent;
      border: 1px solid #00ff41;
      color: #00ff41;
      border-radius: 4px;
      cursor: pointer;
      transition: all 150ms ease;
    }
    
    .spawn-btn:hover:not(:disabled) {
      background: #00ff41;
      color: #050508;
      box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
    }
    
    .spawn-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #050508;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  private handleSpawn(e: Event) {
    e.stopPropagation();
    this.isSpawning = true;
    // Dispatch spawn event
    this.dispatchEvent(new CustomEvent('spawn-agent', {
      detail: { agentId: this.agent.id },
      bubbles: true,
      composed: true
    }));
    setTimeout(() => this.isSpawning = false, 2000);
  }

  render() {
    const mangaName = MANGA_NAMES[this.agent.id] || this.agent.name;
    const emoji = AGENT_EMOJIS[this.agent.id] || '🤖';
    
    return html`
      <div class="agent-card">
        <div class="header">
          <div class="avatar">${emoji}</div>
          <nyx-status-indicator .status=${this.agent.state}></nyx-status-indicator>
        </div>
        <div class="info">
          <h3 class="name">${this.agent.name}</h3>
          <p class="manga-name">${mangaName}</p>
          <span class="type">${this.agent.type}</span>
        </div>
        <div class="footer">
          <button 
            class="spawn-btn" 
            @click=${this.handleSpawn}
            ?disabled=${this.isSpawning || this.agent.state === 'online'}
          >
            ${this.isSpawning 
              ? html`<span class="spinner"></span>` 
              : this.agent.state === 'online' ? 'RUNNING' : 'SPAWN'}
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nyx-agent-card': NyxAgentCard;
  }
}
