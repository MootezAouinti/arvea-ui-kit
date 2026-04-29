import { jest } from '@jest/globals';
import { ArvealInput } from './arvea-input';

describe('ArvealInput', () => {
  let el: ArvealInput;

  beforeEach(async () => {
    el = document.createElement('arvea-input') as ArvealInput;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('default properties', () => {
    it('has empty label', () => {
      expect(el.label).toBe('');
    });

    it('has empty value', () => {
      expect(el.value).toBe('');
    });

    it('has empty placeholder', () => {
      expect(el.placeholder).toBe('');
    });

    it('has type "text"', () => {
      expect(el.type).toBe('text');
    });

    it('is not disabled', () => {
      expect(el.disabled).toBe(false);
    });

    it('is not required', () => {
      expect(el.required).toBe(false);
    });

    it('has no error', () => {
      expect(el.error).toBe('');
    });

    it('has no hint', () => {
      expect(el.hint).toBe('');
    });

    it('has size "md"', () => {
      expect(el.size).toBe('md');
    });
  });

  describe('property assignment', () => {
    it('accepts all valid input types', () => {
      const types = ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] as const;
      for (const t of types) {
        el.type = t;
        expect(el.type).toBe(t);
      }
    });

    it('sets label', () => {
      el.label = 'Email address';
      expect(el.label).toBe('Email address');
    });

    it('sets value', () => {
      el.value = 'test@example.com';
      expect(el.value).toBe('test@example.com');
    });

    it('sets error message', () => {
      el.error = 'Please enter a valid email';
      expect(el.error).toBe('Please enter a valid email');
    });

    it('sets hint message', () => {
      el.hint = 'Must be at least 3 characters';
      expect(el.hint).toBe('Must be at least 3 characters');
    });
  });

  describe('error state', () => {
    it('renders error element when error is set', async () => {
      el.error = 'Invalid email';
      await el.updateComplete;
      const errorEl = el.shadowRoot?.querySelector('.error');
      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent?.trim()).toBe('Invalid email');
    });

    it('does not render error element when error is empty', async () => {
      el.error = '';
      await el.updateComplete;
      const errorEl = el.shadowRoot?.querySelector('.error');
      expect(errorEl).toBeNull();
    });
  });

  describe('hint state', () => {
    it('renders hint element when hint is set', async () => {
      el.hint = 'Must be at least 3 characters';
      await el.updateComplete;
      const hintEl = el.shadowRoot?.querySelector('.hint');
      expect(hintEl).not.toBeNull();
      expect(hintEl?.textContent?.trim()).toBe('Must be at least 3 characters');
    });

    it('does not render hint when error is also set', async () => {
      el.error = 'Error takes priority';
      el.hint = 'Some hint';
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.hint')).toBeNull();
      expect(el.shadowRoot?.querySelector('.error')).not.toBeNull();
    });
  });

  describe('required marker', () => {
    it('renders required mark when required is true', async () => {
      el.label = 'Email';
      el.required = true;
      await el.updateComplete;
      const mark = el.shadowRoot?.querySelector('.required-mark');
      expect(mark).not.toBeNull();
    });

    it('does not render required mark when required is false', async () => {
      el.label = 'Email';
      el.required = false;
      await el.updateComplete;
      const mark = el.shadowRoot?.querySelector('.required-mark');
      expect(mark).toBeNull();
    });
  });

  describe('events', () => {
    it('dispatches arvea-input event on input', async () => {
      const handler = jest.fn();
      el.addEventListener('arvea-input', handler);

      const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));

      expect(handler).toHaveBeenCalledTimes(1);
      expect((handler.mock.calls[0][0] as CustomEvent).detail.value).toBe('hello');
    });

    it('dispatches arvea-change event on change', async () => {
      const handler = jest.fn();
      el.addEventListener('arvea-change', handler);

      const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'changed';
      input.dispatchEvent(new Event('change'));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('dispatches arvea-focus event on focus', async () => {
      const handler = jest.fn();
      el.addEventListener('arvea-focus', handler);

      const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('focus'));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('dispatches arvea-blur event on blur', async () => {
      const handler = jest.fn();
      el.addEventListener('arvea-blur', handler);

      const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur'));

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
