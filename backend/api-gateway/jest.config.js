module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },
};
