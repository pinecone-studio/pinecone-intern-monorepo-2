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
    formData: { name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['FreeWifi'], bedNumber: 1 },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render room information field with correct label', () => {
    render(<RoomInformationField {...defaultProps} />);
    expect(screen.getByText('Room information')).toBeInTheDocument();
  });

  it('should render all room information options', () => {
    render(<RoomInformationField {...defaultProps} />);
    expect(screen.getByText('Private Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Shared Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Free Bottle Water')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioner')).toBeInTheDocument();
    expect(screen.getByText('TV')).toBeInTheDocument();
    expect(screen.getByText('Minibar')).toBeInTheDocument();
    expect(screen.getByText('Free WiFi')).toBeInTheDocument();
    expect(screen.getByText('Free Parking')).toBeInTheDocument();
    expect(screen.getByText('Shower')).toBeInTheDocument();
    expect(screen.getByText('Bathtub')).toBeInTheDocument();
    expect(screen.getByText('Hair Dryer')).toBeInTheDocument();
    expect(screen.getByText('Desk')).toBeInTheDocument();
    expect(screen.getByText('Elevator')).toBeInTheDocument();
  });

  it('should display checked state for selected options', () => {
    render(<RoomInformationField {...defaultProps} />);
    const wifiCheckbox = screen.getByLabelText('Free WiFi');
    expect(wifiCheckbox).toBeChecked();
  });

  it('should handle checkbox selection', () => {
    const mockOnInputChange = jest.fn();
    render(<RoomInformationField {...defaultProps} onInputChange={mockOnInputChange} />);
    const acCheckbox = screen.getByLabelText('Air Conditioner');
    fireEvent.click(acCheckbox);
    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', ['FreeWifi', 'AirConditioner']);
  });

  it('should handle checkbox deselection', () => {
    const mockOnInputChange = jest.fn();
    render(<RoomInformationField {...defaultProps} onInputChange={mockOnInputChange} />);
    const wifiCheckbox = screen.getByLabelText('Free WiFi');
    fireEvent.click(wifiCheckbox);
    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', []);
  });

  it('should test error display functionality', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { roomInformation: 'Room information is required' },
    };
    render(<RoomInformationField {...propsWithError} />);
    expect(screen.getByText('Room information is required')).toBeInTheDocument();
  });

  it('should apply error styling when errors exist', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { roomInformation: 'Room information is required' },
    };
    render(<RoomInformationField {...propsWithError} />);
    const container = screen.getByText('Room information').closest('div')?.querySelector('[id="room-information"]');
    expect(container).toHaveClass('border-red-300', 'bg-red-50');
  });

  it('should apply normal styling when no errors exist', () => {
    render(<RoomInformationField {...defaultProps} />);
    const container = screen.getByText('Room information').closest('div')?.querySelector('[id="room-information"]');
    expect(container).toHaveClass('border-gray-200');
  });

  it('should handle multiple selections and deselections', () => {
    const mockOnInputChange = jest.fn();
    render(<RoomInformationField {...defaultProps} onInputChange={mockOnInputChange} />);

    // Select AC
    const acCheckbox = screen.getByLabelText('Air Conditioner');
    fireEvent.click(acCheckbox);
    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', ['FreeWifi', 'AirConditioner']);

    // Select TV
    const tvCheckbox = screen.getByLabelText('TV');
    fireEvent.click(tvCheckbox);
    const lastCall = mockOnInputChange.mock.calls[mockOnInputChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe('roomInformation');
    expect(lastCall[1]).toContain('FreeWifi');
    expect(lastCall[1]).toContain('Tv');
    expect(lastCall[1]).toHaveLength(2);

    // Deselect WiFi
    const wifiCheckbox = screen.getByLabelText('Free WiFi');
    fireEvent.click(wifiCheckbox);
    const finalCall = mockOnInputChange.mock.calls[mockOnInputChange.mock.calls.length - 1];
    expect(finalCall[0]).toBe('roomInformation');
    expect(finalCall[1]).toEqual([]);
    expect(finalCall[1]).toHaveLength(0);
  });
});
