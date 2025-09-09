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
    '!src/components/guests/CheckoutModal.tsx',











    
    '!src/components/booking-detail/BookingDetailPage.tsx',
    '!src/components/booking-detail/components/BookingInfo.tsx',
    '!src/components/booking-detail/components/PropertySupport.tsx',
    '!src/components/booking-detail/components/HotelImage.tsx',
    '!src/components/booking-detail/components/CancellationRules.tsx',
    '!src/components/booking-detail/components/CancelBookingModal.tsx',
    '!src/components/guests/BookingInfoCard.tsx',
    '!src/components/guests/BookingInfoCard.tsx',
    '!src/components/guests/BookingInfoCard.tsx',
    '!src/components/payment/_components/BookingPayment/BookingPayment.tsx',
    '!src/components/payment/_components/ConfirmedBooking/ConfirmedBooking.tsx',
    '!src/components/date/Date.tsx',
    '!src/components/hoteldetail/RoomInfo.tsx',
    '!src/components/hoteldetail/RoomInfoCard.tsx',
    '!src/components/hoteldetail/ReserveButton.tsx',
    '!src/components/hoteldetail/HotelInfo.tsx',
  ],
};
