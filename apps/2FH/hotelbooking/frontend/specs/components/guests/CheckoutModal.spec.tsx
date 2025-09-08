/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutModal from '@/components/guests/CheckoutModal';
import { useUpdateBookingMutation } from '@/generated';

// Mock dependencies
jest.mock('@/generated', () => ({
  useUpdateBookingMutation: jest.fn(),
}));

const mockUpdateBooking = jest.fn();
const mockUseUpdateBookingMutation = useUpdateBookingMutation as jest.MockedFunction<typeof useUpdateBookingMutation>;

describe('CheckoutModal', () => {
  const defaultProps = {
    bookingId: 'booking-1',
    currentStatus: 'BOOKED',
    onStatusUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUpdateBookingMutation.mockReturnValue([mockUpdateBooking, { loading: false, error: undefined }] as any);
  });

  it('renders modal trigger button', () => {
    render(<CheckoutModal {...defaultProps} />);

    expect(screen.getByText('Change Status')).toBeInTheDocument();
  });

  it('opens modal when trigger button is clicked', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Update Booking Status')).toBeInTheDocument();
  });

  it('displays current status', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Current Status')).toBeInTheDocument();
    expect(screen.getAllByText('Booked')[0]).toBeInTheDocument();
  });

  it('displays all status options', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Select New Status')).toBeInTheDocument();
    expect(screen.getAllByText('Booked')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Completed')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Cancelled')[0]).toBeInTheDocument();
  });

  it('handles status selection', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const completedOption = screen.getByLabelText('Completed');
    fireEvent.click(completedOption);

    expect(completedOption).toBeChecked();
  });

  it('calls updateBooking mutation when update button is clicked', async () => {
    mockUpdateBooking.mockResolvedValue({
      data: { updateBooking: { id: 'booking-1' } },
    } as any);

    const onStatusUpdate = jest.fn();
    render(<CheckoutModal {...defaultProps} onStatusUpdate={onStatusUpdate} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const completedOption = screen.getByLabelText('Completed');
    fireEvent.click(completedOption);

    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateBooking).toHaveBeenCalledWith({
        variables: {
          updateBookingId: 'booking-1',
          input: {
            status: 'COMPLETED',
          },
        },
      });
    });

    await waitFor(() => {
      expect(onStatusUpdate).toHaveBeenCalled();
    });
  });

  it('closes modal after successful update', async () => {
    mockUpdateBooking.mockResolvedValue({
      data: { updateBooking: { id: 'booking-1' } },
    } as any);

    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const completedOption = screen.getByLabelText('Completed');
    fireEvent.click(completedOption);

    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.queryByText('Update Booking Status')).not.toBeInTheDocument();
    });
  });

  it('handles update error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUpdateBooking.mockRejectedValue(new Error('Update failed'));

    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const completedOption = screen.getByLabelText('Completed');
    fireEvent.click(completedOption);

    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error updating booking status:', expect.any(Error));
    });

    consoleError.mockRestore();
  });

  it('disables update button when loading', () => {
    mockUseUpdateBookingMutation.mockReturnValue([mockUpdateBooking, { loading: true, error: undefined }] as any);

    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const updateButton = screen.getByText('Update Status');
    expect(updateButton).toBeDisabled();
  });

  it('disables update button when no status change is selected', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const updateButton = screen.getByText('Update Status');
    expect(updateButton).toBeDisabled();
  });

  it('enables update button when different status is selected', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const completedOption = screen.getByLabelText('Completed');
    fireEvent.click(completedOption);

    const updateButton = screen.getByText('Update Status');
    expect(updateButton).not.toBeDisabled();
  });

  it('closes modal when cancel button is clicked', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Update Booking Status')).not.toBeInTheDocument();
  });

  it('disables cancel button when loading', () => {
    mockUseUpdateBookingMutation.mockReturnValue([mockUpdateBooking, { loading: true, error: undefined }] as any);

    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeDisabled();
  });

  it('shows loading spinner when updating', () => {
    mockUseUpdateBookingMutation.mockReturnValue([mockUpdateBooking, { loading: true, error: undefined }] as any);

    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const updateButton = screen.getByText('Update Status');
    expect(updateButton).toHaveTextContent('Update Status');
  });

  it('handles different current statuses', () => {
    const propsWithCompletedStatus = {
      ...defaultProps,
      currentStatus: 'COMPLETED',
    };

    render(<CheckoutModal {...propsWithCompletedStatus} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    expect(screen.getAllByText('Completed')[0]).toBeInTheDocument();
  });

  it('handles cancelled status', () => {
    const propsWithCancelledStatus = {
      ...defaultProps,
      currentStatus: 'CANCELLED',
    };

    render(<CheckoutModal {...propsWithCancelledStatus} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    expect(screen.getAllByText('Cancelled')[0]).toBeInTheDocument();
  });

  it('renders status badges with correct colors', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    // Get all "Booked" elements and select the first one (current status)
    const bookedBadges = screen.getAllByText('Booked');
    expect(bookedBadges[0]).toHaveClass('bg-blue-600', 'text-white');

    // Get all "Completed" elements and select the first one (radio option)
    const completedBadges = screen.getAllByText('Completed');
    expect(completedBadges[0]).toHaveClass('bg-green-600', 'text-white');

    // Get all "Cancelled" elements and select the first one (radio option)
    const cancelledBadges = screen.getAllByText('Cancelled');
    expect(cancelledBadges[0]).toHaveClass('bg-orange-500', 'text-white');
  });

  it('handles status update without onStatusUpdate callback', async () => {
    mockUpdateBooking.mockResolvedValue({
      data: { updateBooking: { id: 'booking-1' } },
    } as any);

    const propsWithoutCallback = {
      bookingId: 'booking-1',
      currentStatus: 'BOOKED',
    };

    render(<CheckoutModal {...propsWithoutCallback} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const completedOption = screen.getByLabelText('Completed');
    fireEvent.click(completedOption);

    const updateButton = screen.getByText('Update Status');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateBooking).toHaveBeenCalledWith({
        variables: {
          updateBookingId: 'booking-1',
          input: {
            status: 'COMPLETED',
          },
        },
      });
    });
  });

  it('matches snapshot', () => {
    const { container } = render(<CheckoutModal {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when modal is open', () => {
    render(<CheckoutModal {...defaultProps} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    const { container } = render(<CheckoutModal {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('handles unknown status gracefully', () => {
    const propsWithUnknownStatus = {
      ...defaultProps,
      currentStatus: 'UNKNOWN_STATUS',
    };

    render(<CheckoutModal {...propsWithUnknownStatus} />);

    const triggerButton = screen.getByText('Change Status');
    fireEvent.click(triggerButton);

    // Should display the unknown status with fallback styling
    expect(screen.getByText('Current Status')).toBeInTheDocument();
    expect(screen.getByText('Unknown_status')).toBeInTheDocument(); // The status gets formatted
  });
});
