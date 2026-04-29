export const tokens = {
  colors: {
    primary: {
      500: 'var(--arvea-color-primary-500)',
      600: 'var(--arvea-color-primary-600)',
    },
  },
} as const;

export type TokenValue = string;