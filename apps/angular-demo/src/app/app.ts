import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';import '@arvea-ui/components';
import type { ColumnDef, RowAction } from '@arvea-ui/components';
import { Category, Product, User } from 'src/types/arvea';

// ── Types ─────────────────────────────────────────────────────────────────────



@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; max-width: 960px; margin: 0 auto;">
      <h1>Arvea UI Kit - Angular Demo</h1>

      <arvea-alert variant="success" title="It works!">
        Web Components are running inside Angular.
      </arvea-alert>

      <arvea-input label="Email address" type="email" placeholder="you@example.com"></arvea-input>
      <arvea-button variant="primary">Get started</arvea-button>
      <arvea-button variant="secondary">Learn more</arvea-button>

      <!-- Scroll mode — Users -->
      <h2 style="margin: 1.5rem 0 0">Users — Scroll mode</h2>
      <arvea-table
  #usersTable
  responsive="scroll"
  sort-key="name"
  sort-dir="asc"
  page-size="4"
></arvea-table>

      <!-- Hide columns mode — Products -->
      <h2 style="margin: 1.5rem 0 0">Products — Hide columns mode</h2>
      <arvea-table
  #productsTable
  responsive="hide"
  sort-key="name"
  sort-dir="asc"
  page-size="5"
></arvea-table>

      <!-- Cards mode — Categories -->
      <h2 style="margin: 1.5rem 0 0">Categories — Cards mode</h2>
     <arvea-table
  #categoriesTable
  responsive="cards"
  sort-key="name"
  sort-dir="asc"
></arvea-table>
    </main>
  `,
  styles: [],
})
export class AppComponent implements AfterViewInit{

  @ViewChild('usersTable') usersTable!: ElementRef;
  @ViewChild('productsTable') productsTable!: ElementRef;
  @ViewChild('categoriesTable') categoriesTable!: ElementRef;

  ngAfterViewInit() {
    const users = this.usersTable.nativeElement;
    users.columns = this.usersColumns;
    users.data = this.usersData;
    users.actions = this.usersActions;

    const products = this.productsTable.nativeElement;
    products.columns = this.productsColumns;
    products.data = this.productsData;
    products.actions = this.productsActions;

    const categories = this.categoriesTable.nativeElement;
    categories.columns = this.categoriesColumns;
    categories.data = this.categoriesData;
    categories.actions = this.categoriesActions;
  }


  // ── Users (Scroll mode) ────────────────────────────────────────────────────

  usersColumns: ColumnDef<User>[] = [
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

  usersData: User[] = [
    { name: 'Alice Martin',  age: 28, email: 'alice@example.com',  role: 'Admin',  status: 'Active'   },
    { name: 'Bob Johnson',   age: 35, email: 'bob@example.com',    role: 'Editor', status: 'Active'   },
    { name: 'Carol Smith',   age: 22, email: 'carol@example.com',  role: 'Viewer', status: 'Inactive' },
    { name: 'David Lee',     age: 41, email: 'david@example.com',  role: 'Editor', status: 'Active'   },
    { name: 'Eva Brown',     age: 31, email: 'eva@example.com',    role: 'Admin',  status: 'Pending'  },
    { name: 'Frank Wilson',  age: 26, email: 'frank@example.com',  role: 'Viewer', status: 'Active'   },
    { name: 'Grace Davis',   age: 38, email: 'grace@example.com',  role: 'Editor', status: 'Inactive' },
  ];

  usersActions: RowAction<User>[] = [
    { label: 'Edit',   icon: 'edit',   variant: 'default', action: (row: User) => alert(`Edit: ${row.name}`) },
    { label: 'View',   icon: 'view',   variant: 'default', action: (row: User) => alert(`View: ${row.name}`) },
    { label: 'Delete', icon: 'delete', variant: 'danger',  action: (row: User) => alert(`Delete: ${row.name}`) },
  ];

  // ── Products (Hide columns mode) ───────────────────────────────────────────

  productsColumns: ColumnDef<Product>[] = [
    { key: 'name',     label: 'Name',     sortable: true },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      renderCell: (v: unknown) => `$${Number(v).toFixed(2)}`,
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

  productsData: Product[] = [
    { name: 'MacBook Pro',   price: 1299.99, category: 'Electronics', stock: 15,  status: 'In Stock'     },
    { name: 'iPhone 15',     price: 999.00,  category: 'Electronics', stock: 42,  status: 'In Stock'     },
    { name: 'AirPods Pro',   price: 249.00,  category: 'Electronics', stock: 3,   status: 'Low Stock'    },
    { name: 'Office Chair',  price: 399.99,  category: 'Furniture',   stock: 0,   status: 'Out of Stock' },
    { name: 'Standing Desk', price: 599.99,  category: 'Furniture',   stock: 8,   status: 'In Stock'     },
    { name: 'Notebook',      price: 4.99,    category: 'Stationery',  stock: 200, status: 'In Stock'     },
    { name: 'Mechanical KB', price: 129.00,  category: 'Electronics', stock: 2,   status: 'Low Stock'    },
  ];

  productsActions: RowAction<Product>[] = [
    { label: 'Edit',   icon: 'edit',   variant: 'default', action: (row: Product) => alert(`Edit: ${row.name}`) },
    { label: 'View',   icon: 'view',   variant: 'default', action: (row: Product) => alert(`View: ${row.name}`) },
    { label: 'Delete', icon: 'delete', variant: 'danger',  action: (row: Product) => alert(`Delete: ${row.name}`) },
  ];

  // ── Categories (Cards mode) ────────────────────────────────────────────────

  categoriesColumns: ColumnDef<Category>[] = [
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

  categoriesData: Category[] = [
    { name: 'Electronics', brand: 'Apple',     productCount: 24,  status: 'Active'   },
    { name: 'Furniture',   brand: 'IKEA',      productCount: 18,  status: 'Active'   },
    { name: 'Stationery',  brand: 'Moleskine', productCount: 45,  status: 'Active'   },
    { name: 'Clothing',    brand: 'Zara',      productCount: 63,  status: 'Active'   },
    { name: 'Books',       brand: 'Penguin',   productCount: 120, status: 'Inactive' },
    { name: 'Sports',      brand: 'Nike',      productCount: 37,  status: 'Active'   },
  ];

  categoriesActions: RowAction<Category>[] = [
    { label: 'Edit',   icon: 'edit',   variant: 'default', action: (row: Category) => alert(`Edit: ${row.name}`) },
    { label: 'Delete', icon: 'delete', variant: 'danger',  action: (row: Category) => alert(`Delete: ${row.name}`) },
  ];
}
