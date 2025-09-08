/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BasicInfoSection } from '@/components/admin/room-detail/edit-sections/BasicInfoSection';

// Mock the Select component to avoid Radix UI issues
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select">
      <button data-testid="select-trigger" onClick={() => onValueChange && onValueChange('queen')}>
        {value || 'Select room type'}
      </button>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-testid={`select-item-${value}`}>{children}</div>,
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger-wrapper">{children}</div>,
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
}));

describe('BasicInfoSection', () => {
  const mockRoom = {
    name: 'Test Room',
    pricePerNight: 100,
    typePerson: 'double',
    bedNumber: 2,
    roomInformation: ['private_bathroom', 'air_conditioner'],
  };

  const defaultProps = {
    room: mockRoom,
    handleInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<BasicInfoSection {...defaultProps} />);

    expect(screen.getByLabelText('Room Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Price per Night ($)')).toBeInTheDocument();
    expect(screen.getByText('Room Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Beds')).toBeInTheDocument();
    expect(screen.getByText('Room Information')).toBeInTheDocument();
  });

  it('displays current room values', () => {
    render(<BasicInfoSection {...defaultProps} />);

    expect(screen.getByDisplayValue('Test Room')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('calls handleInputChange when room name changes', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const nameInput = screen.getByLabelText('Room Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Room Name' } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('name', 'Updated Room Name');
  });

  it('calls handleInputChange when price changes', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const priceInput = screen.getByLabelText('Price per Night ($)');
    fireEvent.change(priceInput, { target: { value: '150' } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('pricePerNight', 150);
  });

  it('calls handleInputChange when bed number changes', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const bedInput = screen.getByLabelText('Number of Beds');
    fireEvent.change(bedInput, { target: { value: '3' } });

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('bedNumber', 3);
  });

  it('handles room type selection via Select onValueChange', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const selectTrigger = screen.getByTestId('select-trigger');
    fireEvent.click(selectTrigger);

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('typePerson', 'queen');
  });

  it('handles room information checkbox selection/deselection', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    expect(privateBathroomCheckbox).toBeChecked();
    fireEvent.click(privateBathroomCheckbox);
    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', ['air_conditioner']);

    const airConditionerCheckbox = screen.getByLabelText('Air Conditioner');
    fireEvent.click(airConditionerCheckbox);
    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', ['private_bathroom']);

    const tvCheckbox = screen.getByLabelText('TV');
    fireEvent.click(tvCheckbox);
    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', ['private_bathroom', 'air_conditioner', 'tv']);
  });

  it('handles room with null/undefined values', () => {
    const roomWithNulls = {
      name: null,
      pricePerNight: undefined,
      typePerson: null,
      bedNumber: undefined,
      roomInformation: null,
    };

    render(<BasicInfoSection {...defaultProps} room={roomWithNulls} />);

    expect(screen.getByLabelText('Room Name')).toHaveValue('');
    expect(screen.getByLabelText('Price per Night ($)')).toHaveValue(null);
    expect(screen.getByLabelText('Number of Beds')).toHaveValue(null);
  });

  it('handles room with empty or non-array roomInformation', () => {
    const roomWithEmpty = { ...mockRoom, roomInformation: [] };
    const roomWithNonArray = { ...mockRoom, roomInformation: 'not_an_array' };

    const { rerender } = render(<BasicInfoSection {...defaultProps} room={roomWithEmpty} />);
    expect(screen.getByLabelText('Private Bathroom')).not.toBeChecked();

    rerender(<BasicInfoSection {...defaultProps} room={roomWithNonArray} />);
    expect(screen.getByLabelText('Private Bathroom')).not.toBeChecked();
  });

  it('handles price and bed number inputs with invalid numbers', () => {
    render(<BasicInfoSection {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Price per Night ($)'), { target: { value: 'invalid' } });
    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('pricePerNight', 0);

    fireEvent.change(screen.getByLabelText('Number of Beds'), { target: { value: 'invalid' } });
    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('bedNumber', 0);
  });

  it('displays all room information options', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const options = [
      'Private Bathroom',
      'Shared Bathroom',
      'Free Bottle Water',
      'Air Conditioner',
      'TV',
      'Minibar',
      'Free WiFi',
      'Free Parking',
      'Shower',
      'Bathtub',
      'Hair Dryer',
      'Desk',
      'Elevator',
    ];

    options.forEach((option) => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });
  });

  it('handles checkbox unchecking when roomInformation is not an array', () => {
    const roomWithNonArray = { ...mockRoom, roomInformation: 'not_an_array' };
    render(<BasicInfoSection {...defaultProps} room={roomWithNonArray} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    fireEvent.click(privateBathroomCheckbox);

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', ['private_bathroom']);
  });

  it('handles checkbox checking when roomInformation is not an array', () => {
    const roomWithNonArray = { ...mockRoom, roomInformation: 'not_an_array' };
    render(<BasicInfoSection {...defaultProps} room={roomWithNonArray} />);

    const tvCheckbox = screen.getByLabelText('TV');
    fireEvent.click(tvCheckbox);

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', ['tv']);
  });

  it('handles checkbox unchecking with existing values', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const airConditionerCheckbox = screen.getByLabelText('Air Conditioner');
    fireEvent.click(airConditionerCheckbox);

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', ['private_bathroom']);
  });

  it('handles checkbox checking with existing values', () => {
    render(<BasicInfoSection {...defaultProps} />);

    const tvCheckbox = screen.getByLabelText('TV');
    fireEvent.click(tvCheckbox);

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('roomInformation', ['private_bathroom', 'air_conditioner', 'tv']);
  });

  it('handles empty string values for room properties', () => {
    const roomWithEmptyStrings = {
      name: '',
      pricePerNight: '',
      typePerson: '',
      bedNumber: '',
      roomInformation: [],
    };

    render(<BasicInfoSection {...defaultProps} room={roomWithEmptyStrings} />);

    expect(screen.getByLabelText('Room Name')).toHaveValue('');
    expect(screen.getByLabelText('Price per Night ($)')).toHaveValue(null);
    expect(screen.getByLabelText('Number of Beds')).toHaveValue(null);
  });

  it('handles zero values for numeric inputs', () => {
    const roomWithZeros = {
      ...mockRoom,
      pricePerNight: 0,
      bedNumber: 0,
    };

    render(<BasicInfoSection {...defaultProps} room={roomWithZeros} />);

    expect(screen.getByLabelText('Price per Night ($)')).toHaveValue(null);
    expect(screen.getByLabelText('Number of Beds')).toHaveValue(null);
  });

  it('handles all room type options', () => {
    const roomTypes = ['single', 'double', 'triple', 'quad', 'queen', 'king'];

    roomTypes.forEach((type) => {
      const { rerender } = render(<BasicInfoSection {...defaultProps} room={{ ...mockRoom, typePerson: type }} />);
      expect(screen.getByTestId('select-trigger')).toHaveTextContent(type);
      rerender(<div />);
    });
  });
});
