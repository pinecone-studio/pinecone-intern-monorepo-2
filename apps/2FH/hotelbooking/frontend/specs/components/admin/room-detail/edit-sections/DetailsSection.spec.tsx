/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailsSection } from '@/components/admin/room-detail/edit-sections/DetailsSection';

// Mock the Select component to avoid Radix UI issues
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select">
      <button data-testid="select-trigger" onClick={() => onValueChange && onValueChange('booked')}>
        {value || 'Select room status'}
      </button>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-testid={`select-item-${value}`}>{children}</div>,
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger-wrapper">{children}</div>,
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
}));

describe('DetailsSection', () => {
  const mockRoom = {
    roomInformation: 'This is a detailed room description with amenities and policies.',
    status: 'available',
  };

  const defaultProps = {
    room: mockRoom,
    handleInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<DetailsSection {...defaultProps} />);
    expect(screen.getByLabelText('Room Information')).toBeInTheDocument();
    expect(screen.getByText('Room Status')).toBeInTheDocument();
  });

  it('displays current room values', () => {
    render(<DetailsSection {...defaultProps} />);
    expect(screen.getByDisplayValue(mockRoom.roomInformation)).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
  });

  it('calls handleInputChange when room information changes', () => {
    render(<DetailsSection {...defaultProps} />);
    const roomInfoTextarea = screen.getByLabelText('Room Information');

    fireEvent.change(roomInfoTextarea, { target: { value: 'Updated room information' } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', 'Updated room information');
  });

  it('calls handleInputChange when status changes via Select onValueChange', () => {
    render(<DetailsSection {...defaultProps} />);

    const selectTrigger = screen.getByTestId('select-trigger');
    fireEvent.click(selectTrigger);

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('status', 'booked');
  });

  it('handles room with null/undefined values', () => {
    const roomWithNulls = { roomInformation: null, status: undefined };
    render(<DetailsSection {...defaultProps} room={roomWithNulls} />);
    expect(screen.getByLabelText('Room Information')).toHaveValue('');
    expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
  });

  it('handles room with empty string values', () => {
    const roomWithEmpty = { roomInformation: '', status: '' };
    render(<DetailsSection {...defaultProps} room={roomWithEmpty} />);
    expect(screen.getByLabelText('Room Information')).toHaveValue('');
    expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
  });

  it('displays correct placeholder text for room information', () => {
    render(<DetailsSection {...defaultProps} />);
    const roomInfoTextarea = screen.getByPlaceholderText('Enter detailed room information, policies, and any special notes...');
    expect(roomInfoTextarea).toBeInTheDocument();
  });

  it('handles different status values correctly', () => {
    const statuses = ['booked', 'cancelled', 'pending', 'completed', 'available'] as const;

    statuses.forEach((status) => {
      const { rerender } = render(<DetailsSection {...defaultProps} room={{ ...mockRoom, status }} />);
      expect(screen.getByTestId('select-trigger')).toHaveTextContent(status);
      rerender(<div />);
    });
  });

  it('renders status select component correctly', () => {
    render(<DetailsSection {...defaultProps} />);
    const statusSelect = screen.getByTestId('select-trigger');
    expect(statusSelect).toBeInTheDocument();
    expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
  });

  it('has correct textarea attributes', () => {
    render(<DetailsSection {...defaultProps} />);
    const roomInfoTextarea = screen.getByLabelText('Room Information');
    expect(roomInfoTextarea).toHaveAttribute('rows', '6');
    expect(roomInfoTextarea).toHaveClass('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-md');
  });

  it('handles all status options', () => {
    const statusOptions = [
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'booked', label: 'Booked' },
      { value: 'pending', label: 'Pending' },
      { value: 'completed', label: 'Completed' },
      { value: 'available', label: 'Available' },
    ];

    statusOptions.forEach((option) => {
      const { rerender } = render(<DetailsSection {...defaultProps} room={{ ...mockRoom, status: option.value }} />);
      expect(screen.getByTestId('select-trigger')).toHaveTextContent(option.value);
      rerender(<div />);
    });
  });

  it('handles roomInformation with special characters', () => {
    const roomWithSpecialChars = {
      ...mockRoom,
      roomInformation: 'Room with special chars: @#$%^&*()_+-=[]{}|;:,.<>?',
    };

    render(<DetailsSection {...defaultProps} room={roomWithSpecialChars} />);

    const roomInfoTextarea = screen.getByLabelText('Room Information');
    fireEvent.change(roomInfoTextarea, { target: { value: 'New content with special chars: !@#$%' } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', 'New content with special chars: !@#$%');
  });

  it('handles very long room information text', () => {
    const longText = 'A'.repeat(1000);

    render(<DetailsSection {...defaultProps} />);

    const roomInfoTextarea = screen.getByLabelText('Room Information');
    fireEvent.change(roomInfoTextarea, { target: { value: longText } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', longText);
  });

  it('handles roomInformation with newlines', () => {
    const multilineText = 'Line 1\nLine 2\nLine 3';

    render(<DetailsSection {...defaultProps} />);

    const roomInfoTextarea = screen.getByLabelText('Room Information');
    fireEvent.change(roomInfoTextarea, { target: { value: multilineText } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', multilineText);
  });

  it('handles status change with different values', () => {
    const { rerender } = render(<DetailsSection {...defaultProps} />);

    // Test with different status values
    const statuses = ['cancelled', 'booked', 'pending', 'completed'];

    statuses.forEach((status) => {
      rerender(<DetailsSection {...defaultProps} room={{ ...mockRoom, status }} />);
      expect(screen.getByTestId('select-trigger')).toHaveTextContent(status);
    });
  });

  it('handles roomInformation with HTML-like content', () => {
    const htmlLikeText = '<div>Room info</div><script>alert("test")</script>';

    render(<DetailsSection {...defaultProps} />);

    const roomInfoTextarea = screen.getByLabelText('Room Information');
    fireEvent.change(roomInfoTextarea, { target: { value: htmlLikeText } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', htmlLikeText);
  });

  it('handles empty roomInformation after clearing', () => {
    render(<DetailsSection {...defaultProps} />);

    const roomInfoTextarea = screen.getByLabelText('Room Information');
    fireEvent.change(roomInfoTextarea, { target: { value: '' } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', '');
  });

  it('handles status with null value', () => {
    const roomWithNullStatus = { ...mockRoom, status: null };
    render(<DetailsSection {...defaultProps} room={roomWithNullStatus} />);

    expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
  });

  it('handles status with undefined value', () => {
    const roomWithUndefinedStatus = { ...mockRoom, status: undefined };
    render(<DetailsSection {...defaultProps} room={roomWithUndefinedStatus} />);

    expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
  });
});
