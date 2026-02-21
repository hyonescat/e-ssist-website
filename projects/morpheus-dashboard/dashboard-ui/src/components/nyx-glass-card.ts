import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { GlassCardVariant, GlassCardPadding } from '../types/gateway.js';

export type { GlassCardVariant, GlassCardPadding } from '../types/gateway.js';

/**
 * NyxGlassCard - A glassmorphism card component
 * 
 * @slot - Default slot for card content
 * @slot header - Header content area
 * @slot footer - Footer content area
 * 
 * @csspart card - The card container element
 * @csspart header - The header container
 * @csspart content - The content container
 * @csspart footer - The footer container
 */
@customElement('nyx-glass-card')
export class NyxGlassCard extends LitElement {
  /**
   * Visual variant of the card
   */
  @property({ type: String })
  variant: GlassCardVariant = 'default';

  /**
   * Padding size inside the card
   */
  @property({ type: String })
  padding: GlassCardPadding = 'md';

  /**
   * Whether the card has interactive hover states
   */
  @property({ type: Boolean })
  interactive = false;

  /**
   * Whether the card is currently loading
   */
  @property({ type: Boolean })
  loading = false;

  /**
   * Custom border color (CSS variable or value)
   */
  @property({ type: String })
  borderColor?: string;

  render() {
    const classes = {
      card: true,
      [`variant-${this.variant}`]: true,
      [`padding-${this.padding}`]: true,
      interactive: this.interactive,
      loading: this.loading,
    };

    const styles = this.borderColor 
      ? html`<style>:host { --card-border-color: ${this.borderColor}; }</style>`
      : '';

    return html`
      ${styles}
      <div class="${classMap(classes)}" part="card">
        <div class="header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="content" part="content">
          ${this.loading 
            ? html`<div class="shimmer-overlay"></div>` 
            : ''}
          <slot></slot>
        </div>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --card-border-color: var(--nyx-glass-border);
      --card-bg: var(--nyx-glass-bg);
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      backdrop-filter: var(--nyx-glass-blur) var(--nyx-glass-backdrop);
      -webkit-backdrop-filter: var(--nyx-glass-blur) var(--nyx-glass-backdrop);
      border: 1px solid var(--card-border-color);
      border-radius: var(--nyx-radius-lg);
      box-shadow: var(--nyx-shadow-md);
      transition: all var(--nyx-transition-normal);
      overflow: hidden;
    }

    /* Variants */
    .variant-default {
      background: var(--nyx-glass-bg);
    }

    .variant-elevated {
      background: var(--nyx-color-bg-elevated);
      box-shadow: var(--nyx-shadow-lg), var(--nyx-shadow-glow);
    }

    .variant-outlined {
      background: transparent;
      border: 2px solid var(--card-border-color);
      box-shadow: none;
    }

    .variant-glow {
      background: var(--nyx-glass-bg);
      box-shadow: var(--nyx-shadow-lg), var(--nyx-glow-primary);
    }

    /* Padding variants */
    .padding-none .content {
      padding: 0;
    }

    .padding-sm .content {
      padding: var(--nyx-space-2);
    }

    .padding-md .content {
      padding: var(--nyx-space-4);
    }

    .padding-lg .content {
      padding: var(--nyx-space-6);
    }

    .padding-xl .content {
      padding: var(--nyx-space-8);
    }

    /* Header and Footer */
    .header {
      flex-shrink: 0;
    }

    .header ::slotted(*:first-child) {
      margin-top: 0;
    }

    .content {
      flex: 1;
      position: relative;
    }

    .footer {
      flex-shrink: 0;
    }

    /* Interactive states */
    .interactive {
      cursor: pointer;
    }

    .interactive:hover {
      background: var(--nyx-glass-bg-hover);
      border-color: var(--nyx-glass-border-hover);
      transform: translateY(-2px);
      box-shadow: var(--nyx-shadow-lg);
    }

    .interactive:active {
      background: var(--nyx-glass-bg-active);
      border-color: var(--nyx-glass-border-active);
      transform: translateY(0);
    }

    /* Loading shimmer */
    .shimmer-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.05) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: var(--nyx-animation-shimmer);
      pointer-events: none;
      z-index: 1;
    }

    .loading {
      pointer-events: none;
    }

    /* Empty slots */
    .header:empty,
    .footer:empty {
      display: none;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'nyx-glass-card': NyxGlassCard;
  }
}
