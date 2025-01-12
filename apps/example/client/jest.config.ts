/* eslint-disable */
export default {
  displayName: 'client',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/apps/example/client',
  collectCoverageFrom: ['!**/index.ts', '!src/app/**/*.tsx', '!*.*', '!src/components/providers/ApolloProvider.tsx', '!.next'],
};
