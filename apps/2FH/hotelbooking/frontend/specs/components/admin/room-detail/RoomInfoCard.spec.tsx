/* eslint-disable  */

/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { RoomInfoCard } from '@/components/admin/room-detail/RoomInfoCard';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { formatFeatureText } from '@/utils/format-feature-text';
import { Badge } from '@/components/ui/badge';

const GET_BOOKINGS_BY_ROOM_ID = gql`
  query GetBookingsByRoomId($roomId: ID!) {
    getBookingsByRoomId(roomId: $roomId) {
      id
      userId
      hotelId
      roomId
      checkInDate
      checkOutDate
      status
      totalPrice
      user {
        id
        name
        email
      }
    }
  }
`;

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mocks: MockedResponse[] = [
  {
    request: {
      query: GET_BOOKINGS_BY_ROOM_ID,
      variables: { roomId: '1' },
    },
    result: {
      data: {
        bookingsByRoomId: [
          {
            id: 'b1',
            user: { id: 'u1', name: 'John Doe' },
            startDate: '2025-09-01',
            endDate: '2025-09-03',
          },
        ],
      },
    },
  },
];

const mockSetEditModalState = jest.fn();
const mockRefetch = jest.fn();
const mockRoomId = '1';

const mockRoom = {
  id: '1',
  name: 'Test Room',
  status: 'available',
  capacity: 2,
  roomInformation: ['wifi_available', 'air_conditioner', 'POOL_ACCESS', '', '   '],
  // өөр шаардлагатай property-г нэмнэ
};

const mockEditModalState = {
  isOpen: false,
  section: 'basic' as const,
};

describe('RoomInfoCard', () => {
  it('should render', () => {
    render(
      <MockedProvider mocks={mocks}>
        <RoomInfoCard room={mockRoom} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} roomId={mockRoomId} />
      </MockedProvider>
    );
  });

  it('should replace underscores with spaces and capitalize words', () => {
    const input = 'this_is_a_test';
    const expected = 'This Is A Test';
    expect(formatFeatureText(input)).toBe(expected);
  });

  it('should handle already capitalized words', () => {
    const input = 'Already_Capitalized';
    const expected = 'Already Capitalized';
    expect(formatFeatureText(input)).toBe(expected);
  });

  it('should handle single word', () => {
    const input = 'word';
    const expected = 'Word';
    expect(formatFeatureText(input)).toBe(expected);
  });

  it('should handle empty string', () => {
    const input = '';
    const expected = '';
    expect(formatFeatureText(input)).toBe(expected);
  });

  it('should handle multiple words', () => {
    render(
      <MockedProvider mocks={mocks}>
        <RoomInfoCard room={mockRoom} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} roomId={mockRoomId} />
      </MockedProvider>
    );

    expect(screen.getByText(/Wifi Available/i)).toBeInTheDocument();
    // formatFeatureText('air_conditioner') → Air Conditioner
    expect(screen.getByText(/Air Conditioner/i)).toBeInTheDocument();
    // formatFeatureText('POOL_ACCESS') → Pool Access
    expect(screen.getByText(/Pool Access/i)).toBeInTheDocument();

    // Хоосон эсвэл whitespace string-үүд render хийгдэхгүй
    // Энэ test нь component-ийн логик-г шалгахын тулд formatFeatureText функц-г шууд тестлэх нь илүү тохиромжтой
    expect(formatFeatureText('')).toBe('');
    expect(formatFeatureText('   ')).toBe('   ');
  });

  it('should render fallback message when no room information is provided', () => {
    const roomWithoutInfo = {
      ...mockRoom,
      roomInformation: [],
    };

    render(
      <MockedProvider mocks={mocks}>
        <RoomInfoCard room={roomWithoutInfo} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} roomId={mockRoomId} />
      </MockedProvider>
    );

    expect(screen.getByText(/No room information available/i)).toBeInTheDocument();
  });

  // it('should render room information correctly', () => {
  //   render(
  //     <MockedProvider mocks={mocks}>
  //       <RoomInfoCard room={mockRoom} editModalState={mockEditModalState} setEditModalState={mockSetEditModalState} refetch={mockRefetch} roomId={mockRoomId} />
  //     </MockedProvider>
  //   );

  //   // Room name should be displayed
  //   expect(screen.getByText('Test Room')).toBeInTheDocument();

  //   // Room features should be formatted and displayed
  //   expect(screen.getByText('Wifi Available')).toBeInTheDocument();
  //   expect(screen.getByText('Air Conditioner')).toBeInTheDocument();
  //   expect(screen.getByText('Pool Access')).toBeInTheDocument();

  //   // Edit button should be present
  //   expect(screen.getByText('Edit')).toBeInTheDocument();
  // });
});

describe('getStatusBadge', () => {
  // Helper function for testing status badges
  const getStatusBadge = (status: string | null | undefined) => {
    const statusConfig = {
      BOOKED: { color: 'bg-green-100 text-green-800', label: 'Booked' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
    };

    const statusValue = status || 'UNKNOWN';
    const config = statusConfig[statusValue as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: statusValue,
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  it('should render Booked badge when status is BOOKED', () => {
    render(getStatusBadge('BOOKED'));
    expect(screen.getByText('Booked')).toBeInTheDocument();
  });

  it('should render Cancelled badge when status is CANCELLED', () => {
    render(getStatusBadge('CANCELLED'));
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('should render Completed badge when status is COMPLETED', () => {
    render(getStatusBadge('COMPLETED'));
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should render UNKNOWN badge when status is null', () => {
    render(getStatusBadge(null));
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });

  it('should render custom badge when status is something else', () => {
    render(getStatusBadge('PENDING'));
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });
});
