import { fireEvent, render, screen } from '@testing-library/react';
import { ReserveButton } from '@/components/hoteldetail/ReserveButton';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ReserveButton', () => {
  beforeEach(() => {
    mockPush.mockClear();
    localStorage.clear();
  });

  it('should render the button', () => {
    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Reserve');
  });

  it('should navigate to payment page when user has token', () => {
    // Set token in localStorage
    localStorage.setItem('token', 'fake-token');

    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/booking/1/payment');
  });

  it('should navigate to login page and save roomId when user has no token', () => {
    // No token in localStorage

    render(<ReserveButton roomId="1" />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('pendingRoomId')).toBe('1');
  });

  it('should handle different roomIds correctly', () => {
    localStorage.setItem('token', 'fake-token');

    render(<ReserveButton roomId="room-123" />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/booking/room-123/payment');
  });

  it('should save correct roomId when no token', () => {
    // No token in localStorage

    render(<ReserveButton roomId="room-456" />);
    const button = screen.getByTestId('reserve-button');
    fireEvent.click(button);

    expect(localStorage.getItem('pendingRoomId')).toBe('room-456');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
