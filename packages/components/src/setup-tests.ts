import { LitElement } from 'lit';

// Polyfill customElements for jsdom
if (!globalThis.customElements) {
  (globalThis as any).customElements = {
    define: () => {},
    get: () => undefined,
    whenDefined: () => Promise.resolve(),
  };
}

// Force Lit to use non-shadow DOM in tests
// so shadowRoot is accessible
(LitElement as any).shadowRootOptions = undefined;

// Polyfill ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};