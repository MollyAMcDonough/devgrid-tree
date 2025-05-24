const config = {
  preset: 'ts-jest/presets/default-esm', // <--- Use ESM preset!
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts?(x)', '**/__tests__/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }], // <--- ESM transform
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // <--- Tell Jest to treat TS/TSX as ESM
};
export default config;
