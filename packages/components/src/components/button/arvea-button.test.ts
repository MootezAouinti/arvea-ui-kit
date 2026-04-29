import { jest } from '@jest/globals';
import { ArvealButton } from './arvea-button';

describe('ArvealButton', () => {
  let el: ArvealButton;

  beforeEach(async () => {
    el = document.createElement('arvea-button') as ArvealButton;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('default properties', () => {
    it('has variant "primary"', () => {
      expect(el.variant).toBe('primary');
    });

    it('has size "md"', () => {
      expect(el.size).toBe('md');
    });

    it('is not disabled', () => {
      expect(el.disabled).toBe(false);
    });

    it('is not loading', () => {
      expect(el.loading).toBe(false);
    });

    it('has type "button"', () => {
      expect(el.type).toBe('button');
    });

    it('is not full-width', () => {
      expect(el.fullWidth).toBe(false);
    });
  });

  describe('property assignment', () => {
    it('accepts all valid variants', () => {
      const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
      for (const v of variants) {
        el.variant = v;
        expect(el.variant).toBe(v);
      }
    });

    it('accepts all valid sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      for (const s of sizes) {
        el.size = s;
        expect(el.size).toBe(s);
      }
    });

    it('reflects disabled attribute', () => {
      el.disabled = true;
      expect(el.disabled).toBe(true);
    });

    it('reflects loading attribute', () => {
      el.loading = true;
      expect(el.loading).toBe(true);
    });
  });

  describe('events', () => {
    it('does not dispatch arvea-click when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const handler = jest.fn();
      el.addEventListener('arvea-click', handler);
      el.click();

      expect(handler).not.toHaveBeenCalled();
    });
  });
});
