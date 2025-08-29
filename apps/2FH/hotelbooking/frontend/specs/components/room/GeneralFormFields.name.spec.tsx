import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { NameField } from '../../../src/components/room/GeneralFormFields';

jest.mock('@/generated', () => ({
  TypePerson: {
    Single: 'Single',
    Double: 'Double',
    Triple: 'Triple',
    Quad: 'Quad',
    Queen: 'Queen',
    King: 'King',
  },
  RoomInformation: {
    PrivateBathroom: 'PrivateBathroom',
    SharedBathroom: 'SharedBathroom',
    FreeBottleWater: 'FreeBottleWater',
    AirConditioner: 'AirConditioner',
    Tv: 'Tv',
    Minibar: 'Minibar',
    FreeWifi: 'FreeWifi',
    FreeParking: 'FreeParking',
    Shower: 'Shower',
    Bathtub: 'Bathtub',
    HairDryer: 'HairDryer',
    Desk: 'Desk',
    Elevator: 'Elevator',
  },
}));

describe('NameField', () => {
  const defaultProps = {
    formData: { name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['FreeWifi'], bedNumber: 1 },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test error display functionality', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { name: 'Name is required' },
    };
    render(<NameField {...propsWithError} />);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    const input = screen.getByLabelText('Name');
    expect(input).toHaveClass('border-red-300', 'focus:ring-red-500');
  });

  it('should test normal styling without errors', () => {
    render(<NameField {...defaultProps} />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveClass('border-gray-300', 'focus:ring-blue-500');
  });

  it('should test onChange handler', () => {
    const mockOnInputChange = jest.fn();
    render(<NameField {...defaultProps} onInputChange={mockOnInputChange} />);
    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'New Room Name' } });
    expect(mockOnInputChange).toHaveBeenCalledWith('name', 'New Room Name');
  });

  it('should render with correct placeholder', () => {
    render(<NameField {...defaultProps} />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('placeholder', 'Enter room name');
  });

  it('should render with correct input type', () => {
    render(<NameField {...defaultProps} />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should display current name value', () => {
    render(<NameField {...defaultProps} />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveValue('Test Room');
  });
});
