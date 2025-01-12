/* eslint-disable */
export default {
  displayName: 'example-backend',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/apps/example/backend',
  collectCoverageFrom: ['src/resolvers/**/*.ts', '!src/**/*.schema.ts', '!src/utils/**', '!src/**/index.ts', '!src/handler.ts', '!src/schemas/**'],
};
