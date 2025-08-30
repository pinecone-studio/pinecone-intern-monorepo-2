import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { TypeField } from '../../../src/components/room/GeneralFormFields';

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

describe('TypeField', () => {
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
      errors: { type: 'Type is required' },
    };
    render(<TypeField {...propsWithError} />);
    expect(screen.getByText('Type is required')).toBeInTheDocument();
    const select = screen.getByLabelText('Type');
    expect(select).toHaveClass('border-red-300', 'focus:ring-red-500');
  });

  it('should test normal styling without errors', () => {
    render(<TypeField {...defaultProps} />);
    const select = screen.getByLabelText('Type');
    expect(select).toHaveClass('border-gray-300', 'focus:ring-blue-500');
  });

  it('should test empty type array handling', () => {
    const propsWithEmptyType = {
      ...defaultProps,
      formData: { name: '', type: [], pricePerNight: '', roomInformation: [], bedNumber: 0 },
    };
    render(<TypeField {...propsWithEmptyType} />);
    const select = screen.getByLabelText('Type');
    expect(select).toHaveValue('');
  });

  it('should test onChange handler', () => {
    const mockOnInputChange = jest.fn();
    render(<TypeField {...defaultProps} onInputChange={mockOnInputChange} />);
    const select = screen.getByLabelText('Type');
    fireEvent.change(select, { target: { value: 'Double' } });
    expect(mockOnInputChange).toHaveBeenCalledWith('type', ['Double']);
  });

  it('should render all type options', () => {
    render(<TypeField {...defaultProps} />);
    expect(screen.getByText('Select room type')).toBeInTheDocument();
    expect(screen.getByText('Single')).toBeInTheDocument();
    expect(screen.getByText('Double')).toBeInTheDocument();
    expect(screen.getByText('Triple')).toBeInTheDocument();
    expect(screen.getByText('Quad')).toBeInTheDocument();
    expect(screen.getByText('Queen')).toBeInTheDocument();
    expect(screen.getByText('King')).toBeInTheDocument();
  });

  it('should display current type value', () => {
    render(<TypeField {...defaultProps} />);
    const select = screen.getByLabelText('Type');
    expect(select).toHaveValue('Single');
  });

  it('should have correct select attributes', () => {
    render(<TypeField {...defaultProps} />);
    const select = screen.getByLabelText('Type');
    expect(select).toHaveClass('appearance-none', 'bg-white');
  });
});
