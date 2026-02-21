import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { LogEntry } from '../types/gateway.js';
import './nyx-glass-card.js';

@customElement('nyx-activity-log')
export class NyxActivityLog extends LitElement {
  @state() private entries: LogEntry[] = [];
  @state() private isAutoScroll = true;

  static styles = css`
    :host { 
      display: block;
      height: 100%;
    }
    
    .log-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 1.25rem;
      background: rgba(18, 18, 26, 0.4);
      backdrop-filter: blur(12px);
      border-left: 1px solid rgba(0, 255, 65, 0.1);
    }
    
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    h3 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .autoscroll-toggle {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .autoscroll-toggle.active {
      color: #00ff41;
      border-color: #00ff41;
    }
    
    .log-entries {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
    }
    
    .log-entry {
      display: flex;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.02);
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    .timestamp {
      color: rgba(255, 255, 255, 0.4);
      flex-shrink: 0;
    }
    
    .level {
      flex-shrink: 0;
      width: 3rem;
      text-transform: uppercase;
      font-size: 0.625rem;
      font-weight: 600;
    }
    
    .level.info { color: #00ccff; }
    .level.warn { color: #ffaa00; }
    .level.error { color: #ff3333; }
    .level.debug { color: #666; }
    .level.success { color: #00ff41; }
    
    .message {
      color: rgba(255, 255, 255, 0.8);
      word-break: break-word;
    }
    
    .empty {
      color: rgba(255, 255, 255, 0.3);
      text-align: center;
      padding: 2rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Add sample entries
    this.entries = [
      { id: '1', timestamp: new Date(), level: 'info', message: 'Nyx Dashboard initialized' },
      { id: '2', timestamp: new Date(), level: 'success', message: 'Pixel 🎨 completed design system' },
      { id: '3', timestamp: new Date(), level: 'success', message: 'Keystone 🏛️ completed architecture' },
      { id: '4', timestamp: new Date(), level: 'info', message: 'Connected to Gateway ws://localhost:18789' },
    ];
  }

  private formatTime(timestamp: string | Date): string {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  render() {
    return html`
      <div class="log-container">
        <div class="header">
          <h3>Activity Log</h3>
          <button 
            class="autoscroll-toggle ${this.isAutoScroll ? 'active' : ''}"
            @click=${() => this.isAutoScroll = !this.isAutoScroll}
          >
            Auto-scroll
          </button>
        </div>
        <div class="log-entries">
          ${this.entries.length === 0 
            ? html`<div class="empty">No activity yet...</div>`
            : this.entries.map(entry => html`
              <div class="log-entry">
                <span class="timestamp">${this.formatTime(entry.timestamp)}</span>
                <span class="level ${entry.level}">${entry.level}</span>
                <span class="message">${entry.message}</span>
              </div>
            `)
          }
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nyx-activity-log': NyxActivityLog;
  }
}
