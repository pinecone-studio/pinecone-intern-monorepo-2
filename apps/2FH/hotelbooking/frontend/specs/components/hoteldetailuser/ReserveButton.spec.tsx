import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReserveButton } from '@/components/hoteldetail/ReserveButton';

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

describe('ReserveButton', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUpdateStatus.mockClear();
    localStorage.clear();

    // Default mock
    mockUseRoomStatusUpdateMutation.mockReturnValue([mockUpdateStatus, { loading: false, error: null }]);
  });

  it('should render the button', () => {
    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Reserve');
  });

  it('should call updateStatus and navigate to payment when user has token', async () => {
    localStorage.setItem('token', 'fake-token');
    mockUpdateStatus.mockResolvedValue({});

    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith({
        variables: {
          updateRoomId: '1',
          input: {
            status: 'PENDING',
          },
        },
      });
      expect(mockPush).toHaveBeenCalledWith('/booking/1/payment');
    });
  });

  it('should navigate to login page and save roomId when user has no token', () => {
    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('pendingRoomId')).toBe('1');
  });

  it('should show Reserving... when loading is true', () => {
    // Override for this test
    mockUseRoomStatusUpdateMutation.mockReturnValue([mockUpdateStatus, { loading: true, error: null }]);

    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');

    expect(button).toHaveTextContent('Reserving...');
    expect(button).toBeDisabled();
  });

  it('should handle error when updateStatus fails', async () => {
    localStorage.setItem('token', 'fake-token');
    mockUpdateStatus.mockRejectedValue(new Error('Update failed'));

    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalled();
      // Should not navigate on error
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
