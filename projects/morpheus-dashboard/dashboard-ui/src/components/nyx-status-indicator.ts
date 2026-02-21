import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { AgentStatus, StatusSize, StatusVariant } from '../types/gateway.js';

export type { AgentStatus, StatusSize, StatusVariant } from '../types/gateway.js';

/**
 * NyxStatusIndicator - A status indicator component for agent states
 * 
 * @csspart indicator - The indicator element
 * @csspart dot - The dot element
 * @csspart label - The label element
 * 
 * @property status - Current status state
 * @property size - Size of the indicator
 * @property variant - Visual style variant
 * @property label - Optional label text
 * @property showLabel - Whether to show the status label
 */
@customElement('nyx-status-indicator')
export class NyxStatusIndicator extends LitElement {
  /**
   * Current status state
   */
  @property({ type: String })
  status: AgentStatus = 'offline';

  /**
   * Size of the indicator
   */
  @property({ type: String })
  size: StatusSize = 'md';

  /**
   * Visual style variant
   */
  @property({ type: String })
  variant: StatusVariant = 'dot';

  /**
   * Custom label text (defaults to status name)
   */
  @property({ type: String })
  label?: string;

  /**
   * Whether to show the status label
   */
  @property({ type: Boolean })
  showLabel = true;

  /**
   * Whether the indicator pulses (for active states)
   */
  @property({ type: Boolean })
  pulse = false;

  private get _displayLabel(): string {
    return this.label ?? this.status;
  }

  private get _statusColor(): string {
    const colors: Record<AgentStatus, string> = {
      online: 'var(--nyx-color-accent-success)',
      offline: 'var(--nyx-color-text-muted)',
      busy: 'var(--nyx-color-accent-error)',
      idle: 'var(--nyx-color-accent-warning)',
      error: 'var(--nyx-color-accent-error)',
      connecting: 'var(--nyx-color-accent-info)',
    };
    return colors[this.status];
  }

  private get _shouldPulse(): boolean {
    if (this.pulse) return true;
    return ['online', 'connecting', 'busy'].includes(this.status);
  }

  render() {
    const classes = {
      indicator: true,
      [`size-${this.size}`]: true,
      [`variant-${this.variant}`]: true,
      [`status-${this.status}`]: true,
      pulse: this._shouldPulse,
    };

    return html`
      <div 
        class="${classMap(classes)}" 
        part="indicator"
        style="--status-color: ${this._statusColor}"
        role="status"
        aria-label="Status: ${this._displayLabel}"
      >
        <span class="dot" part="dot"></span>
        ${this.showLabel ? html`
          <span class="label" part="label">${this._displayLabel}</span>
        ` : ''}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    .indicator {
      display: inline-flex;
      align-items: center;
      gap: var(--nyx-space-2);
      font-family: var(--nyx-font-family);
    }

    .dot {
      display: inline-block;
      border-radius: var(--nyx-radius-full);
      background-color: var(--status-color);
      transition: all var(--nyx-transition-normal);
    }

    .label {
      font-size: inherit;
      font-weight: var(--nyx-font-weight-medium);
      color: var(--nyx-color-text-secondary);
      text-transform: capitalize;
    }

    /* Size variants */
    .size-sm .dot {
      width: 6px;
      height: 6px;
    }

    .size-md .dot {
      width: 8px;
      height: 8px;
    }

    .size-lg .dot {
      width: 12px;
      height: 12px;
    }

    .size-sm {
      font-size: var(--nyx-font-size-xs);
    }

    .size-md {
      font-size: var(--nyx-font-size-sm);
    }

    .size-lg {
      font-size: var(--nyx-font-size-md);
    }

    /* Variant: Dot (default) */
    .variant-dot .dot {
      box-shadow: 0 0 0 1px var(--nyx-color-bg-primary);
    }

    /* Variant: Pulse */
    .variant-pulse .dot {
      position: relative;
    }

    .variant-pulse .dot::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: var(--nyx-radius-full);
      background-color: var(--status-color);
      opacity: 0;
      animation: pulse-ring 2s ease-out infinite;
    }

    /* Variant: Badge */
    .variant-badge {
      position: relative;
      padding: var(--nyx-space-1) var(--nyx-space-2);
      padding-left: var(--nyx-space-6);
      border-radius: var(--nyx-radius-full);
      background: var(--nyx-glass-bg);
      border: 1px solid var(--nyx-glass-border);
    }

    .variant-badge .dot {
      position: absolute;
      left: var(--nyx-space-2);
    }

    .variant-badge .label {
      color: var(--nyx-color-text-primary);
    }

    /* Pulse animation for active states */
    .pulse .dot {
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.1);
      }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    /* Connecting animation */
    .status-connecting .dot {
      animation: spin 1s linear infinite;
      border-radius: 0;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Status-specific glow effects */
    .status-online .dot {
      box-shadow: 0 0 8px var(--nyx-color-accent-success);
    }

    .status-busy .dot {
      box-shadow: 0 0 8px var(--nyx-color-accent-error);
    }

    .status-error .dot {
      box-shadow: 0 0 8px var(--nyx-color-accent-error);
      animation: error-blink 1s ease-in-out infinite;
    }

    @keyframes error-blink {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'nyx-status-indicator': NyxStatusIndicator;
  }
}
