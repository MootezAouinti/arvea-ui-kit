import { jest } from '@jest/globals';
import { ArvealTable } from './arvea-table';
import type { ColumnDef, RowAction } from './arvea-table';

const COLUMNS: ColumnDef[] = [
  { key: 'name',   label: 'Name',   sortable: true },
  { key: 'age',    label: 'Age',    sortable: true,  hideMobile: true },
  { key: 'email',  label: 'Email',  sortable: false, hideTablet: true },
  { key: 'status', label: 'Status', sortable: true,
    badge: { active: 'success', inactive: 'neutral', pending: 'warning' } },
];

const DATA = [
  { name: 'Alice', age: 28, email: 'alice@example.com', status: 'Active'   },
  { name: 'Bob',   age: 35, email: 'bob@example.com',   status: 'Inactive' },
  { name: 'Carol', age: 22, email: 'carol@example.com', status: 'Active'   },
];

describe('ArvealTable', () => {
  let el: ArvealTable;

  beforeAll(async () => {
    // Register element if not yet in this jsdom context
    if (!customElements.get('arvea-table')) {
      customElements.define('arvea-table', ArvealTable);
    }
  });

  beforeEach(async () => {
  el = document.createElement('arvea-table') as ArvealTable;
  document.body.appendChild(el);
  el.columns = COLUMNS;
  el.data = DATA;
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 0)); // flush microtasks
});

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('default properties', () => {
    it('has empty sortKey', ()       => expect(el.sortKey).toBe(''));
    it('has sortDir "asc"', ()       => expect(el.sortDir).toBe('asc'));
    it('has responsive "scroll"', () => expect(el.responsive).toBe('scroll'));
    it('has pageSize 0', ()          => expect(el.pageSize).toBe(0));
    it('has page 1', ()              => expect(el.page).toBe(1));
  });

  describe('renders rows from data property', () => {
    it('renders all rows when no pagination', async () => {
      const rows = el.shadowRoot!.querySelectorAll('tbody tr');
      expect(rows.length).toBe(DATA.length);
    });

    it('renders empty state when data is empty', async () => {
      el.data = [];
      await el.updateComplete;
      const empty = el.shadowRoot!.querySelector('.empty-cell');
      expect(empty).not.toBeNull();
    });
  });

  describe('sorting', () => {
    it('sorts by clicking a sortable header', async () => {
      const th = el.shadowRoot!.querySelector('th.sortable') as HTMLElement;
      th.click();
      await el.updateComplete;
      expect(el.sortKey).toBe(COLUMNS[0].key);
      expect(el.sortDir).toBe('asc');
    });

    it('toggles direction on second click of the same header', async () => {
      const th = el.shadowRoot!.querySelector('th.sortable') as HTMLElement;
      th.click();
      await el.updateComplete;
      th.click();
      await el.updateComplete;
      expect(el.sortDir).toBe('desc');
    });

    it('resets to asc when switching to a different column', async () => {
      el.sortKey = 'name';
      el.sortDir = 'desc';
      await el.updateComplete;

      const headers = el.shadowRoot!.querySelectorAll('th.sortable');
      (headers[1] as HTMLElement).click();
      await el.updateComplete;

      expect(el.sortKey).toBe(COLUMNS[1].key);
      expect(el.sortDir).toBe('asc');
    });

    it('dispatches arvea-sort event', async () => {
      const handler = jest.fn();
      el.addEventListener('arvea-sort', handler);
      (el.shadowRoot!.querySelector('th.sortable') as HTMLElement).click();
      await el.updateComplete;
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not sort on non-sortable column', async () => {
      const headers = el.shadowRoot!.querySelectorAll('th');
      // email column (index 2) has sortable: false
      const emailTh = headers[2] as HTMLElement;
      emailTh.click();
      await el.updateComplete;
      expect(el.sortKey).toBe('');
    });
  });

  describe('pagination', () => {
    it('shows all rows when pageSize is 0', async () => {
      expect(el.shadowRoot!.querySelectorAll('tbody tr').length).toBe(DATA.length);
    });

    it('paginates rows when pageSize is set', async () => {
      el.pageSize = 2;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelectorAll('tbody tr').length).toBe(2);
    });

    it('shows pagination controls when pageSize > 0 and has multiple pages', async () => {
      el.pageSize = 2;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.pagination')).not.toBeNull();
    });
  });

  describe('actions', () => {
    it('renders action buttons when actions are provided', async () => {
      const handler = jest.fn();
      const actions: RowAction[] = [
        { label: 'Edit', icon: 'edit', variant: 'default', action: handler },
      ];
      el.actions = actions;
      await el.updateComplete;
      const btns = el.shadowRoot!.querySelectorAll('.action-btn');
      expect(btns.length).toBe(DATA.length);
    });

    it('calls action callback with the correct row on click', async () => {
      const handler = jest.fn();
      el.actions = [{ label: 'Edit', icon: 'edit', action: handler }];
      await el.updateComplete;

      const btn = el.shadowRoot!.querySelector('.action-btn') as HTMLElement;
      btn.click();
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(DATA[0]);
    });
  });
});
