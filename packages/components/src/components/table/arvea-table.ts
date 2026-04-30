import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ── Public types ─────────────────────────────────────────────────────────────

export type TableSortDir   = 'asc' | 'desc';
export type TableResponsive = 'scroll' | 'hide' | 'cards';
export type BadgeVariant    = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * One column definition.  Pass the whole array via JS property: `el.columns = [...]`
 */
export interface ColumnDef<T = Record<string, unknown>> {
  key: string;
  label: string;
  /** Whether clicking the header sorts by this column. Default: true */
  sortable?: boolean;
  /** Hide at ≤640px when responsive='hide' */
  hideMobile?: boolean;
  /** Hide at ≤768px when responsive='hide' */
  hideTablet?: boolean;
  /**
   * Render this column's value as a colored badge.
   * Keys = lowercase status values, values = badge variant.
   * Example: { active: 'success', inactive: 'neutral', pending: 'warning', banned: 'danger' }
   * Adding a new status only requires updating this map in the consuming app — no package rebuild.
   */
  badge?: Record<string, BadgeVariant>;
  /**
   * Fully custom cell renderer.  Takes priority over `badge`.
   * Return a string, number, or Lit TemplateResult.
   * Must be set via JS property — cannot be serialised as an HTML attribute.
   */
  renderCell?(value: unknown, row: T): unknown;
}

/**
 * One action button rendered at the end of each row.
 * Must be set via JS property — contains functions, not serialisable.
 */
export interface RowAction<T = Record<string, unknown>> {
  label: string;
  /** Built-in icons: 'edit' | 'view' | 'delete'. Any other string falls back to text. */
  icon?: string;
  variant?: 'default' | 'danger';
  action(row: T): void;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * @element arvea-table
 * @summary Generic, sortable, paginated data table.
 *
 * All data lives in the consuming app — the package contains zero static rows.
 * Set `columns`, `data`, and `actions` via JS property (not HTML attribute).
 *
 * @fires arvea-sort        - detail: { key: string, dir: 'asc'|'desc' }
 * @fires arvea-page-change - detail: { page: number }
 */
@customElement('arvea-table')
export class ArvealTable extends LitElement {
  /** Column definitions — set via JS: el.columns = [...] */
  @property({ attribute: false }) columns: ColumnDef[] = [];

  /** Row data — set via JS: el.data = [...] */
  @property({ attribute: false }) data: Record<string, unknown>[] = [];

  /** Row action buttons — set via JS: el.actions = [...] */
  @property({ attribute: false }) actions: RowAction[] = [];

  @property({ type: String, attribute: 'sort-key' }) sortKey = '';
  @property({ type: String, attribute: 'sort-dir' }) sortDir: TableSortDir = 'asc';
  @property({ type: String, reflect: true }) responsive: TableResponsive = 'scroll';

  /** Rows per page. 0 = pagination disabled. */
  @property({ type: Number, attribute: 'page-size' }) pageSize = 0;
  @property({ type: Number }) page = 1;

  @state() private _containerWidth = Infinity;
  private _ro?: ResizeObserver;

  override connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver(([entry]) => {
      this._containerWidth = entry.contentRect.width;
    });
    this._ro.observe(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  override updated(changed: Map<string, unknown>) {
    // reset to page 1 whenever the dataset or sort changes
    if ((changed.has('data') || changed.has('sortKey')) && this.page !== 1) {
      this.page = 1;
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────

  static override styles = css`
    :host {
      display: block;
      font-family: var(--arvea-font-family-base, sans-serif);
    }

    /* ── Wrapper ── */
    .table-wrapper {
      overflow-x: auto;
      border: 1px solid var(--arvea-color-neutral-200, #e2e8f0);
      border-radius: var(--arvea-radius-lg);
    }
    :host([responsive='hide']) .table-wrapper,
    :host([responsive='cards']) .table-wrapper {
      overflow-x: hidden;
    }

    /* ── Table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--arvea-font-size-sm);
      color: var(--arvea-color-neutral-800, #1e293b);
      min-width: 600px;
    }
    :host([responsive='hide']) table,
    :host([responsive='cards']) table {
      min-width: 0;
    }

    thead {
      background-color: var(--arvea-color-neutral-50, #f8fafc);
      border-bottom: 1px solid var(--arvea-color-neutral-200, #e2e8f0);
    }

    th {
      padding: var(--arvea-space-3) var(--arvea-space-4);
      text-align: left;
      font-weight: var(--arvea-font-weight-semibold, 600);
      font-size: var(--arvea-font-size-xs, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--arvea-color-neutral-500, #64748b);
      white-space: nowrap;
      user-select: none;
    }
    th.sortable { cursor: pointer; }
    th.sortable:hover {
      color: var(--arvea-color-neutral-700, #334155);
      background-color: var(--arvea-color-neutral-100, #f1f5f9);
    }
    th.sortable:focus-visible { outline: none; box-shadow: var(--arvea-focus-ring); }
    th.sort-active { color: var(--arvea-color-primary-600, #2563eb); }

    .th-inner { display: inline-flex; align-items: center; gap: var(--arvea-space-1); }
    .sort-icon {
      flex-shrink: 0;
      font-size: 0.65rem;
      line-height: 1;
      color: var(--arvea-color-neutral-400, #94a3b8);
      transition: color var(--arvea-duration-fast);
    }
    th.sort-active .sort-icon { color: var(--arvea-color-primary-600, #2563eb); }

    td {
      padding: var(--arvea-space-3) var(--arvea-space-4);
      border-bottom: 1px solid var(--arvea-color-neutral-100, #f1f5f9);
      vertical-align: middle;
    }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover td { background-color: var(--arvea-color-neutral-50, #f8fafc); }

    .col-hidden { display: none; }

    /* ── Empty state ── */
    .empty-cell {
      text-align: center;
      padding: 2rem;
      color: var(--arvea-color-neutral-400, #94a3b8);
      font-size: var(--arvea-font-size-sm);
    }

    /* ── Actions column ── */
    .th-actions { text-align: right; }
    .actions-cell { text-align: right; white-space: nowrap; }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 4px 8px;
      border: 1px solid transparent;
      border-radius: var(--arvea-radius-md);
      background: transparent;
      cursor: pointer;
      font-size: var(--arvea-font-size-xs, 0.75rem);
      font-family: inherit;
      color: var(--arvea-color-neutral-600, #475569);
      transition:
        background-color var(--arvea-duration-fast),
        color var(--arvea-duration-fast);
    }
    .action-btn:hover {
      background: var(--arvea-color-neutral-100, #f1f5f9);
      color: var(--arvea-color-neutral-800, #1e293b);
    }
    .action-btn-danger { color: var(--arvea-color-danger-600, #dc2626); }
    .action-btn-danger:hover {
      background: var(--arvea-color-danger-50, #fef2f2);
      color: var(--arvea-color-danger-700, #b91c1c);
    }
    .action-btn:focus-visible { outline: none; box-shadow: var(--arvea-focus-ring); }

    /* ── Badges — driven entirely by consumer's badge map ── */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 10px;
      border-radius: var(--arvea-radius-full, 9999px);
      font-size: var(--arvea-font-size-xs, 0.75rem);
      font-weight: var(--arvea-font-weight-medium, 500);
      line-height: 1.6;
    }
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

    .badge-success  { background-color: var(--arvea-color-success-50,  #f0fdf4); color: var(--arvea-color-success-700,  #15803d); }
    .badge-success  .badge-dot { background-color: var(--arvea-color-success-500,  #22c55e); }
    .badge-neutral  { background-color: var(--arvea-color-neutral-100,  #f1f5f9); color: var(--arvea-color-neutral-600,  #475569); }
    .badge-neutral  .badge-dot { background-color: var(--arvea-color-neutral-400,  #94a3b8); }
    .badge-warning  { background-color: var(--arvea-color-warning-50,  #fffbeb); color: var(--arvea-color-warning-700,  #b45309); }
    .badge-warning  .badge-dot { background-color: var(--arvea-color-warning-500,  #f59e0b); }
    .badge-danger   { background-color: var(--arvea-color-danger-50,   #fef2f2); color: var(--arvea-color-danger-700,   #b91c1c); }
    .badge-danger   .badge-dot { background-color: var(--arvea-color-danger-500,   #ef4444); }
    .badge-info     { background-color: var(--arvea-color-info-50,     #eff6ff); color: var(--arvea-color-info-700,     #1d4ed8); }
    .badge-info     .badge-dot { background-color: var(--arvea-color-info-500,     #3b82f6); }

    /* ── Pagination ── */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--arvea-space-3) var(--arvea-space-4);
      border-top: 1px solid var(--arvea-color-neutral-100, #f1f5f9);
      font-size: var(--arvea-font-size-xs, 0.75rem);
      color: var(--arvea-color-neutral-500, #64748b);
      flex-wrap: wrap;
      gap: var(--arvea-space-2);
    }
    .pagination-controls { display: flex; align-items: center; gap: var(--arvea-space-1); }
    .page-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 30px;
      height: 30px;
      padding: 0 6px;
      border: 1px solid var(--arvea-color-neutral-200, #e2e8f0);
      border-radius: var(--arvea-radius-md);
      background: var(--arvea-color-neutral-0, #fff);
      cursor: pointer;
      font-size: var(--arvea-font-size-xs, 0.75rem);
      font-family: inherit;
      color: var(--arvea-color-neutral-600, #475569);
      transition: background-color var(--arvea-duration-fast), border-color var(--arvea-duration-fast);
    }
    .page-btn:hover:not(:disabled) {
      background: var(--arvea-color-neutral-50, #f8fafc);
      border-color: var(--arvea-color-neutral-400, #94a3b8);
    }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.page-active {
      background: var(--arvea-color-primary-600, #2563eb);
      border-color: var(--arvea-color-primary-600, #2563eb);
      color: #fff;
    }
    .page-btn:focus-visible { outline: none; box-shadow: var(--arvea-focus-ring); }

    /* ════════════════════════════════
       CARDS MODE (≤640px)
       Generic — works with any columns because data-label is set from col.label.
    ════════════════════════════════ */
    @media (max-width: 640px) {
      :host([responsive='cards']) .table-wrapper {
        border: none; border-radius: 0; overflow: visible;
      }
      :host([responsive='cards']) table,
      :host([responsive='cards']) thead,
      :host([responsive='cards']) tbody,
      :host([responsive='cards']) th,
      :host([responsive='cards']) td,
      :host([responsive='cards']) tbody tr { display: block; }

      :host([responsive='cards']) thead tr {
        position: absolute; top: -9999px; left: -9999px;
      }
      :host([responsive='cards']) tbody {
        display: flex; flex-direction: column; gap: var(--arvea-space-3);
      }
      :host([responsive='cards']) tbody tr {
        border: 1px solid var(--arvea-color-neutral-200, #e2e8f0);
        border-radius: var(--arvea-radius-lg);
        padding: var(--arvea-space-1) var(--arvea-space-3);
        background: var(--arvea-color-neutral-0, #fff);
        box-shadow: var(--arvea-shadow-sm, 0 1px 3px rgb(0 0 0 / 0.08));
      }
      :host([responsive='cards']) tbody tr:hover { background: var(--arvea-color-neutral-50, #f8fafc); }
      :host([responsive='cards']) tbody tr:hover td { background: transparent; }
      :host([responsive='cards']) td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--arvea-space-2) 0;
        border-bottom: 1px solid var(--arvea-color-neutral-100, #f1f5f9);
      }
      :host([responsive='cards']) td:last-child { border-bottom: none; }
      :host([responsive='cards']) td::before {
        content: attr(data-label);
        font-size: var(--arvea-font-size-xs, 0.75rem);
        font-weight: var(--arvea-font-weight-semibold, 600);
        color: var(--arvea-color-neutral-500, #64748b);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
        margin-right: var(--arvea-space-3);
        flex-shrink: 0;
      }
    }
  `;

  // ── Computed helpers ─────────────────────────────────────────────────────────

  private get _sortedData(): Record<string, unknown>[] {
    if (!this.sortKey) return [...this.data];
    return [...this.data].sort((a, b) => {
      const aVal = a[this.sortKey];
      const bVal = b[this.sortKey];
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''));
      }
      return this.sortDir === 'desc' ? -cmp : cmp;
    });
    
  }

  private get _totalPages(): number {
    if (!this.pageSize) return 1;
    return Math.ceil(this.data.length / this.pageSize);
  }

  private get _paginatedData(): Record<string, unknown>[] {
    const sorted = this._sortedData;
    if (!this.pageSize) return sorted;
    const start = (this.page - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  /**
   * Hide mode: visibility driven by col.hideMobile / col.hideTablet + ResizeObserver.
   * No hardcoded column names or CSS class names — fully dynamic.
   */
  private _isColHidden(col: ColumnDef): boolean {
    if (this.responsive !== 'hide') return false;
    if (col.hideMobile && this._containerWidth <= 640) return true;
    if (col.hideTablet && this._containerWidth <= 768) return true;
    return false;
  }

  // ── Event handlers ───────────────────────────────────────────────────────────

  private _handleSort(key: string, sortable: boolean) {
    if (!sortable) return;
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.dispatchEvent(new CustomEvent('arvea-sort', {
      detail: { key: this.sortKey, dir: this.sortDir },
      bubbles: true, composed: true,
    }));
  }

  private _changePage(newPage: number) {
    const clamped = Math.max(1, Math.min(newPage, this._totalPages));
    if (clamped === this.page) return;
    this.page = clamped;
    this.dispatchEvent(new CustomEvent('arvea-page-change', {
      detail: { page: this.page },
      bubbles: true, composed: true,
    }));
  }

  // ── Render helpers ───────────────────────────────────────────────────────────

  private _sortIcon(key: string, sortable: boolean) {
    if (!sortable) return nothing;
    const isActive = this.sortKey === key;
    const char = isActive ? (this.sortDir === 'desc' ? '▼' : '▲') : '⇅';
    return html`<span class="sort-icon" aria-hidden="true">${char}</span>`;
  }

  private _renderBadge(value: unknown, badgeMap: Record<string, BadgeVariant>) {
    const str = String(value ?? '');
    const variant: BadgeVariant = badgeMap[str.toLowerCase()] ?? 'neutral';
    return html`
      <span class="badge badge-${variant}">
        <span class="badge-dot" aria-hidden="true"></span>
        ${str}
      </span>
    `;
  }

  private _renderCell(col: ColumnDef, row: Record<string, unknown>) {
    const value = row[col.key];
    if (col.renderCell) return col.renderCell(value, row);
    if (col.badge)      return this._renderBadge(value, col.badge);
    return value ?? '';
  }

  private _renderActionIcon(icon: string) {
    const PATHS: Record<string, string> = {
      edit:   'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      view:   'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    };
    const d = PATHS[icon];
    if (!d) return icon;
    return html`
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d=${d}/>
      </svg>
    `;
  }

  private _renderPagination() {
    if (!this.pageSize || this._totalPages <= 1) return nothing;
    const total = this._totalPages;
    const cur   = this.page;
    const start = (cur - 1) * this.pageSize + 1;
    const end   = Math.min(cur * this.pageSize, this.data.length);

    // show at most 5 page buttons centred on current page
    const pages: number[] = [];
    for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) {
      pages.push(i);
    }

    return html`
      <div class="pagination">
        <span>${start}–${end} of ${this.data.length}</span>
        <div class="pagination-controls">
          <button class="page-btn" ?disabled=${cur === 1}
            @click=${() => this._changePage(cur - 1)} aria-label="Previous page">‹</button>
          ${pages.map(p => html`
            <button
              class=${`page-btn${p === cur ? ' page-active' : ''}`}
              aria-current=${p === cur ? 'page' : nothing}
              @click=${() => this._changePage(p)}
            >${p}</button>
          `)}
          <button class="page-btn" ?disabled=${cur === total}
            @click=${() => this._changePage(cur + 1)} aria-label="Next page">›</button>
        </div>
      </div>
    `;
  }

  // ── Main render ──────────────────────────────────────────────────────────────

  override render() {
    const rows       = this._paginatedData;
    const hasActions = this.actions.length > 0;
    const colSpan    = this.columns.length + (hasActions ? 1 : 0);

    return html`
      <div class="table-wrapper" role="region" aria-label="Data table">
        <table>
          <thead>
            <tr>
              ${this.columns.map(col => {
                const sortable = col.sortable !== false;
                const hidden   = this._isColHidden(col);
                return html`
                  <th
                    class=${[
                      sortable ? 'sortable' : '',
                      this.sortKey === col.key ? 'sort-active' : '',
                      hidden ? 'col-hidden' : '',
                    ].filter(Boolean).join(' ') || nothing}
                    tabindex=${sortable ? '0' : nothing}
                    aria-sort=${sortable && this.sortKey === col.key
                      ? (this.sortDir === 'asc' ? 'ascending' : 'descending')
                      : nothing}
                    @click=${() => this._handleSort(col.key, sortable)}
                    @keydown=${(e: KeyboardEvent) =>
                      (e.key === 'Enter' || e.key === ' ') && this._handleSort(col.key, sortable)}
                  >
                    <span class="th-inner">
                      ${col.label}
                      ${this._sortIcon(col.key, sortable)}
                    </span>
                  </th>
                `;
              })}
              ${hasActions ? html`<th class="th-actions">Actions</th>` : nothing}
            </tr>
          </thead>
          <tbody>
            ${rows.length === 0
              ? html`
                  <tr>
                    <td class="empty-cell" colspan=${colSpan}>No data available</td>
                  </tr>
                `
              : rows.map(row => html`
                  <tr>
                    ${this.columns.map(col => html`
                      <td
                        class=${this._isColHidden(col) ? 'col-hidden' : nothing}
                        data-label=${col.label}
                      >${this._renderCell(col, row)}</td>
                    `)}
                    ${hasActions ? html`
                      <td class="actions-cell" data-label="Actions">
                        ${this.actions.map(act => html`
                          <button
                            class=${`action-btn action-btn-${act.variant ?? 'default'}`}
                            title=${act.label}
                            aria-label=${act.label}
                            @click=${(e: Event) => { e.stopPropagation(); act.action(row); }}
                          >${this._renderActionIcon(act.icon ?? '')}</button>
                        `)}
                      </td>
                    ` : nothing}
                  </tr>
                `)
            }
          </tbody>
        </table>
        ${this._renderPagination()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'arvea-table': ArvealTable;
  }
}
