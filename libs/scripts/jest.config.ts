/* eslint-disable */
export default {
  displayName: 'scripts',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/scripts/src',
  collectCoverageFrom: ['*.ts', '**/*.ts', '!jest.config.ts', '!**/index.ts'],
};
