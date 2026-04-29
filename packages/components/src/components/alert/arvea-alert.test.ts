import { jest } from '@jest/globals';
import { ArvealAlert } from './arvea-alert';

describe('ArvealAlert', () => {
  let el: ArvealAlert;

  beforeEach(async () => {
    el = document.createElement('arvea-alert') as ArvealAlert;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('default properties', () => {
    it('has variant "info"', () => {
      expect(el.variant).toBe('info');
    });

    it('has empty title', () => {
      expect(el.title).toBe('');
    });

    it('is not dismissible', () => {
      expect(el.dismissible).toBe(false);
    });
  });

  describe('property assignment', () => {
    it('accepts all valid variants', () => {
      const variants = ['info', 'success', 'warning', 'danger'] as const;
      for (const v of variants) {
        el.variant = v;
        expect(el.variant).toBe(v);
      }
    });

    it('sets title', () => {
      el.title = 'Something went wrong';
      expect(el.title).toBe('Something went wrong');
    });

    it('reflects dismissible attribute', () => {
      el.dismissible = true;
      expect(el.dismissible).toBe(true);
    });
  });

  describe('dismiss behaviour', () => {
    it('dispatches arvea-dismiss event when dismissed', async () => {
      el.dismissible = true;
      await el.updateComplete;

      const handler = jest.fn();
      el.addEventListener('arvea-dismiss', handler);

      const btn = el.shadowRoot?.querySelector('.dismiss-btn') as HTMLButtonElement | null;
      btn?.click();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('hides itself after dismiss', async () => {
      el.dismissible = true;
      await el.updateComplete;

      const btn = el.shadowRoot?.querySelector('.dismiss-btn') as HTMLButtonElement | null;
      btn?.click();

      expect(el.hidden).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('uses role="alert" for danger variant', async () => {
      el.variant = 'danger';
      await el.updateComplete;
      const inner = el.shadowRoot?.querySelector('.alert');
      expect(inner?.getAttribute('role')).toBe('alert');
    });

    it('uses role="alert" for warning variant', async () => {
      el.variant = 'warning';
      await el.updateComplete;
      const inner = el.shadowRoot?.querySelector('.alert');
      expect(inner?.getAttribute('role')).toBe('alert');
    });

    it('uses role="status" for info variant', async () => {
      el.variant = 'info';
      await el.updateComplete;
      const inner = el.shadowRoot?.querySelector('.alert');
      expect(inner?.getAttribute('role')).toBe('status');
    });

    it('uses role="status" for success variant', async () => {
      el.variant = 'success';
      await el.updateComplete;
      const inner = el.shadowRoot?.querySelector('.alert');
      expect(inner?.getAttribute('role')).toBe('status');
    });
  });
});
