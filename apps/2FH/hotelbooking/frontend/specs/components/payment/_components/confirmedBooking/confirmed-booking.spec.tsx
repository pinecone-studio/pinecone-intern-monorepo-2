// ConfirmedBooking.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';

import { useOtpContext } from '@/components/providers';
import { useHotelQuery, useGetRoomQuery } from '@/generated';
import { useParams, useRouter } from 'next/navigation';
import { ConfirmedBooking } from '@/components/payment/_components/ConfirmedBooking/ConfirmedBooking';

jest.mock('@/components/providers');
jest.mock('@/generated');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('ConfirmedBooking', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useParams as jest.Mock).mockReturnValue({ userid: '123' });

    (useOtpContext as jest.Mock).mockReturnValue({
      bookingData: {
        hotelId: 'hotel-1',
        roomId: 'room-1',
        checkInDate: '2025-09-05',
        checkOutDate: '2025-09-10',
      },
    });

    (useHotelQuery as jest.Mock).mockReturnValue({
      data: {
        hotel: {
          name: 'Shangri-La Hotel',
          location: 'Ulaanbaatar, Mongolia',
          rating: 4.5,
        },
      },
    });

    (useGetRoomQuery as jest.Mock).mockReturnValue({
      data: {
        getRoom: {
          name: 'Deluxe Room',
          foodAndDrink: ['Breakfast included'],
          bedRoom: ['Single Bed', 'Double Bed', 'King Bed'],
          internet: ['Free WiFi'],
        },
      },
    });
  });

  it('1. Renders success booking message', () => {
    render(<ConfirmedBooking />);
    expect(screen.getByText('You are confirmed')).toBeInTheDocument();
    expect(screen.getByText('Shangri-La Hotel')).toBeInTheDocument();
    expect(screen.getByText('Ulaanbaatar, Mongolia')).toBeInTheDocument();
  });

  it('2. Renders booking dates', () => {
    render(<ConfirmedBooking />);
    expect(screen.getByText('2025-09-05')).toBeInTheDocument();
    expect(screen.getByText('2025-09-10')).toBeInTheDocument();
  });

  it('3. Renders room information', () => {
    render(<ConfirmedBooking />);
    expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
    expect(screen.getByText('Breakfast included')).toBeInTheDocument();
    expect(screen.getByText('King Bed')).toBeInTheDocument();
    expect(screen.getByText('Free WiFi')).toBeInTheDocument();
  });

  it('4. Navigates to booking history when button clicked', () => {
    render(<ConfirmedBooking />);
    const button = screen.getByRole('button', { name: /view your book/i });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/booking/123/history');
  });
});
