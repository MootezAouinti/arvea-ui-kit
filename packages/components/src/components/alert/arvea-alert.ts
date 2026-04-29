import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
export type AlertSize = 'sm' | 'md' | 'lg';

@customElement('arvea-alert')
export class ArvealAlert extends LitElement {
  @property({ type: String }) variant: AlertVariant = 'info';
  @property({ type: String }) override title = '';
  @property({ type: Boolean, reflect: true }) dismissible = false;
  @property({ type: String, reflect: true }) size: AlertSize = 'md';


  static override styles = css`
    :host {
      display: block;
      font-family: var(--arvea-font-family-base, sans-serif);
    }

    :host([hidden]) { display: none; }

    .alert {
      display: flex;
      gap: var(--arvea-space-3);
      padding: var(--arvea-space-4);
      border-radius: var(--arvea-radius-lg);
      border: 1px solid;
      position: relative;
    }

    .icon { flex-shrink: 0; width: 20px; height: 20px; }
    .body { flex: 1; min-width: 0; }
    .alert-title {
      font-weight: var(--arvea-font-weight-semibold, 600);
      font-size: var(--arvea-font-size-sm);
      margin: 0 0 4px;
    }
    .alert-content { font-size: var(--arvea-font-size-sm); margin: 0; }

    .dismiss-btn {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      border-radius: var(--arvea-radius-sm);
      opacity: 0.7;
      transition: opacity var(--arvea-duration-fast);
      line-height: 1;
    }
    .dismiss-btn:hover { opacity: 1; }
    .dismiss-btn:focus-visible { box-shadow: var(--arvea-focus-ring); outline: none; }

    /* Variants */
    .variant-info {
      background-color: var(--arvea-color-info-50);
      border-color: var(--arvea-color-info-500);
      color: var(--arvea-color-info-700);
    }
    .variant-success {
      background-color: var(--arvea-color-success-50);
      border-color: var(--arvea-color-success-500);
      color: var(--arvea-color-success-700);
    }
    .variant-warning {
      background-color: var(--arvea-color-warning-50);
      border-color: var(--arvea-color-warning-500);
      color: var(--arvea-color-warning-700);
    }
    .variant-danger {
      background-color: var(--arvea-color-danger-50);
      border-color: var(--arvea-color-danger-500);
      color: var(--arvea-color-danger-700);
    }
    /* Sizes */
      :host([size='sm']) .alert {
        padding: var(--arvea-space-2);
        font-size: var(--arvea-font-size-xs);
      }
      :host([size='md']) .alert {
        padding: var(--arvea-space-4);
        font-size: var(--arvea-font-size-sm);
      }
      :host([size='lg']) .alert {
        padding: var(--arvea-space-6);
        font-size: var(--arvea-font-size-base);
    }
  `;

  private _dismiss() {
    this.dispatchEvent(new CustomEvent('arvea-dismiss', { bubbles: true, composed: true }));
    this.hidden = true;
  }

  private _getIcon(variant: AlertVariant): string {
    const icons: Record<AlertVariant, string> = {
      info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      danger:  'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    };
    return icons[variant];
  }

  override render() {
    const isUrgent = this.variant === 'danger' || this.variant === 'warning';

    return html`
      <div
        class="alert variant-${this.variant}"
        role=${isUrgent ? 'alert' : 'status'}
        aria-live=${isUrgent ? 'assertive' : 'polite'}
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true">
          <path d=${this._getIcon(this.variant)} />
        </svg>
        <div class="body">
          ${this.title ? html`<p class="alert-title">${this.title}</p>` : ''}
          <p class="alert-content"><slot></slot></p>
        </div>
        ${this.dismissible ? html`
          <button
            class="dismiss-btn"
            aria-label="Dismiss alert"
            @click=${this._dismiss}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'arvea-alert': ArvealAlert;
  }
}