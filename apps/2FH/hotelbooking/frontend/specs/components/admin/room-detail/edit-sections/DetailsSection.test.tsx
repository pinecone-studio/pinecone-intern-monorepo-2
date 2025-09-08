/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailsSection } from '@/components/admin/room-detail/edit-sections/DetailsSection';

// Mock the Select component to avoid Radix UI issues
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select">
      <button data-testid="select-trigger" id="status" onClick={() => onValueChange && onValueChange('booked')}>
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

// Mock the Label component
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor} data-testid="label">
      {children}
    </label>
  ),
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

  describe('Rendering', () => {
    it('renders all form fields correctly', () => {
      render(<DetailsSection {...defaultProps} />);

      expect(screen.getByLabelText('Room Information')).toBeInTheDocument();
      expect(screen.getByText('Room Status')).toBeInTheDocument();
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('displays current room values', () => {
      render(<DetailsSection {...defaultProps} />);

      expect(screen.getByDisplayValue(mockRoom.roomInformation)).toBeInTheDocument();
      expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
    });

    it('renders with correct structure and classes', () => {
      render(<DetailsSection {...defaultProps} />);

      const container = screen.getByLabelText('Room Information').closest('div')?.parentElement;
      expect(container).toHaveClass('space-y-6');
    });

    it('renders textarea with correct attributes', () => {
      render(<DetailsSection {...defaultProps} />);

      const textarea = screen.getByLabelText('Room Information');
      expect(textarea).toHaveAttribute('id', 'roomInformation');
      expect(textarea).toHaveAttribute('rows', '6');
      expect(textarea).toHaveClass('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-md');
    });

    it('renders select with correct attributes', () => {
      render(<DetailsSection {...defaultProps} />);

      const select = screen.getByTestId('select');
      expect(select).toBeInTheDocument();
      expect(screen.getByTestId('select-trigger')).toHaveAttribute('id', 'status');
    });
  });

  describe('User Interactions', () => {
    it('calls handleInputChange when room information changes', async () => {
      const user = userEvent.setup();
      render(<DetailsSection {...defaultProps} />);

      const roomInfoTextarea = screen.getByLabelText('Room Information');
      await user.clear(roomInfoTextarea);
      await user.type(roomInfoTextarea, 'Updated room information');

      // Check that handleInputChange was called with the correct field name
      expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', expect.any(String));
      // Check that it was called multiple times (once for each character)
      expect(defaultProps.handleInputChange).toHaveBeenCalledTimes(25);
    });

    it('calls handleInputChange when status changes via Select onValueChange', () => {
      render(<DetailsSection {...defaultProps} />);

      const selectTrigger = screen.getByTestId('select-trigger');
      fireEvent.click(selectTrigger);

      expect(defaultProps.handleInputChange).toHaveBeenCalledWith('status', 'booked');
    });

    it('handles multiple rapid changes to room information', async () => {
      const user = userEvent.setup();
      render(<DetailsSection {...defaultProps} />);

      const roomInfoTextarea = screen.getByLabelText('Room Information');

      await user.clear(roomInfoTextarea);
      await user.type(roomInfoTextarea, 'First change');
      await user.clear(roomInfoTextarea);
      await user.type(roomInfoTextarea, 'Second change');

      // userEvent.type triggers onChange for each character, so we check that it was called multiple times
      expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', expect.any(String));
      expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', '');
      // Should be called many times due to character-by-character typing
      expect(defaultProps.handleInputChange).toHaveBeenCalledTimes(27);
    });
  });

  describe('Edge Cases and Null Handling', () => {
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

    it('handles room with missing properties', () => {
      const roomWithMissing = {};
      render(<DetailsSection {...defaultProps} room={roomWithMissing} />);

      expect(screen.getByLabelText('Room Information')).toHaveValue('');
      expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
    });

    it('handles room with null status', () => {
      const roomWithNullStatus = { ...mockRoom, status: null };
      render(<DetailsSection {...defaultProps} room={roomWithNullStatus} />);

      expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
    });

    it('handles room with undefined status', () => {
      const roomWithUndefinedStatus = { ...mockRoom, status: undefined };
      render(<DetailsSection {...defaultProps} room={roomWithUndefinedStatus} />);

      expect(screen.getByTestId('select-trigger')).toHaveTextContent('available');
    });
  });

  describe('Status Options', () => {
    it('handles different status values correctly', () => {
      const statuses = ['booked', 'cancelled', 'pending', 'completed', 'available'] as const;

      statuses.forEach((status) => {
        const { rerender } = render(<DetailsSection {...defaultProps} room={{ ...mockRoom, status }} />);
        expect(screen.getByTestId('select-trigger')).toHaveTextContent(status);
        rerender(<div />);
      });
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

    it('handles status change with different values', () => {
      const { rerender } = render(<DetailsSection {...defaultProps} />);

      const statuses = ['cancelled', 'booked', 'pending', 'completed'];

      statuses.forEach((status) => {
        rerender(<DetailsSection {...defaultProps} room={{ ...mockRoom, status }} />);
        expect(screen.getByTestId('select-trigger')).toHaveTextContent(status);
      });
    });
  });

  describe('Text Content and Special Characters', () => {
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
  });

  describe('Placeholder and Labels', () => {
    it('displays correct placeholder text for room information', () => {
      render(<DetailsSection {...defaultProps} />);

      const roomInfoTextarea = screen.getByPlaceholderText('Enter detailed room information, policies, and any special notes...');
      expect(roomInfoTextarea).toBeInTheDocument();
    });

    it('displays correct labels', () => {
      render(<DetailsSection {...defaultProps} />);

      expect(screen.getByText('Room Information')).toBeInTheDocument();
      expect(screen.getByText('Room Status')).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('handles handleInputChange being undefined', () => {
      const propsWithoutHandler = { ...defaultProps, handleInputChange: undefined };

      // Should not throw error
      expect(() => render(<DetailsSection {...propsWithoutHandler} />)).not.toThrow();
    });

    it('handles room prop being undefined', () => {
      const propsWithoutRoom = { ...defaultProps, room: undefined };

      // Should throw error since component doesn't handle undefined room
      expect(() => render(<DetailsSection {...propsWithoutRoom} />)).toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has proper label associations', () => {
      render(<DetailsSection {...defaultProps} />);

      const roomInfoTextarea = screen.getByLabelText('Room Information');
      expect(roomInfoTextarea).toHaveAttribute('id', 'roomInformation');

      const statusSelect = screen.getByTestId('select-trigger');
      expect(statusSelect).toHaveAttribute('id', 'status');
    });

    it('has proper focus management', () => {
      render(<DetailsSection {...defaultProps} />);

      const roomInfoTextarea = screen.getByLabelText('Room Information');
      roomInfoTextarea.focus();
      expect(roomInfoTextarea).toHaveFocus();
    });
  });

  describe('Snapshot Tests', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(<DetailsSection {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with null values', () => {
      const roomWithNulls = { roomInformation: null, status: undefined };
      const { container } = render(<DetailsSection {...defaultProps} room={roomWithNulls} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different status', () => {
      const roomWithStatus = { ...mockRoom, status: 'booked' };
      const { container } = render(<DetailsSection {...defaultProps} room={roomWithStatus} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
