import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Generalmode } from '../../../src/components/room/Generalmode';

jest.mock('../../../src/components/room/GeneralForm', () => ({
  GeneralForm: ({ formData, errors, onInputChange }: any) => (
    <div data-testid="general-form">
      <input data-testid="name-input" value={formData?.name || ''} onChange={(e: any) => onInputChange('name', e.target.value)} placeholder="Room name" />
      <input data-testid="price-input" value={formData?.pricePerNight || ''} onChange={(e: any) => onInputChange('pricePerNight', e.target.value)} placeholder="Price" />
      <select data-testid="type-select" value={formData?.type?.[0] || ''} onChange={(e: any) => onInputChange('type', [e.target.value])}>
        <option value="">Select type</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
      </select>
      <div data-testid="errors-display" style={{ display: 'none' }}>
        {JSON.stringify(errors)}
      </div>
    </div>
  ),
}));

describe('Generalmode Form Data', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle form data updates correctly', () => {
    render(<Generalmode {...defaultProps} />);
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Test Room' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(defaultProps.onSave).toHaveBeenCalledWith({
      name: 'Test Room',
      type: [],
      pricePerNight: '',
      roomInformation: [],
      bedNumber: 0,
    });
  });

  it('should reset form data when modal is closed and reopened', () => {
    const { rerender } = render(<Generalmode {...defaultProps} isOpen={false} />);
    rerender(<Generalmode {...defaultProps} isOpen={true} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('price-input')).toHaveValue('');
    expect(screen.getByTestId('type-select')).toHaveValue('');
  });

  it('should call onSave with current form data in handleSave', () => {
    const mockOnSave = jest.fn();
    render(<Generalmode {...defaultProps} onSave={mockOnSave} />);
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Test Room Name' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Test Room Name',
      type: [],
      pricePerNight: '',
      roomInformation: [],
      bedNumber: 0,
    });
  });

  it('should call onClose after onSave in handleSave', () => {
    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();
    render(<Generalmode {...defaultProps} onSave={mockOnSave} onClose={mockOnClose} />);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should use React.useCallback for handleInputChange', () => {
    const { rerender } = render(<Generalmode {...defaultProps} />);
    const nameInput = screen.getByTestId('name-input');
    fireEvent.change(nameInput, { target: { value: 'Test Input' } });
    rerender(<Generalmode {...defaultProps} />);
    const nameInputAfterRerender = screen.getByTestId('name-input');
    expect(nameInputAfterRerender).toHaveValue('Test Input');
  });

  it('should handle multiple input changes with useCallback', () => {
    render(<Generalmode {...defaultProps} />);
    const nameInput = screen.getByTestId('name-input');
    const priceInput = screen.getByTestId('price-input');
    const typeSelect = screen.getByTestId('type-select');
    fireEvent.change(nameInput, { target: { value: 'Room Name' } });
    fireEvent.change(priceInput, { target: { value: '150' } });
    fireEvent.change(typeSelect, { target: { value: 'Double' } });
    expect(nameInput).toHaveValue('Room Name');
    expect(priceInput).toHaveValue('150');
    expect(typeSelect).toHaveValue('Double');
  });

  it('should update formData when initialData prop changes', async () => {
    const initialData1 = {
      name: 'Room 1',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
    };
    const { rerender } = render(<Generalmode {...defaultProps} initialData={initialData1} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Room 1');
    const initialData2 = {
      name: 'Room 2',
      type: ['Double'],
      pricePerNight: '200',
      roomInformation: ['AC'],
    };
    rerender(<Generalmode {...defaultProps} initialData={initialData2} />);
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Room 2');
      expect(screen.getByTestId('price-input')).toHaveValue('200');
      expect(screen.getByTestId('type-select')).toHaveValue('Double');
    });
  });

  it('should handle useEffect dependency change for initialData', async () => {
    const { rerender } = render(<Generalmode {...defaultProps} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const newInitialData = {
      name: 'Updated Room',
      type: ['Double'],
      pricePerNight: '300',
      roomInformation: ['TV', 'Minibar'],
    };
    rerender(<Generalmode {...defaultProps} initialData={newInitialData} />);
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Updated Room');
      expect(screen.getByTestId('price-input')).toHaveValue('300');
      expect(screen.getByTestId('type-select')).toHaveValue('Double');
    });
  });

  it('should handle useEffect when initialData changes from defined to undefined', async () => {
    const initialData = {
      name: 'Original Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
    };
    const { rerender } = render(<Generalmode {...defaultProps} initialData={initialData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Original Room');
    rerender(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Original Room');
  });
});
