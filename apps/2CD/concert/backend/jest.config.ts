/* eslint-disable */
export default {
  displayName: 'Concert-2025-2CD',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/apps/2CD/concert/backend',
  collectCoverageFrom: ['src/resolvers/**/*.ts', '!src/**/*.schema.ts', '!src/utils/**', '!src/**/index.ts', '!src/handler.ts', '!src/schemas/**'],
};
