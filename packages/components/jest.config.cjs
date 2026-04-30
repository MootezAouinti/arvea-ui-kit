/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  setupFiles: ['./src/test-setup.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.[jt]sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          target: 'ES2020',
          experimentalDecorators: true,
          useDefineForClassFields: false,
          allowJs: true,
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

module.exports = config;
