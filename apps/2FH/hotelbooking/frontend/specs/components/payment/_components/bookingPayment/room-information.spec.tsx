import { RoomInformation } from '@/components/payment/_components/RoomInformation';
import { render, screen } from '@testing-library/react';

// GraphQL hook-ийг mock хийж байна
jest.mock('@/generated', () => ({
  useHotelByIdForBookingQuery: jest.fn(),
}));

// Next.js Image-г жинхэнэ зургаар тестлэх хэрэггүй тул шууд "img" болгож mock хийж болно
jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt || 'image'} />;
});

const mockUseHotelByIdForBookingQuery = require('@/generated').useHotelByIdForBookingQuery as jest.Mock;

describe('RoomInformation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hotel info with image when data exists', () => {
    mockUseHotelByIdForBookingQuery.mockReturnValue({
      data: {
        hotel: {
          id: '68b7bee57d52b027d4752888',
          name: 'Test Hotel',
          location: 'Ulaanbaatar, Mongolia',
          rating: 5,
          images: ['/Images/hotel.jpg'],
        },
      },
    });

    render(<RoomInformation />);

    expect(screen.getByTestId('Room-Information-Container')).toBeInTheDocument();
    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    expect(screen.getByText('Ulaanbaatar, Mongolia')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    // Зурагтай үед img tag байх ёстой
    const image = screen.getByRole('img', { name: /Picture of the author/i });
    expect(image).toHaveAttribute('src', '/Images/hotel.jpg');
  });

  it('renders NoImage component when no images available', () => {
    mockUseHotelByIdForBookingQuery.mockReturnValue({
      data: {
        hotel: {
          id: '68b7bee57d52b027d4752888',
          name: 'Hotel Without Image',
          location: 'Darkhan, Mongolia',
          rating: 3,
          images: [],
        },
      },
    });

    render(<RoomInformation />);

    expect(screen.getByText('Hotel Without Image')).toBeInTheDocument();
    expect(screen.getByText('Darkhan, Mongolia')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByTestId('No-Image-Component')).toBeInTheDocument();
  });
});
