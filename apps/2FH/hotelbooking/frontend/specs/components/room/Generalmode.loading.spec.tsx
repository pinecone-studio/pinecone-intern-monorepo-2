import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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

describe('Generalmode Loading', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle loading parameter default value', () => {
    const { onClose, onSave, isOpen, initialData } = defaultProps;
    render(<Generalmode onClose={onClose} onSave={onSave} isOpen={isOpen} initialData={initialData} />);
    expect(screen.getByTestId('general-form')).toBeInTheDocument();
  });

  it('should handle loading parameter with true value', () => {
    render(<Generalmode {...defaultProps} loading={true} />);
    expect(screen.getByTestId('general-form')).toBeInTheDocument();
  });

  it('should disable buttons when loading is true', () => {
    render(<Generalmode {...defaultProps} loading={true} />);
    const saveButton = screen.getByText('Saving...');
    const cancelButton = screen.getByText('Cancel');
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should show loading text on save button when loading is true', () => {
    render(<Generalmode {...defaultProps} loading={true} />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('should show "Save" text on save button when loading is false', () => {
    render(<Generalmode {...defaultProps} loading={false} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should have proper CSS classes for loading state', () => {
    render(<Generalmode {...defaultProps} loading={true} />);
    const saveButton = screen.getByText('Saving...');
    expect(saveButton).toHaveClass('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
  });

  it('should have proper CSS classes for non-loading state', () => {
    render(<Generalmode {...defaultProps} loading={false} />);
    const saveButton = screen.getByText('Save');
    expect(saveButton).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'cursor-pointer');
  });
});
