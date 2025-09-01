import { HotelDocument } from '@/generated';
import { render, waitFor, screen } from '@testing-library/react';
import { HotelInfo } from '@/components/hoteldetail/HotelInfo';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({ hotelId: '1' }),
}));

const getHotelsMock: MockedResponse = {
  request: {
    query: HotelDocument,
    variables: {
      hotelId: '1',
    },
  },
  result: {
    data: {
      hotel: {
        id: '1',
        name: 'Test Hotel',
        description: 'This is a mock description for Test Hotel.',
        images: ['https://example.com/image1.jpg'],
        stars: 4,
        phone: '+976 99112233',
        rating: 9.2,
        city: 'Ulaanbaatar',
        country: 'Mongolia',
        location: 'Sukhbaatar District, Peace Avenue',
        amenities: ['Wifi', 'Parking', 'AirConditioning'],
        languages: ['English', 'Mongolian'],
        policies: {
          checkIn: '14:00',
          checkOut: '12:00',
          specialCheckInInstructions: 'Bring your passport.',
          accessMethods: 'Front desk',
          childrenAndExtraBeds: 'Allowed with extra charge',
          pets: 'No pets allowed',
          __typename: 'Policies',
        },
        optionalExtras: {
          youNeedToKnow: 'Extra fees may apply.',
          weShouldMention: 'No smoking in rooms.',
          __typename: 'OptionalExtras',
        },
        faq: [
          {
            question: 'Is breakfast included?',
            answer: 'Yes, free breakfast is included.',
            __typename: 'Faq',
          },
        ],
        __typename: 'Hotel',
      },
    },
  },
};

describe('HotelInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders correct number of stars with proper classes', async () => {
    render(
      <MockedProvider mocks={[getHotelsMock]} addTypename={true}>
        <HotelInfo />
      </MockedProvider>
    );

    await waitFor(() => {
      for (let i = 0; i < 5; i++) {
        const star = screen.getByTestId(`Star ${i}`);
        expect(star).toBeInTheDocument();

        if (i < 4) {
          expect(star).toHaveClass('text-yellow-500');
        } else {
          expect(star).toHaveClass('text-gray-300');
        }
      }
    });
  });
});
