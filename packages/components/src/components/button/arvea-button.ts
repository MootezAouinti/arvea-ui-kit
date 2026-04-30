import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * @element arvea-button
 * @summary A flexible, accessible button component.
 *
 * @slot - Default slot for button label
 * @slot start - Content before the label (icon)
 * @slot end - Content after the label (icon)
 *
 * @fires arvea-click - Fired when button is clicked (not when disabled or loading)
 */
@customElement('arvea-button')
export class ArvealButton extends LitElement {
  @property({ type: String }) variant: ButtonVariant = 'primary';
  @property({ type: String }) size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';
  @property({ type: Boolean, attribute: 'full-width', reflect: true }) fullWidth = false;

  static override styles = css`
    :host {
      display: inline-block;
      font-family: var(--arvea-font-family-base, sans-serif);
    }

    :host([full-width]) {
      display: block;
      width: 100%;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--arvea-space-2);
      border: 1px solid transparent;
      border-radius: var(--arvea-radius-md);
      font-family: inherit;
      font-weight: var(--arvea-font-weight-medium, 500);
      cursor: pointer;
      transition:
        background-color var(--arvea-duration-normal) var(--arvea-ease-default),
        border-color var(--arvea-duration-normal) var(--arvea-ease-default),
        box-shadow var(--arvea-duration-fast) var(--arvea-ease-default),
        transform var(--arvea-duration-fast) var(--arvea-ease-default);
      outline: none;
      text-decoration: none;
      min-height: 44px; /* accessibility: minimum touch target */
      white-space: nowrap;
      width: 100%;
    }

    /* ── Sizes ── */
    :host([size='sm']) button, button.size-sm {
      padding: var(--arvea-space-1) var(--arvea-space-3);
      font-size: var(--arvea-font-size-sm);
      min-height: 32px;
    }
    button {
      padding: var(--arvea-space-2) var(--arvea-space-4);
      font-size: var(--arvea-font-size-base);
    }
    :host([size='lg']) button {
      padding: var(--arvea-space-3) var(--arvea-space-6);
      font-size: var(--arvea-font-size-lg);
    }

    /* ── Variants ── */
    .variant-primary {
      background-color: var(--arvea-color-primary-600);
      color: #fff;
      border-color: var(--arvea-color-primary-600);
    }
    .variant-primary:hover:not(:disabled) {
      background-color: var(--arvea-color-primary-700);
      border-color: var(--arvea-color-primary-700);
    }

    .variant-secondary {
      background-color: var(--arvea-color-neutral-0);
      color: var(--arvea-color-neutral-700);
      border-color: var(--arvea-color-neutral-300);
    }
    .variant-secondary:hover:not(:disabled) {
      background-color: var(--arvea-color-neutral-50);
    }

    .variant-ghost {
      background-color: transparent;
      color: var(--arvea-color-primary-600);
      border-color: transparent;
    }
    .variant-ghost:hover:not(:disabled) {
      background-color: var(--arvea-color-primary-50);
    }

    .variant-danger {
      background-color: var(--arvea-color-danger-500);
      color: #fff;
      border-color: var(--arvea-color-danger-500);
    }
    .variant-danger:hover:not(:disabled) {
      background-color: var(--arvea-color-danger-700);
    }

    /* ── States ── */
    button:focus-visible {
      box-shadow: var(--arvea-focus-ring);
    }
    button:active:not(:disabled) {
      transform: scale(0.98);
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ── Loading spinner ── */
    .spinner {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 600ms linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner { animation-duration: 1500ms; }
      button { transition: none; }
    }
  `;

  private _handleClick(e: MouseEvent) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('arvea-click', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const sizeClass = `size-${this.size}`;
    const variantClass = `variant-${this.variant}`;

    return html`
      <button
        type=${this.type}
        class=${`${variantClass} ${sizeClass}`}
        ?disabled=${this.disabled || this.loading}
        aria-disabled=${this.disabled || this.loading}
        aria-busy=${this.loading}
        @click=${this._handleClick}
      >
        ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : html`<slot name="start"></slot>`}
        <slot></slot>
        <slot name="end"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'arvea-button': ArvealButton;
  }
}