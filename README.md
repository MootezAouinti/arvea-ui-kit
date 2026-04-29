# @arvea-ui/kit

> Arvea's internal UI component library built with [Lit](https://lit.dev/) Web Components.  
> Framework-agnostic — works identically in Next.js, Angular, and plain HTML.

---

## Installation

```bash
npm install @arvea-ui/kit lit
```

> `lit` is a required peer dependency.

---

## Usage

### Next.js (App Router)

```tsx
// app/layout.tsx or any client component
import('@arvea-ui/kit')
```

```tsx
// app/page.tsx
'use client'

export default function Page() {
  return (
    <arvea-button variant="primary">Submit</arvea-button>
  )
}
```

### Angular (Standalone)

```ts
// main.ts or app.config.ts
import '@arvea-ui/kit'
```

```ts
// app.component.ts
import { Component } from '@angular/core'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<arvea-button variant="primary">Submit</arvea-button>`
})
export class AppComponent {}
```

### Plain HTML

```html
<script type="module">
  import '@arvea-ui/kit'
</script>

<arvea-button variant="primary">Submit</arvea-button>
```

---

## Design Tokens

Import the CSS tokens in your global stylesheet or entry file:

```ts
import '@arvea-ui/kit/tokens.css'
```

Or in CSS:

```css
@import '@arvea-ui/kit/tokens.css';
```

---

## Components

### `<arvea-button>`

```html
<arvea-button variant="primary">Primary</arvea-button>
<arvea-button variant="secondary">Secondary</arvea-button>
<arvea-button variant="danger">Delete</arvea-button>
<arvea-button disabled>Disabled</arvea-button>
```

| Attribute  | Type                                  | Default     |
|------------|---------------------------------------|-------------|
| `variant`  | `primary` \| `secondary` \| `danger`  | `primary`   |
| `disabled` | `boolean`                             | `false`     |

---

### `<arvea-input>`

```html
<arvea-input label="Email" type="email" placeholder="you@arvea.com"></arvea-input>
<arvea-input label="Password" type="password" required></arvea-input>
```

| Attribute     | Type      | Default  |
|---------------|-----------|----------|
| `label`       | `string`  | —        |
| `type`        | `string`  | `text`   |
| `placeholder` | `string`  | —        |
| `required`    | `boolean` | `false`  |
| `disabled`    | `boolean` | `false`  |

---

### `<arvea-alert>`

```html
<arvea-alert type="success">Changes saved successfully.</arvea-alert>
<arvea-alert type="warning">Your session is about to expire.</arvea-alert>
<arvea-alert type="error">Something went wrong.</arvea-alert>
<arvea-alert type="info">A new version is available.</arvea-alert>
```

| Attribute | Type                                        | Default  |
|-----------|---------------------------------------------|----------|
| `type`    | `success` \| `warning` \| `error` \| `info` | `info`   |

---

### `<arvea-table>`

```html
<arvea-table
  .columns=${columns}
  .rows=${rows}
></arvea-table>
```

```ts
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { name: 'Mootez', role: 'Admin', status: 'Active' },
  { name: 'Sarra', role: 'Editor', status: 'Inactive' },
]
```

| Property   | Type       | Default |
|------------|------------|---------|
| `columns`  | `Column[]` | `[]`    |
| `rows`     | `Row[]`    | `[]`    |

---

## Theming

All components use **CSS Custom Properties** for theming. Override them in your global stylesheet to match Arvea's brand.

```css
@import '@arvea-ui/kit/tokens.css';

:root {
  /* Colors */
  --arvea-color-primary: #your-brand-color;
  --arvea-color-primary-hover: #your-brand-color-hover;
  --arvea-color-danger: #e53e3e;
  --arvea-color-success: #38a169;
  --arvea-color-warning: #d69e2e;
  --arvea-color-info: #3182ce;

  /* Typography */
  --arvea-font-family: 'Inter', sans-serif;
  --arvea-font-size-base: 14px;

  /* Spacing & Shape */
  --arvea-border-radius: 6px;
  --arvea-spacing-sm: 8px;
  --arvea-spacing-md: 16px;

  /* Input */
  --arvea-input-border-color: #cbd5e0;
  --arvea-input-focus-color: var(--arvea-color-primary);
}
```

CSS Custom Properties cross the Shadow DOM boundary — no special configuration needed.

---

## Package Contents

```
@arvea-ui/kit
├── dist/
│   ├── index.js       → ESM (import)
│   ├── index.cjs      → CommonJS (require)
│   └── index.d.ts     → TypeScript declarations
└── tokens.css         → Design tokens (CSS Custom Properties)
```

---

## Development

This package lives inside the `arvea-ui-kit` monorepo.

```bash
# Install dependencies (from repo root)
npm install

# Build the component package
npm run build --workspace=packages/components

# Start Storybook
npm run storybook

# Run Next.js demo
npm run dev --workspace=apps/next-demo

# Run Angular demo
npm run start --workspace=apps/angular-demo
```

---

## Versioning

This package follows [Semantic Versioning](https://semver.org/):

| Change type                        | Version bump |
|------------------------------------|--------------|
| Bug fix, no API change             | `patch`      |
| New component or new prop          | `minor`      |
| Removed/renamed component or prop  | `major`      |

---

## Internal use only

This package is maintained by the Arvea engineering team.  
For issues or contribution requests, open a ticket in the internal repository.