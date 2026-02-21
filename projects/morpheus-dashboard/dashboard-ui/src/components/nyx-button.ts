import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { ButtonVariant, ButtonSize } from '../types/gateway.js';

export type { ButtonVariant, ButtonSize } from '../types/gateway.js';

/**
 * NyxButton - A glassmorphism button component
 * 
 * @slot - Button label/content
 * @slot icon - Icon to display before label
 * @slot icon-right - Icon to display after label
 * 
 * @csspart button - The button element
 * @csspart icon - The icon container
 * @csspart label - The label container
 * 
 * @event click - Fired when button is clicked
 * @event nyx-click - Custom event with detail { originalEvent }
 */
@customElement('nyx-button')
export class NyxButton extends LitElement {
  /**
   * Visual variant of the button
   */
  @property({ type: String })
  variant: ButtonVariant = 'primary';

  /**
   * Size of the button
   */
  @property({ type: String })
  size: ButtonSize = 'md';

  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Whether the button shows a loading state
   */
  @property({ type: Boolean })
  loading = false;

  /**
   * Whether the button takes full width
   */
  @property({ type: Boolean })
  fullWidth = false;

  /**
   * HTML button type attribute
   */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    const classes = {
      button: true,
      [`variant-${this.variant}`]: true,
      [`size-${this.size}`]: true,
      disabled: this.disabled,
      loading: this.loading,
      'full-width': this.fullWidth,
    };

    return html`
      <button
        class="${classMap(classes)}"
        part="button"
        type="${this.type}"
        ?disabled="${this.disabled || this.loading}"
        @click="${this._handleClick}"
      >
        <span class="icon" part="icon">
          <slot name="icon"></slot>
        </span>
        <span class="label" part="label">
          ${this.loading 
            ? html`<span class="spinner"></span>` 
            : html`<slot></slot>`}
        </span>
        <span class="icon-right" part="icon-right">
          <slot name="icon-right"></slot>
        </span>
      </button>
    `;
  }

  private _handleClick(e: MouseEvent) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    this.dispatchEvent(new CustomEvent('nyx-click', {
      detail: { originalEvent: e },
      bubbles: true,
      composed: true,
    }));
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([full-width]) {
      display: flex;
      width: 100%;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--nyx-space-2);
      font-family: var(--nyx-font-family);
      font-weight: var(--nyx-font-weight-medium);
      border: 1px solid transparent;
      border-radius: var(--nyx-radius-md);
      cursor: pointer;
      transition: all var(--nyx-transition-fast);
      position: relative;
      overflow: hidden;
      white-space: nowrap;
    }

    .button:focus-visible {
      outline: 2px solid var(--nyx-color-accent-primary);
      outline-offset: 2px;
    }

    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Size variants */
    .size-sm {
      padding: var(--nyx-space-1) var(--nyx-space-3);
      font-size: var(--nyx-font-size-sm);
      min-height: 32px;
    }

    .size-md {
      padding: var(--nyx-space-2) var(--nyx-space-4);
      font-size: var(--nyx-font-size-md);
      min-height: 40px;
    }

    .size-lg {
      padding: var(--nyx-space-3) var(--nyx-space-6);
      font-size: var(--nyx-font-size-lg);
      min-height: 48px;
    }

    /* Full width */
    .full-width {
      width: 100%;
    }

    /* Variant: Primary */
    .variant-primary {
      background: linear-gradient(135deg, var(--nyx-color-accent-primary), var(--nyx-color-accent-tertiary));
      color: var(--nyx-color-bg-primary);
      border: none;
    }

    .variant-primary:hover:not(:disabled) {
      box-shadow: var(--nyx-glow-primary);
      transform: translateY(-1px);
    }

    .variant-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    /* Variant: Secondary */
    .variant-secondary {
      background: var(--nyx-glass-bg);
      color: var(--nyx-color-text-primary);
      border: 1px solid var(--nyx-glass-border);
      backdrop-filter: var(--nyx-glass-blur) var(--nyx-glass-backdrop);
      -webkit-backdrop-filter: var(--nyx-glass-blur) var(--nyx-glass-backdrop);
    }

    .variant-secondary:hover:not(:disabled) {
      background: var(--nyx-glass-bg-hover);
      border-color: var(--nyx-glass-border-hover);
    }

    /* Variant: Ghost */
    .variant-ghost {
      background: transparent;
      color: var(--nyx-color-text-secondary);
      border: 1px solid transparent;
    }

    .variant-ghost:hover:not(:disabled) {
      background: var(--nyx-glass-bg);
      color: var(--nyx-color-text-primary);
    }

    /* Variant: Danger */
    .variant-danger {
      background: linear-gradient(135deg, var(--nyx-color-accent-error), #ff0044);
      color: white;
      border: none;
    }

    .variant-danger:hover:not(:disabled) {
      box-shadow: var(--nyx-glow-error);
    }

    /* Variant: Success */
    .variant-success {
      background: linear-gradient(135deg, var(--nyx-color-accent-success), #00cc6a);
      color: var(--nyx-color-bg-primary);
      border: none;
    }

    .variant-success:hover:not(:disabled) {
      box-shadow: var(--nyx-glow-success);
    }

    /* Loading spinner */
    .spinner {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Icon slots */
    .icon:empty,
    .icon-right:empty {
      display: none;
    }

    /* Ripple effect on click */
    .button::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      opacity: 0;
      transform: scale(0.5);
      transition: opacity 0.3s, transform 0.3s;
    }

    .button:active:not(:disabled)::after {
      opacity: 1;
      transform: scale(1);
      transition: opacity 0s, transform 0s;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'nyx-button': NyxButton;
  }
}
