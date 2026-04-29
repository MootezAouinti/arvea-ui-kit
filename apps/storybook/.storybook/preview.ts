import type { Preview } from '@storybook/web-components-vite';
import '@arvea-ui/components';
import '../../../packages/core/src/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;