import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Generalmode } from '../../../src/components/room/Generalmode';

jest.mock('../../../src/components/room/GeneralForm', () => ({
  GeneralForm: ({ formData, onInputChange }: any) => (
    <div data-testid="general-form">
      <input data-testid="bed-number-input" value={formData?.bedNumber || ''} onChange={(e: any) => onInputChange('bedNumber', e.target.value)} placeholder="Bed number" />
      <input data-testid="name-input" value={formData?.name || ''} onChange={(e: any) => onInputChange('name', e.target.value)} placeholder="Room name" />
      <div data-testid="form-data-display">{JSON.stringify(formData)}</div>
    </div>
  ),
}));

describe('Generalmode parseInt Logic', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse bedNumber field as integer when valid number is provided', () => {
    render(<Generalmode {...defaultProps} />);
    const bedNumberInput = screen.getByTestId('bed-number-input');

    fireEvent.change(bedNumberInput, { target: { value: '5' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.bedNumber).toBe(5);
  });

  it('should parse bedNumber field as integer when decimal is provided', () => {
    render(<Generalmode {...defaultProps} />);
    const bedNumberInput = screen.getByTestId('bed-number-input');

    fireEvent.change(bedNumberInput, { target: { value: '3.7' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.bedNumber).toBe(3);
  });

  it('should set bedNumber to 0 when invalid value is provided', () => {
    render(<Generalmode {...defaultProps} />);
    const bedNumberInput = screen.getByTestId('bed-number-input');

    fireEvent.change(bedNumberInput, { target: { value: 'invalid' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.bedNumber).toBe(0);
  });

  it('should set bedNumber to 0 when empty string is provided', () => {
    render(<Generalmode {...defaultProps} />);
    const bedNumberInput = screen.getByTestId('bed-number-input');

    fireEvent.change(bedNumberInput, { target: { value: '' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.bedNumber).toBe(0);
  });

  it('should set bedNumber to 0 when negative number is provided', () => {
    render(<Generalmode {...defaultProps} />);
    const bedNumberInput = screen.getByTestId('bed-number-input');

    fireEvent.change(bedNumberInput, { target: { value: '-2' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.bedNumber).toBe(-2);
  });

  it('should not parse non-bedNumber fields as integer', () => {
    render(<Generalmode {...defaultProps} />);
    const nameInput = screen.getByTestId('name-input');

    fireEvent.change(nameInput, { target: { value: '123' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.name).toBe('123');
    expect(typeof formData.name).toBe('string');
  });

  it('should handle multiple bedNumber changes correctly', () => {
    render(<Generalmode {...defaultProps} />);
    const bedNumberInput = screen.getByTestId('bed-number-input');

    fireEvent.change(bedNumberInput, { target: { value: '2' } });
    fireEvent.change(bedNumberInput, { target: { value: '4' } });
    fireEvent.change(bedNumberInput, { target: { value: '1' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.bedNumber).toBe(1);
  });

  it('should handle bedNumber field with initial data', () => {
    const initialData = {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
      bedNumber: 2,
    };

    render(<Generalmode {...defaultProps} initialData={initialData} />);
    const bedNumberInput = screen.getByTestId('bed-number-input');

    fireEvent.change(bedNumberInput, { target: { value: '6' } });

    const formDataDisplay = screen.getByTestId('form-data-display');
    const formData = JSON.parse(formDataDisplay.textContent || '{}');
    expect(formData.bedNumber).toBe(6);
  });
});
