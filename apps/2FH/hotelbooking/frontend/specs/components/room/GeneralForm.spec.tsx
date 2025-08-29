import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { GeneralForm } from '../../../src/components/room/GeneralForm';

jest.mock('../../../src/components/room/GeneralFormFields', () => ({
  NameField: ({ formData, errors, onInputChange }: any) => (
    <div data-testid="name-field">
      <input data-testid="name-input" value={formData.name} onChange={(e: any) => onInputChange('name', e.target.value)} placeholder="Enter room name" />
      {errors.name && <span data-testid="name-error">{errors.name}</span>}
    </div>
  ),
  TypeField: ({ formData, errors, onInputChange }: any) => (
    <div data-testid="type-field">
      <select data-testid="type-select" value={formData.type[0] || ''} onChange={(e: any) => onInputChange('type', [e.target.value])}>
        <option value="">Select room type</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
      </select>
      {errors.type && <span data-testid="type-error">{errors.type}</span>}
    </div>
  ),
  PriceField: ({ formData, errors, onInputChange }: any) => (
    <div data-testid="price-field">
      <input data-testid="price-input" type="number" value={formData.pricePerNight} onChange={(e: any) => onInputChange('pricePerNight', e.target.value)} placeholder="Enter price" />
      {errors.pricePerNight && <span data-testid="price-error">{errors.pricePerNight}</span>}
    </div>
  ),
  BedNumberField: ({ formData, errors, onInputChange }: any) => (
    <div data-testid="bed-number-field">
      <input data-testid="bed-number-input" type="number" value={formData.bedNumber || ''} onChange={(e: any) => onInputChange('bedNumber', e.target.value)} placeholder="1" />
      {errors.bedNumber && <span data-testid="bed-number-error">{errors.bedNumber}</span>}
    </div>
  ),
  RoomInformationField: ({ formData, errors, onInputChange }: any) => (
    <div data-testid="room-info-field">
      <input
        data-testid="room-info-checkbox"
        type="checkbox"
        checked={formData.roomInformation.includes('WiFi')}
        onChange={(e: any) => {
          if (e.target.checked) {
            onInputChange('roomInformation', [...formData.roomInformation, 'WiFi']);
          } else {
            onInputChange(
              'roomInformation',
              formData.roomInformation.filter((item: string) => item !== 'WiFi')
            );
          }
        }}
      />
      {errors.roomInformation && <span data-testid="room-info-error">{errors.roomInformation}</span>}
    </div>
  ),
}));
describe('GeneralForm', () => {
  const defaultProps = {
    formData: {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
      bedNumber: 1,
    },
    errors: {},
    onInputChange: jest.fn(),
  };
  it('should render all form fields', () => {
    render(<GeneralForm {...defaultProps} />);

    expect(screen.getByTestId('name-field')).toBeInTheDocument();
    expect(screen.getByTestId('type-field')).toBeInTheDocument();
    expect(screen.getByTestId('price-field')).toBeInTheDocument();
    expect(screen.getByTestId('bed-number-field')).toBeInTheDocument();
    expect(screen.getByTestId('room-info-field')).toBeInTheDocument();
  });
  it('should pass form data to all fields', () => {
    render(<GeneralForm {...defaultProps} />);

    expect(screen.getByTestId('name-input')).toHaveValue('Test Room');
    expect(screen.getByTestId('type-select')).toHaveValue('Single');
    expect(screen.getByTestId('price-input')).toHaveValue(100);
    expect(screen.getByTestId('bed-number-input')).toHaveValue(1);
    expect(screen.getByTestId('room-info-checkbox')).toBeChecked();
  });
  it('should pass errors to all fields', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        name: 'Name is required',
        type: 'Type is required',
        pricePerNight: 'Price is required',
        roomInformation: 'Room information is required',
      },
    };

    render(<GeneralForm {...propsWithErrors} />);

    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
    expect(screen.getByTestId('type-error')).toHaveTextContent('Type is required');
    expect(screen.getByTestId('price-error')).toHaveTextContent('Price is required');
    expect(screen.getByTestId('room-info-error')).toHaveTextContent('Room information is required');
  });

  it('should call onInputChange when name field changes', () => {
    const mockOnInputChange = jest.fn();
    render(<GeneralForm {...defaultProps} onInputChange={mockOnInputChange} />);

    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'New Room Name' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('name', 'New Room Name');
  });
  it('should call onInputChange when type field changes', () => {
    const mockOnInputChange = jest.fn();
    render(<GeneralForm {...defaultProps} onInputChange={mockOnInputChange} />);

    const typeSelect = screen.getByTestId('type-select');
    fireEvent.change(typeSelect, { target: { value: 'Double' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('type', ['Double']);
  });
  it('should call onInputChange when price field changes', () => {
    const mockOnInputChange = jest.fn();
    render(<GeneralForm {...defaultProps} onInputChange={mockOnInputChange} />);
    const priceInput = screen.getByTestId('price-input');
    fireEvent.change(priceInput, { target: { value: '150' } });
    expect(mockOnInputChange).toHaveBeenCalledWith('pricePerNight', '150');
  });
  it('should call onInputChange when room information checkbox changes', () => {
    const mockOnInputChange = jest.fn();
    render(<GeneralForm {...defaultProps} onInputChange={mockOnInputChange} />);

    const roomInfoCheckbox = screen.getByTestId('room-info-checkbox');
    fireEvent.click(roomInfoCheckbox);

    expect(mockOnInputChange).toHaveBeenCalledWith('roomInformation', []);
  });
  it('should handle empty form data', () => {
    const emptyFormData = {
      name: '',
      type: [],
      pricePerNight: '',
      roomInformation: [],
      bedNumber: 0,
    };
    render(<GeneralForm {...defaultProps} formData={emptyFormData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue(null);
    expect(screen.getByTestId('bed-number-input')).toHaveValue(null);
    expect(screen.getByTestId('room-info-checkbox')).not.toBeChecked();
  });
  it('should render with proper spacing classes', () => {
    const { container } = render(<GeneralForm {...defaultProps} />);

    const formContainer = container.firstChild;
    expect(formContainer).toHaveClass('space-y-4');
  });
});
