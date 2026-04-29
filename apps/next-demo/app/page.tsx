'use client';

import dynamic from 'next/dynamic';
import type { ColumnDef, RowAction } from '@arvea-ui/components/react';
import type { User, Product, Category } from '@/types/arvea';

// Dynamic imports with ssr:false prevent customElements.define from running on the server
const Alert  = dynamic(() => import('@arvea-ui/components/react').then(m => ({ default: m.Alert  })), { ssr: false });
const Input  = dynamic(() => import('@arvea-ui/components/react').then(m => ({ default: m.Input  })), { ssr: false });
const Button = dynamic(() => import('@arvea-ui/components/react').then(m => ({ default: m.Button })), { ssr: false });
const Table  = dynamic(() => import('@arvea-ui/components/react').then(m => ({ default: m.Table  })), { ssr: false });

// ── Users — Scroll mode ───────────────────────────────────────────────────────

const USERS_COLUMNS: ColumnDef<User>[] = [
  { key: 'name',   label: 'Name',   sortable: true },
  { key: 'age',    label: 'Age',    sortable: true,  hideMobile: true },
  { key: 'email',  label: 'Email',  sortable: false, hideTablet: true },
  { key: 'role',   label: 'Role',   sortable: true,  hideMobile: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    badge: { active: 'success', inactive: 'neutral', pending: 'warning' },
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
  { label: 'Edit',   icon: 'edit',   variant: 'default', action: (row) => alert(`Edit: ${row.name}`)   },
  { label: 'View',   icon: 'view',   variant: 'default', action: (row) => alert(`View: ${row.name}`)   },
  { label: 'Delete', icon: 'delete', variant: 'danger',  action: (row) => alert(`Delete: ${row.name}`) },
];

// ── Products — Hide columns mode ──────────────────────────────────────────────

const PRODUCTS_COLUMNS: ColumnDef<Product>[] = [
  { key: 'name',     label: 'Name',     sortable: true },
  {
    key: 'price',
    label: 'Price',
    sortable: true,
    renderCell: (v) => `$${Number(v).toFixed(2)}`,
  },
  { key: 'category', label: 'Category', sortable: true, hideTablet: true },
  { key: 'stock',    label: 'Stock',    sortable: true, hideMobile: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    badge: { 'in stock': 'success', 'out of stock': 'danger', 'low stock': 'warning' },
  },
];

const PRODUCTS_DATA: Product[] = [
  { name: 'MacBook Pro',   price: 1299.99, category: 'Electronics', stock: 15,  status: 'In Stock'     },
  { name: 'iPhone 15',     price: 999.00,  category: 'Electronics', stock: 42,  status: 'In Stock'     },
  { name: 'AirPods Pro',   price: 249.00,  category: 'Electronics', stock: 3,   status: 'Low Stock'    },
  { name: 'Office Chair',  price: 399.99,  category: 'Furniture',   stock: 0,   status: 'Out of Stock' },
  { name: 'Standing Desk', price: 599.99,  category: 'Furniture',   stock: 8,   status: 'In Stock'     },
  { name: 'Notebook',      price: 4.99,    category: 'Stationery',  stock: 200, status: 'In Stock'     },
  { name: 'Mechanical KB', price: 129.00,  category: 'Electronics', stock: 2,   status: 'Low Stock'    },
];

const PRODUCTS_ACTIONS: RowAction<Product>[] = [
  { label: 'Edit',   icon: 'edit',   variant: 'default', action: (row) => alert(`Edit: ${row.name}`)   },
  { label: 'View',   icon: 'view',   variant: 'default', action: (row) => alert(`View: ${row.name}`)   },
  { label: 'Delete', icon: 'delete', variant: 'danger',  action: (row) => alert(`Delete: ${row.name}`) },
];

// ── Categories — Cards mode ───────────────────────────────────────────────────

const CATEGORIES_COLUMNS: ColumnDef<Category>[] = [
  { key: 'name',         label: 'Name',     sortable: true },
  { key: 'brand',        label: 'Brand',    sortable: true },
  { key: 'productCount', label: 'Products', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    badge: { active: 'success', inactive: 'neutral' },
  },
];

const CATEGORIES_DATA: Category[] = [
  { name: 'Electronics', brand: 'Apple',     productCount: 24,  status: 'Active'   },
  { name: 'Furniture',   brand: 'IKEA',      productCount: 18,  status: 'Active'   },
  { name: 'Stationery',  brand: 'Moleskine', productCount: 45,  status: 'Active'   },
  { name: 'Clothing',    brand: 'Zara',      productCount: 63,  status: 'Active'   },
  { name: 'Books',       brand: 'Penguin',   productCount: 120, status: 'Inactive' },
  { name: 'Sports',      brand: 'Nike',      productCount: 37,  status: 'Active'   },
];

const CATEGORIES_ACTIONS: RowAction<Category>[] = [
  { label: 'Edit',   icon: 'edit',   variant: 'default', action: (row) => alert(`Edit: ${row.name}`)   },
  { label: 'Delete', icon: 'delete', variant: 'danger',  action: (row) => alert(`Delete: ${row.name}`) },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '960px', margin: '0 auto' }}>
      <h1>Arvea UI Kit - Next.js Demo</h1>

      <Alert variant="success" title="It works!">
        Web Components are running inside Next.js.
      </Alert>

      <Input label="Email address" type="email" placeholder="you@example.com" />
      <Button variant="primary">Get started</Button>
      <Button variant="secondary">Learn more</Button>

      <h2 style={{ margin: '1.5rem 0 0' }}>Users — Scroll mode</h2>
      <Table
        columns={USERS_COLUMNS}
        data={USERS_DATA}
        actions={USERS_ACTIONS}
        responsive="scroll"
        sortKey="name"
        sortDir="asc"
        pageSize={3}
      />

      <h2 style={{ margin: '1.5rem 0 0' }}>Products — Hide columns mode</h2>
      <Table
        columns={PRODUCTS_COLUMNS}
        data={PRODUCTS_DATA}
        actions={PRODUCTS_ACTIONS}
        responsive="hide"
        sortKey="name"
        sortDir="asc"
        pageSize={5}
      />

      <h2 style={{ margin: '1.5rem 0 0' }}>Categories — Cards mode</h2>
      <Table
        columns={CATEGORIES_COLUMNS}
        data={CATEGORIES_DATA}
        actions={CATEGORIES_ACTIONS}
        responsive="cards"
        sortKey="name"
        sortDir="asc"
      />
    </main>
  );
}
