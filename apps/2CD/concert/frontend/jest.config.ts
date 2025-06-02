/* eslint-disable */
export default {
  displayName: 'concert-client-2025-2cd',
  preset: '../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/apps/2CD/concert/frontend',
  collectCoverageFrom: [
    'src/app/**/_components/**/*.tsx',
    'src/app/**/components/*.tsx',
    'src/app/**/_components/*.tsx',
    '!src/app/**/_features/**/*.tsx',
    '!src/**/generated/**/*.ts',
    '!src/components/providers/*.tsx',
  ],
};
