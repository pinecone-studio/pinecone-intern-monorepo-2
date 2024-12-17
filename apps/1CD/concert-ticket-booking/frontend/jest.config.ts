/* eslint-disable */
export default {
  displayName: 'concert-ticket-booking-frontend',
  preset: '../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/apps/1CD/concert-ticket-booking/frontend',
  collectCoverageFrom: ['src/**/*.{tsx,js,jsx}', '!src/**/generated/**/*.ts', '!src/app/**/*.tsx', '!src/components/providers/*.tsx'],
};
