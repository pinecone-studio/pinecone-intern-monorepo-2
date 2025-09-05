/* eslint-disable */
export default {
  displayName: 'backend',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/apps/2FH/instagram/backend',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 98,
      lines: 99,
      statements: 99,
    },
  },
};
