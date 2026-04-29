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

### Next.js (App Router) — Web Components directly

```tsx
// app/layout.tsx
import '@arvea-ui/kit/tokens.css'
```

```tsx
// app/components/MyComponent.tsx
'use client'
import '@arvea-ui/kit'

export default function MyComponent() {
  return (
    <arvea-button variant="primary">Submit</arvea-button>
  )
}
```

### Next.js (App Router) — React Wrappers (recommended)

Use the typed React wrappers powered by `@lit/react` — no `ref`, no `useEffect`, full type safety:

```tsx
'use client'
import { Button, Alert, Input } from '@arvea-ui/kit'
import { ArveaTable } from '@arvea-ui/kit'

export default function MyComponent() {
  return (
    <div>
      <ArveaTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ]}
        data={[
          { name: 'Mootez', role: 'Admin', status: 'Active' },
          { name: 'Sarra', role: 'Editor', status: 'Inactive' },
        ]}
      />
      <Alert variant="success">Changes saved successfully.</Alert>
      <Button variant="primary" onArvealClick={() => console.log('clicked')}>Submit</Button>
      <Input label="Email" type="email" placeholder="you@arvea.com" />
    </div>
  )
}
```

### Angular (Standalone)

```ts
// main.ts or app.config.ts
import '@arvea-ui/kit'
import '@arvea-ui/kit/tokens.css'
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
<link rel="stylesheet" href="node_modules/@arvea-ui/kit/tokens.css" />
<script type="module">
  import '@arvea-ui/kit'
</script>

<arvea-button variant="primary">Submit</arvea-button>
<arvea-alert variant="success">Done!</arvea-alert>
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

### `<arvea-button>` / `<Button>`

```html
<arvea-button variant="primary">Primary</arvea-button>
<arvea-button variant="secondary">Secondary</arvea-button>
<arvea-button variant="ghost">Ghost</arvea-button>
<arvea-button variant="danger">Delete</arvea-button>
<arvea-button disabled>Disabled</arvea-button>
<arvea-button loading>Loading...</arvea-button>
```

| Attribute    | Type                                           | Default     |
|--------------|------------------------------------------------|-------------|
| `variant`    | `primary` \| `secondary` \| `ghost` \| `danger` | `primary`   |
| `size`       | `sm` \| `md` \| `lg`                           | `md`        |
| `disabled`   | `boolean`                                      | `false`     |
| `loading`    | `boolean`                                      | `false`     |
| `full-width` | `boolean`                                      | `false`     |
| `type`       | `button` \| `submit` \| `reset`                | `button`    |

**Events:** `arvea-click`

---

### `<arvea-input>` / `<Input>`

```html
<arvea-input label="Email" type="email" placeholder="you@arvea.com"></arvea-input>
<arvea-input label="Password" type="password" required></arvea-input>
<arvea-input label="Username" error="Already taken"></arvea-input>
<arvea-input label="Bio" hint="Max 200 characters"></arvea-input>
```

| Attribute     | Type                                                      | Default  |
|---------------|-----------------------------------------------------------|----------|
| `label`       | `string`                                                  | —        |
| `type`        | `text` \| `email` \| `password` \| `number` \| `search`  | `text`   |
| `placeholder` | `string`                                                  | —        |
| `value`       | `string`                                                  | —        |
| `required`    | `boolean`                                                 | `false`  |
| `disabled`    | `boolean`                                                 | `false`  |
| `error`       | `string`                                                  | —        |
| `hint`        | `string`                                                  | —        |
| `size`        | `sm` \| `md` \| `lg`                                     | `md`     |

**Events:** `arvea-input`, `arvea-change`, `arvea-focus`, `arvea-blur`

---

### `<arvea-alert>` / `<Alert>`

```html
<arvea-alert variant="success">Changes saved successfully.</arvea-alert>
<arvea-alert variant="warning">Your session is about to expire.</arvea-alert>
<arvea-alert variant="danger">Something went wrong.</arvea-alert>
<arvea-alert variant="info">A new version is available.</arvea-alert>
<arvea-alert variant="success" size="sm" dismissible>Compact dismissible alert.</arvea-alert>
```

| Attribute     | Type                                          | Default  |
|---------------|-----------------------------------------------|----------|
| `variant`     | `success` \| `warning` \| `danger` \| `info`  | `info`   |
| `size`        | `sm` \| `md` \| `lg`                          | `md`     |
| `title`       | `string`                                      | —        |
| `dismissible` | `boolean`                                     | `false`  |

**Events:** `arvea-dismiss`

---

### `<arvea-table>` / `<ArveaTable>`

```ts
import { ArveaTable } from '@arvea-ui/kit'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status', badge: { active: 'success', inactive: 'neutral' } },
]

const data = [
  { name: 'Mootez', role: 'Admin', status: 'Active' },
  { name: 'Sarra', role: 'Editor', status: 'Inactive' },
]
```

```tsx
<ArveaTable columns={columns} data={data} />
```

| Property     | Type                              | Default    |
|--------------|-----------------------------------|------------|
| `columns`    | `ColumnDef[]`                     | `[]`       |
| `data`       | `Record<string, unknown>[]`       | `[]`       |
| `actions`    | `RowAction[]`                     | `[]`       |
| `pageSize`   | `number`                          | `0` (off)  |
| `responsive` | `scroll` \| `hide` \| `cards`    | `scroll`   |

**Events:** `arvea-sort`, `arvea-page-change`

---

## Theming

All components use **CSS Custom Properties** for theming. Override them in your global stylesheet.

```css
@import '@arvea-ui/kit/tokens.css';

:root {
  /* Colors */
  --arvea-color-primary-600: #2563eb;
  --arvea-color-primary-700: #1d4ed8;
  --arvea-color-danger-500: #ef4444;
  --arvea-color-success-500: #22c55e;
  --arvea-color-warning-500: #f59e0b;

  /* Typography */
  --arvea-font-family-base: 'Inter', sans-serif;
  --arvea-font-size-base: 1rem;

  /* Spacing */
  --arvea-space-2: 0.5rem;
  --arvea-space-4: 1rem;

  /* Shape */
  --arvea-radius-md: 6px;
  --arvea-radius-lg: 8px;
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

# Build all packages
npm run build

# Start Storybook
npm run storybook

# Run Next.js demo
npm run dev:next

# Run Angular demo
npm run start --workspace=apps/angular-demo

# Run tests
npm run test
```

---

## Release Process (Changesets)

This package uses [Changesets](https://github.com/changesets/changesets) for versioning.

```bash
# 1. Describe your change
npx changeset

# 2. Apply version bump + update CHANGELOG
npx changeset version

# 3. Build
npm run build

# 4. Publish to npm
cd packages/components && npm publish

# 5. Push to GitHub
git add . && git commit -m "chore: release" && git push origin master
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