import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

// Mock data for testing
export const mockHotel = {
  id: '1',
  name: 'Test Hotel',
  description: 'A beautiful test hotel',
  stars: 4,
  phone: '+1234567890',
  rating: 8.5,
  city: 'Test City',
  country: 'Test Country',
  location: '123 Test Street',
  languages: ['English', 'Spanish'],
  amenities: ['WIFI', 'POOL', 'GYM'],
  policies: [
    {
      checkIn: '14:00',
      checkOut: '11:00',
      specialCheckInInstructions: 'Please present valid ID',
      accessMethods: ['Key card'],
      childrenAndExtraBeds: 'Children under 12 stay free',
      pets: 'Pets not allowed',
    },
  ],
  optionalExtras: [
    {
      youNeedToKnow: 'Free breakfast included',
      weShouldMention: '24/7 front desk service',
    },
  ],
  faq: [
    {
      question: 'What time is check-in?',
      answer: 'Check-in is available from 2:00 PM',
    },
  ],
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
};

export const mockHotels = [
  mockHotel,
  {
    ...mockHotel,
    id: '2',
    name: 'Another Hotel',
    city: 'Another City',
    stars: 5,
    rating: 9.0,
  },
];

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: any[];
}

const AllTheProviders = ({ children, mocks = [] }: { children: React.ReactNode; mocks?: any[] }) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { mocks, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders mocks={mocks}>{children}</AllTheProviders>,
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock Next.js router
export const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

// Mock Next.js navigation
export const mockUseRouter = () => mockRouter;
export const mockUseParams = (params: Record<string, string>) => params;

// Utility functions for testing
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

export const createMockGraphQLResponse = (data: any, loading = false, error = null) => ({
  data,
  loading,
  error,
  refetch: jest.fn(),
  networkStatus: 7,
  called: true,
});

// Mock GraphQL mutations and queries
export const mockCreateHotelMutation = {
  request: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    query: require('@/generated').CreateHotelDocument,
    variables: {
      hotel: mockHotel,
    },
  },
  result: {
    data: {
      createHotel: {
        success: true,
        hotel: mockHotel,
      },
    },
  },
};

export const mockHotelsQuery = {
  request: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    query: require('@/generated').HotelsDocument,
  },
  result: {
    data: {
      hotels: mockHotels,
    },
  },
};

export const mockHotelQuery = {
  request: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    query: require('@/generated').HotelDocument,
    variables: { hotelId: '1' },
  },
  result: {
    data: {
      hotel: mockHotel,
    },
  },
};
