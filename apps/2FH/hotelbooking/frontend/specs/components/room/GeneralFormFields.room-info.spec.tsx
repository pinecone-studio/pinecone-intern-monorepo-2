import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomInformationField } from '../../../src/components/room/GeneralFormFields';

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

describe('RoomInformationField', () => {
  const defaultProps = {
    formData: { name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['FreeWifi'] },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test error display functionality', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { roomInformation: 'Room information is required' },
    };
    render(<RoomInformationField {...propsWithError} />);
    expect(screen.getByText('Room information is required')).toBeInTheDocument();
    const container = screen.getByText('Room information').closest('div')?.querySelector('#room-information');
    expect(container).toBeTruthy();
    expect(container).toHaveClass('border-red-300');
    expect(container).toHaveClass('bg-red-50');
  });

  it('should test handleCheckboxChange function with empty array', () => {
    const emptyFormData = {
      ...defaultProps,
      formData: { name: '', type: [], pricePerNight: '', roomInformation: [] },
    };
    const mockOnInputChange = jest.fn();
    render(<RoomInformationField {...emptyFormData} onInputChange={mockOnInputChange} />);
    const wifiCheckbox = screen.getByLabelText('Free WiFi');
    fireEvent.click(wifiCheckbox);
    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', ['FreeWifi']);
  });

  it('should test handleCheckboxChange function with single item', () => {
    const singleItemData = {
      ...defaultProps,
      formData: { name: '', type: [], pricePerNight: '', roomInformation: ['FreeWifi'] },
    };
    const mockOnInputChange = jest.fn();
    render(<RoomInformationField {...singleItemData} onInputChange={mockOnInputChange} />);
    const wifiCheckbox = screen.getByLabelText('Free WiFi');
    fireEvent.click(wifiCheckbox);
    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', []);
  });

  it('should test handleCheckboxChange function with multiple items', () => {
    const multipleItemData = {
      ...defaultProps,
      formData: { name: '', type: [], pricePerNight: '', roomInformation: ['FreeWifi', 'AirConditioner'] },
    };
    const mockOnInputChange = jest.fn();
    render(<RoomInformationField {...multipleItemData} onInputChange={mockOnInputChange} />);
    const tvCheckbox = screen.getByLabelText('TV');
    fireEvent.click(tvCheckbox);
    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', ['FreeWifi', 'AirConditioner', 'Tv']);
  });

  it('should test handleCheckboxChange function removing item', () => {
    const multipleItemData = {
      ...defaultProps,
      formData: { name: '', type: [], pricePerNight: '', roomInformation: ['FreeWifi', 'AirConditioner', 'Tv'] },
    };
    const mockOnInputChange = jest.fn();
    render(<RoomInformationField {...multipleItemData} onInputChange={mockOnInputChange} />);
    const wifiCheckbox = screen.getByLabelText('Free WiFi');
    fireEvent.click(wifiCheckbox);
    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', ['AirConditioner', 'Tv']);
  });

  it('should test grid layout classes', () => {
    render(<RoomInformationField {...defaultProps} />);
    const container = screen.getByText('Room information').closest('div')?.querySelector('#room-information');
    expect(container).toBeTruthy();
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('grid-cols-2');
    expect(container).toHaveClass('gap-2');
    expect(container).toHaveClass('max-h-32');
    expect(container).toHaveClass('overflow-y-auto');
  });
});
