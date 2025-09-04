import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusField } from '../../../src/components/room/GeneralFormFields';

// Mock all the missing enums and types
jest.mock('@/generated', () => ({
  Status: {
    Available: 'available',
    Booked: 'booked',
    Cancelled: 'cancelled',
    Completed: 'completed',
    Pending: 'pending',
  },
  TypePerson: {
    Single: 'single',
    Double: 'double',
    Triple: 'triple',
    Quad: 'quad',
    Queen: 'queen',
    King: 'king',
  },
  RoomInformation: {
    PrivateBathroom: 'private_bathroom',
    SharedBathroom: 'shared_bathroom',
    FreeBottleWater: 'free_bottle_water',
    AirConditioner: 'air_conditioner',
    Tv: 'tv',
    Minibar: 'minibar',
    FreeWifi: 'free_wifi',
    FreeParking: 'free_parking',
    Shower: 'shower',
    Bathtub: 'bathtub',
    HairDryer: 'hair_dryer',
    Desk: 'desk',
    Elevator: 'elevator',
  },
}));

describe('StatusField', () => {
  const defaultProps = {
    formData: {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['FreeWifi'],
      bedNumber: 1,
      status: '',
    },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render status field with correct label', () => {
    render(<StatusField {...defaultProps} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should render select element with correct id', () => {
    render(<StatusField {...defaultProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'room-status');
  });

  it('should render all status options', () => {
    render(<StatusField {...defaultProps} />);
    expect(screen.getByText('Select status')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Booked')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should display current status value', () => {
    const propsWithStatus = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        status: 'available',
      },
    };
    render(<StatusField {...propsWithStatus} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('available');
  });

  it('should call onInputChange when status changes', () => {
    const mockOnInputChange = jest.fn();
    render(<StatusField {...defaultProps} onInputChange={mockOnInputChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'booked' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('status', 'booked');
  });

  it('should apply error styling when errors exist', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { status: 'Status is required' },
    };
    render(<StatusField {...propsWithError} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-300', 'focus:ring-red-500');
  });

  it('should apply normal styling when no errors exist', () => {
    render(<StatusField {...defaultProps} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-gray-300', 'focus:ring-blue-500');
  });

  it('should have correct base classes', () => {
    render(<StatusField {...defaultProps} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('w-full', 'px-3', 'py-2', 'border', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:border-transparent');
  });

  it('should handle empty status value', () => {
    const mockOnInputChange = jest.fn();
    render(<StatusField {...defaultProps} onInputChange={mockOnInputChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('status', '');
  });

  it('should handle all status values', () => {
    const mockOnInputChange = jest.fn();
    render(<StatusField {...defaultProps} onInputChange={mockOnInputChange} />);

    const select = screen.getByRole('combobox');
    const statuses = ['available', 'booked', 'cancelled', 'completed', 'pending'];

    statuses.forEach((status) => {
      fireEvent.change(select, { target: { value: status } });
      expect(mockOnInputChange).toHaveBeenCalledWith('status', status);
    });

    expect(mockOnInputChange).toHaveBeenCalledTimes(statuses.length);
  });
});
