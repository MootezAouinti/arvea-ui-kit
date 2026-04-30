import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * @element arvea-input
 * @summary Accessible text input with label, hint, and error states.
 *
 * @fires arvea-input - Fired on every keystroke
 * @fires arvea-change - Fired on change/blur
 * @fires arvea-focus - Fired on focus
 * @fires arvea-blur - Fired on blur
 */
@customElement('arvea-input')
export class ArvealInput extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String, reflect: true }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) type: InputType = 'text';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) error = '';
  @property({ type: String }) hint = '';
  @property({ type: String }) size: InputSize = 'md';
  @property({ type: String }) name = '';

  @state() private _inputId = `arvea-input-${Math.random().toString(36).slice(2, 9)}`;

  static override styles = css`
    :host {
      display: block;
      font-family: var(--arvea-font-family-base, sans-serif);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--arvea-space-1);
    }

    label {
      font-size: var(--arvea-font-size-sm);
      font-weight: var(--arvea-font-weight-medium, 500);
      color: var(--arvea-color-neutral-700, #334155);
    }

    .required-mark {
      color: var(--arvea-color-danger-500);
      margin-left: 2px;
    }

    input {
      display: block;
      width: 100%;
      border: 1px solid var(--arvea-color-neutral-300, #CBD5E1);
      border-radius: var(--arvea-radius-md);
      font-family: inherit;
      font-size: var(--arvea-font-size-base);
      color: var(--arvea-color-neutral-900, #0F172A);
      background-color: var(--arvea-color-neutral-0, #fff);
      outline: none;
      box-sizing: border-box;
      transition:
        border-color var(--arvea-duration-normal) var(--arvea-ease-default),
        box-shadow var(--arvea-duration-fast) var(--arvea-ease-default);
    }

    /* Sizes */
    :host([size='sm']) input { padding: 6px 10px; font-size: var(--arvea-font-size-sm); }
    input { padding: 9px 12px; }
    :host([size='lg']) input { padding: 12px 16px; font-size: var(--arvea-font-size-lg); }

    input:hover:not(:disabled) {
      border-color: var(--arvea-color-neutral-500, #64748B);
    }

    input:focus-visible {
      border-color: var(--arvea-color-primary-600);
      box-shadow: var(--arvea-focus-ring);
    }

    input:disabled {
      background-color: var(--arvea-color-neutral-100);
      color: var(--arvea-color-neutral-500);
      cursor: not-allowed;
    }

    /* Error state */
    :host([has-error]) input {
      border-color: var(--arvea-color-danger-500);
    }
    :host([has-error]) input:focus-visible {
      box-shadow: 0 0 0 3px rgb(244 63 94 / 0.3);
    }

    .helper {
      font-size: var(--arvea-font-size-xs);
    }

    .hint { color: var(--arvea-color-neutral-500); }
    .error { color: var(--arvea-color-danger-700); }
  `;

  private get _hasError(): boolean {
    return !!this.error;
  }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent('arvea-input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent('arvea-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _handleFocus() {
    this.dispatchEvent(new CustomEvent('arvea-focus', { bubbles: true, composed: true }));
  }

  private _handleBlur() {
    this.dispatchEvent(new CustomEvent('arvea-blur', { bubbles: true, composed: true }));
  }

  override render() {
    const helperId = this._hasError ? `${this._inputId}-error` : this.hint ? `${this._inputId}-hint` : undefined;

    return html`
      <div class="wrapper">
        ${this.label ? html`
          <label for=${this._inputId}>
            ${this.label}
            ${this.required ? html`<span class="required-mark" aria-hidden="true">*</span>` : ''}
          </label>
        ` : ''}

        <input
          id=${this._inputId}
          type=${this.type}
          name=${this.name}
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${this._hasError}
          aria-required=${this.required}
          aria-describedby=${helperId ?? ''}
          @input=${this._handleInput}
          @change=${this._handleChange}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        />

        ${this._hasError ? html`
          <span class="helper error" id=${this._inputId + '-error'} role="alert">
            ${this.error}
          </span>
        ` : this.hint ? html`
          <span class="helper hint" id=${this._inputId + '-hint'}>
            ${this.hint}
          </span>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'arvea-input': ArvealInput;
  }
}