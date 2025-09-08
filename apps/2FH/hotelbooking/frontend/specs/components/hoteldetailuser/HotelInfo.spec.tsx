import { render, screen, waitFor } from '@testing-library/react';
import { HotelInfo } from '@/components/hoteldetail/HotelInfo';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { HotelDocument } from '@/generated';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ hotelId: '1' }),
}));

const getHotelMock: MockedResponse = {
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
        name: 'Hotel 1',
        description: 'Hotel 1 description',
        images: ['/images/hotel-bar.png', '/images/hotel-exterior.png', '/images/hotel-room1.png', '/images/hotel-room2.png', '/images/hotel-room3.png'],
        stars: 5,
        phone: '1234567890',
        rating: 5,
        city: 'Hotel 1 city',
        country: 'Hotel 1 country',
        location: 'Hotel 1 location',
        amenities: ['Hotel 1 amenity'],
      },
    },
  },
};

describe('HotelInfo', () => {
  it('should render the hotel info', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[getHotelMock]}>
        <HotelInfo />
      </MockedProvider>
    );

    expect(await screen.findByAltText('hotel-bar-lounge')).toHaveAttribute('src', '/images/hotel-bar.png');

    expect(await screen.findByAltText('hotel-exterior')).toHaveAttribute('src', '/images/hotel-exterior.png');

    expect(await screen.findByAltText('hotel-room1')).toHaveAttribute('src', '/images/hotel-room1.png');

    expect(await screen.findByAltText('hotel-room2')).toHaveAttribute('src', '/images/hotel-room2.png');
    expect(await screen.findByAltText('hotel-room3')).toHaveAttribute('src', '/images/hotel-room3.png');

    await waitFor(() => {
      expect(getByTestId('hotel-info')).toBeInTheDocument();
    });
  });
});
