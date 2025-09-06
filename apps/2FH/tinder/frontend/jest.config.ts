/* eslint-disable */
export default {
  displayName: '2FH-tinder-frontend',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/apps/2FH/tinder/frontend',

  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/generated/**/*.ts', '!src/app/**/*.tsx', '!src/components/providers/*.tsx', '!src/utils/*.ts', '!src/hooks/*.ts'],
  testPathIgnorePatterns: [

    '/specs/',   // ✅ specs доторхи бүх test файлуудыг ignore хийнэ
  ]
};