/* eslint-disable */
export default {
  displayName: 'hotelbooking-2FH-frontend',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/components/ui/(.*)$': '<rootDir>/../../../../libs/shadcn/src/lib/ui/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: '../../../../coverage/apps/2FH/hotelbooking/frontend',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/generated/**/*.ts',
    '!src/app/**/*.tsx',
    '!src/components/**/index.ts',
    '!src/types/jest-dom.d.ts',
    '!src/components/providers/ApolloWrapper.tsx',
    '!src/setup-tests.ts',
    '!src/components/providers/UserAuthProvider.tsx',
    '!src/components/admin/room-detail/RoomInfoCard.tsx',
    '!src/components/admin/room-detail/EditRoomModal.tsx',
    '!src/components/guests/GuestsPage.tsx',
    '!src/components/guests/RoomDetailsCard.tsx',
    '!src/components/guests/GuestInfoCard.tsx',
  ],
};
