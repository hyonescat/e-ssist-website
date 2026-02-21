import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// Import all components
import './components/nyx-glass-card.js';
import './components/nyx-button.js';
import './components/nyx-status-indicator.js';
import './components/nyx-agent-card.js';
import './components/nyx-agent-roster.js';
import './components/nyx-activity-log.js';
import './components/nyx-dashboard.js';

@customElement('component-playground')
export class ComponentPlayground extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <section class="component-section">
        <h2>Dashboard Preview</h2>
        <div style="height: 600px; border: 1px solid rgba(0,255,65,0.2); border-radius: 8px; overflow: hidden;">
          <nyx-dashboard></nyx-dashboard>
        </div>
      </section>

      <section class="component-section">
        <h2>Glass Cards</h2>
        <div class="component-grid">
          <nyx-glass-card>
            <h3>Default Card</h3>
            <p>A standard glassmorphism card with default styling.</p>
          </nyx-glass-card>
          
          <nyx-glass-card variant="elevated">
            <h3>Elevated Card</h3>
            <p>A card with enhanced elevation and glow effects.</p>
          </nyx-glass-card>
          
          <nyx-glass-card variant="outlined" borderColor="var(--nyx-color-accent-primary)">
            <h3>Outlined Card</h3>
            <p>A transparent card with accent border.</p>
          </nyx-glass-card>
          
          <nyx-glass-card variant="glow" interactive>
            <h3>Glow Card (Interactive)</h3>
            <p>Hover over this card to see the interactive effect.</p>
          </nyx-glass-card>
        </div>
      </section>

      <section class="component-section">
        <h2>Buttons</h2>
        <nyx-glass-card>
          <div class="demo-item">
            <label>Variants</label>
            <div class="button-row">
              <nyx-button variant="primary">Primary</nyx-button>
              <nyx-button variant="secondary">Secondary</nyx-button>
              <nyx-button variant="ghost">Ghost</nyx-button>
              <nyx-button variant="danger">Danger</nyx-button>
              <nyx-button variant="success">Success</nyx-button>
            </div>
          </div>
          
          <div class="demo-item" style="margin-top: var(--nyx-space-6);">
            <label>Sizes</label>
            <div class="button-row">
              <nyx-button size="sm" variant="primary">Small</nyx-button>
              <nyx-button size="md" variant="primary">Medium</nyx-button>
              <nyx-button size="lg" variant="primary">Large</nyx-button>
            </div>
          </div>
          
          <div class="demo-item" style="margin-top: var(--nyx-space-6);">
            <label>States</label>
            <div class="button-row">
              <nyx-button variant="primary">Normal</nyx-button>
              <nyx-button variant="primary" disabled>Disabled</nyx-button>
              <nyx-button variant="primary" loading>Loading</nyx-button>
            </div>
          </div>
        </nyx-glass-card>
      </section>

      <section class="component-section">
        <h2>Status Indicators</h2>
        <nyx-glass-card>
          <div class="demo-item">
            <label>All States</label>
            <div class="status-row">
              <nyx-status-indicator status="online"></nyx-status-indicator>
              <nyx-status-indicator status="offline"></nyx-status-indicator>
              <nyx-status-indicator status="busy"></nyx-status-indicator>
              <nyx-status-indicator status="idle"></nyx-status-indicator>
              <nyx-status-indicator status="error"></nyx-status-indicator>
              <nyx-status-indicator status="connecting"></nyx-status-indicator>
            </div>
          </div>
          
          <div class="demo-item" style="margin-top: var(--nyx-space-6);">
            <label>Sizes</label>
            <div class="status-row">
              <nyx-status-indicator status="online" size="sm"></nyx-status-indicator>
              <nyx-status-indicator status="online" size="md"></nyx-status-indicator>
              <nyx-status-indicator status="online" size="lg"></nyx-status-indicator>
            </div>
          </div>
        </nyx-glass-card>
      </section>

      <section class="component-section">
        <h2>Agent Roster</h2>
        <nyx-glass-card>
          <nyx-agent-roster></nyx-agent-roster>
        </nyx-glass-card>
      </section>

      <section class="component-section">
        <h2>Activity Log</h2>
        <nyx-glass-card style="height: 300px;">
          <nyx-activity-log></nyx-activity-log>
        </nyx-glass-card>
      </section>

      <section class="component-section">
        <h2>Design Tokens Preview</h2>
        <nyx-glass-card>
          <div class="token-preview">
            <div class="color-swatch">
              <div class="color-box" style="background: var(--nyx-color-bg-primary);"></div>
              <span class="color-label">--bg-primary</span>
            </div>
            <div class="color-swatch">
              <div class="color-box" style="background: var(--nyx-color-bg-secondary);"></div>
              <span class="color-label">--bg-secondary</span>
            </div>
            <div class="color-swatch">
              <div class="color-box" style="background: var(--nyx-color-accent-primary);"></div>
              <span class="color-label">--accent-primary</span>
            </div>
            <div class="color-swatch">
              <div class="color-box" style="background: var(--nyx-color-accent-secondary);"></div>
              <span class="color-label">--accent-secondary</span>
            </div>
            <div class="color-swatch">
              <div class="color-box" style="background: var(--nyx-color-accent-success);"></div>
              <span class="color-label">--accent-success</span>
            </div>
            <div class="color-swatch">
              <div class="color-box" style="background: var(--nyx-color-accent-error);"></div>
              <span class="color-label">--accent-error</span>
            </div>
          </div>
        </nyx-glass-card>
      </section>
    `;
  }
}

// Mount to playground
const playground = document.getElementById('playground');
if (playground) {
  playground.innerHTML = '<component-playground></component-playground>';
}
