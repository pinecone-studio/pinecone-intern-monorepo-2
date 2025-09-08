import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReserveButton } from '@/components/hoteldetail/ReserveButton';
import { Accessibility, Bathroom, BedRoom, Entertainment, FoodAndDrink, Internet, Other, Room, RoomInformation, Status, TypePerson } from '@/generated';

const mockPush = jest.fn();
const mockUpdateStatus = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseRoomStatusUpdateMutation = jest.fn();

jest.mock('@/generated', () => ({
  useRoomStatusUpdateMutation: () => mockUseRoomStatusUpdateMutation(),
  Status: {
    Pending: 'PENDING',
  },
}));

const room: Room = {
  id: '1',
  hotelId: 'hotel1',
  name: 'Test Room',
  pricePerNight: 100,
  imageURL: ['image1.jpg'],
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  typePerson: 'single' as TypePerson,
  roomInformation: ['free_wifi' as RoomInformation],
  bathroom: ['private_bathroom' as Bathroom],
  accessibility: ['wheelchair_accessible' as Accessibility],
  internet: ['free_wifi' as Internet],
  foodAndDrink: ['free_breakfast' as FoodAndDrink],
  bedRoom: ['air_conditioner' as BedRoom],
  other: ['daily_housekeeping' as Other],
  entertainment: ['tv' as Entertainment],
  bedNumber: 1,
  status: Status.Available,
};

describe('ReserveButton', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUpdateStatus.mockClear();
    localStorage.clear();

    mockUseRoomStatusUpdateMutation.mockReturnValue([mockUpdateStatus, { loading: false, error: null }]);
  });

  it('should render the button', () => {
    render(<ReserveButton room={room} />);
    const button = screen.getByTestId('reserve-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Reserve');
  });

  it('should call updateStatus and navigate to payment when user has token', async () => {
    localStorage.setItem('token', 'fake-token');
    mockUpdateStatus.mockResolvedValue({});

    render(<ReserveButton room={room} />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith({
        variables: {
          updateRoomId: room.id,
          input: {
            status: Status.Pending,
            bedNumber: room.bedNumber,
          },
        },
      });
      expect(mockPush).toHaveBeenCalledWith('/booking/1/payment');
    });
  });

  it('should navigate to login page and save roomId when user has no token', () => {
    render(<ReserveButton room={room} />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('pendingRoomId')).toBe('1');
  });

  it('should show Reserving... when loading is true', () => {
    // Override for this test
    mockUseRoomStatusUpdateMutation.mockReturnValue([mockUpdateStatus, { loading: true, error: null }]);

    render(<ReserveButton room={room} />);
    const button = screen.getByTestId('reserve-button');

    expect(button).toHaveTextContent('Reserving...');
    expect(button).toBeDisabled();
  });

  it('should handle error when updateStatus fails', async () => {
    localStorage.setItem('token', 'fake-token');
    mockUpdateStatus.mockRejectedValue(new Error('Update failed'));

    render(<ReserveButton room={room} />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalled();
      // Should not navigate on error
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
