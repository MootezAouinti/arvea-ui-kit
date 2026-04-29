import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@arvea-ui/components';

const meta: Meta = {
  title: 'Components/Button',
  component: 'arvea-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
};
export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: (args : Record<string, any>) => html`
    <arvea-button variant=${args.variant} size=${args.size}
      ?disabled=${args.disabled} ?loading=${args.loading}>
      Save changes
    </arvea-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <arvea-button variant="primary">Primary</arvea-button>
      <arvea-button variant="secondary">Secondary</arvea-button>
      <arvea-button variant="ghost">Ghost</arvea-button>
      <arvea-button variant="danger">Danger</arvea-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center;">
      <arvea-button size="sm">Small</arvea-button>
      <arvea-button size="md">Medium</arvea-button>
      <arvea-button size="lg">Large</arvea-button>
    </div>
  `,
};

export const Loading: Story = {
  render: () => html`<arvea-button loading>Saving...</arvea-button>`,
};

export const Disabled: Story = {
  render: () => html`<arvea-button disabled>Disabled</arvea-button>`,
};
