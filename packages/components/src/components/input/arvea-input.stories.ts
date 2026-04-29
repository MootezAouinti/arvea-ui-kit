import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@arvea-ui/components';

const meta: Meta = {
  title: 'Components/Input',
  component: 'arvea-input',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    hint: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'text',
    disabled: false,
    required: false,
    error: '',
    hint: '',
    size: 'md',
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args: Record<string, any>) => html`
    <arvea-input
      label=${args.label}
      placeholder=${args.placeholder}
      type=${args.type}
      ?disabled=${args.disabled}
      ?required=${args.required}
      error=${args.error}
      hint=${args.hint}
      size=${args.size}
    ></arvea-input>
  `,
};

export const WithError: Story = {
  render: () => html`
    <arvea-input
      label="Email address"
      value="invalid-email"
      error="Please enter a valid email address"
    ></arvea-input>
  `,
};

export const WithHint: Story = {
  render: () => html`
    <arvea-input
      label="Username"
      hint="Must be at least 3 characters"
      placeholder="mootez"
    ></arvea-input>
  `,
};

export const Required: Story = {
  render: () => html`
    <arvea-input
      label="Full name"
      required
      placeholder="Mootez Aouinti"
    ></arvea-input>
  `,
};
