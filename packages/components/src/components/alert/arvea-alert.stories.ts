import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@arvea-ui/components';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'arvea-alert',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    title: 'Heads up',
    dismissible: false,
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args: Record<string, any>) => html`
    <arvea-alert variant=${args.variant} title=${args.title}
      ?dismissible=${args.dismissible}>
      This is an informational message for the user.
    </arvea-alert>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <arvea-alert variant="info" title="Info">
        Your session will expire in 10 minutes.
      </arvea-alert>
      <arvea-alert variant="success" title="Success">
        Your changes have been saved successfully.
      </arvea-alert>
      <arvea-alert variant="warning" title="Warning">
        This action cannot be undone.
      </arvea-alert>
      <arvea-alert variant="danger" title="Error">
        Something went wrong. Please try again.
      </arvea-alert>
    </div>
  `,
};

export const Dismissible: Story = {
  render: () => html`
    <arvea-alert variant="info" title="Dismissible alert" dismissible>
      Click the X button to dismiss this alert.
    </arvea-alert>
  `,
};
