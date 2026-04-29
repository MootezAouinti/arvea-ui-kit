import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          experimentalDecorators: true,
          useDefineForClassFields: false,
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lit|@lit|lit-html|lit-element|@lit-labs)/)',
  ],
  testMatch: ['**/src/**/*.test.ts'],
  injectGlobals: true,
};

export default config;
