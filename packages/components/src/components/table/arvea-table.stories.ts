import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@arvea-ui/components';
import type { ColumnDef, RowAction } from './arvea-table';

// ── Sample data (lives here in Storybook, not in the package) ────────────────

type User = { name: string; age: number; email: string; role: string; status: string };

const USERS_COLUMNS: ColumnDef<User>[] = [
  { key: 'name',   label: 'Name',   sortable: true },
  { key: 'age',    label: 'Age',    sortable: true,  hideMobile: true },
  { key: 'email',  label: 'Email',  sortable: false, hideTablet: true },
  { key: 'role',   label: 'Role',   sortable: true,  hideMobile: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    // Adding a new status = just add a key here, no package rebuild needed
    badge: { active: 'success', inactive: 'neutral', pending: 'warning', banned: 'danger' },
  },
];

const USERS_DATA: User[] = [
  { name: 'Alice Martin',  age: 28, email: 'alice@example.com',  role: 'Admin',  status: 'Active'   },
  { name: 'Bob Johnson',   age: 35, email: 'bob@example.com',    role: 'Editor', status: 'Active'   },
  { name: 'Carol Smith',   age: 22, email: 'carol@example.com',  role: 'Viewer', status: 'Inactive' },
  { name: 'David Lee',     age: 41, email: 'david@example.com',  role: 'Editor', status: 'Active'   },
  { name: 'Eva Brown',     age: 31, email: 'eva@example.com',    role: 'Admin',  status: 'Pending'  },
  { name: 'Frank Wilson',  age: 26, email: 'frank@example.com',  role: 'Viewer', status: 'Active'   },
  { name: 'Grace Davis',   age: 38, email: 'grace@example.com',  role: 'Editor', status: 'Inactive' },
];

const USERS_ACTIONS: RowAction<User>[] = [
  { label: 'Edit',   icon: 'edit',   variant: 'default', action: (row: User) => alert(`Edit: ${row.name}`) },
  { label: 'Delete', icon: 'delete', variant: 'danger',  action: (row: User) => alert(`Delete: ${row.name}`) },
];

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/Table',
  component: 'arvea-table',
  tags: ['autodocs'],
  argTypes: {
    responsive: {
      control: 'select',
      options: ['scroll', 'hide', 'cards'],
    },
    'sort-key': { control: 'text' },
    'sort-dir': { control: 'select', options: ['asc', 'desc'] },
    'page-size': { control: 'number' },
  },
  args: {
    responsive: 'scroll',
    'sort-key': 'name',
    'sort-dir': 'asc',
    'page-size': 0,
  },
};
export default meta;
type Story = StoryObj;

// ── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args: Record<string, any>) => html`
    <arvea-table
      .columns=${USERS_COLUMNS}
      .data=${USERS_DATA}
      .actions=${USERS_ACTIONS}
      responsive=${args.responsive}
      sort-key=${args['sort-key']}
      sort-dir=${args['sort-dir']}
      page-size=${args['page-size']}
    ></arvea-table>
  `,
};

export const WithPagination: Story = {
  render: () => html`
    <arvea-table
      .columns=${USERS_COLUMNS}
      .data=${USERS_DATA}
      .actions=${USERS_ACTIONS}
      responsive="scroll"
      sort-key="name"
      page-size="3"
    ></arvea-table>
  `,
};

export const NoActions: Story = {
  render: () => html`
    <arvea-table
      .columns=${USERS_COLUMNS}
      .data=${USERS_DATA}
      responsive="scroll"
      sort-key="name"
    ></arvea-table>
  `,
};

export const EmptyState: Story = {
  render: () => html`
    <arvea-table
      .columns=${USERS_COLUMNS}
      .data=${[]}
      responsive="scroll"
    ></arvea-table>
  `,
};

export const ResponsiveScroll: Story = {
  name: 'Responsive / Scroll',
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => html`
    <div style="max-width:360px">
      <arvea-table .columns=${USERS_COLUMNS} .data=${USERS_DATA} .actions=${USERS_ACTIONS}
        responsive="scroll" sort-key="name"></arvea-table>
    </div>
  `,
};

export const ResponsiveHide: Story = {
  name: 'Responsive / Hide columns',
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => html`
    <div style="max-width:360px">
      <arvea-table .columns=${USERS_COLUMNS} .data=${USERS_DATA} .actions=${USERS_ACTIONS}
        responsive="hide" sort-key="name"></arvea-table>
    </div>
  `,
};

export const ResponsiveCards: Story = {
  name: 'Responsive / Cards',
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => html`
    <div style="max-width:360px">
      <arvea-table .columns=${USERS_COLUMNS} .data=${USERS_DATA} .actions=${USERS_ACTIONS}
        responsive="cards" sort-key="name"></arvea-table>
    </div>
  `,
};
