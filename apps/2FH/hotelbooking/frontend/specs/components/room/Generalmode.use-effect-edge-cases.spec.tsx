import React from 'react';
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

describe('Generalmode useEffect Edge Cases', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle useEffect with initialData that changes after mount', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const newInitialData = { name: 'Updated Room', type: ['Double'], pricePerNight: '300', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={newInitialData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Updated Room');
  });

  it('should handle useEffect with initialData that becomes falsy after mount', () => {
    const initialData = { name: 'Initial Room', type: ['Single'], pricePerNight: '200', roomInformation: ['AC'] };
    const { rerender } = render(<Generalmode {...defaultProps} initialData={initialData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Initial Room');
    rerender(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Initial Room');
  });

  it('should handle useEffect with initialData that changes from one truthy value to another', () => {
    const initialData1 = { name: 'Room 1', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] };
    const { rerender } = render(<Generalmode {...defaultProps} initialData={initialData1} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Room 1');
    const initialData2 = { name: 'Room 2', type: ['Double'], pricePerNight: '200', roomInformation: ['AC'] };
    rerender(<Generalmode {...defaultProps} initialData={initialData2} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Room 2');
  });

  it('should handle useEffect with initialData that changes from falsy to truthy multiple times', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const truthyData = { name: 'Truthy Room', type: ['Single'], pricePerNight: '150', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={truthyData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Truthy Room');
    rerender(<Generalmode {...defaultProps} initialData={null} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Truthy Room');
    const anotherTruthyData = { name: 'Another Room', type: ['Double'], pricePerNight: '250', roomInformation: ['AC'] };
    rerender(<Generalmode {...defaultProps} initialData={anotherTruthyData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Another Room');
  });

  it('should handle useEffect when component is unmounted and remounted', () => {
    const { unmount } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    unmount();
    render(<Generalmode {...defaultProps} initialData={{ name: 'Remounted Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] }} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Remounted Room');
  });

  it('should handle useEffect in StrictMode', () => {
    const { rerender } = render(
      <React.StrictMode>
        <Generalmode {...defaultProps} initialData={undefined} />
      </React.StrictMode>
    );
    expect(screen.getByTestId('name-input')).toHaveValue('');
    rerender(
      <React.StrictMode>
        <Generalmode {...defaultProps} initialData={{ name: 'StrictMode Room', type: ['Double'], pricePerNight: '200', roomInformation: ['AC'] }} />
      </React.StrictMode>
    );
    expect(screen.getByTestId('name-input')).toHaveValue('StrictMode Room');
  });

  it('should handle useEffect with rapid prop changes', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    for (let i = 0; i < 5; i++) {
      const data = { name: `Room ${i}`, type: ['Single'], pricePerNight: `${100 + i * 10}`, roomInformation: ['WiFi'] };
      rerender(<Generalmode {...defaultProps} initialData={data} />);
    }
    expect(screen.getByTestId('name-input')).toHaveValue('Room 4');
  });

  it('should handle useEffect when component becomes mounted with initialData', () => {
    const { rerender } = render(<Generalmode {...defaultProps} isOpen={false} initialData={undefined} />);
    expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
    rerender(<Generalmode {...defaultProps} isOpen={true} initialData={{ name: 'Mounted Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] }} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Mounted Room');
  });

  it('should handle useEffect when component unmounts and remounts with different initialData', () => {
    const { rerender } = render(<Generalmode {...defaultProps} isOpen={true} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    rerender(<Generalmode {...defaultProps} isOpen={false} initialData={undefined} />);
    expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
    rerender(<Generalmode {...defaultProps} isOpen={true} initialData={{ name: 'Remounted Truthy Room', type: ['Double'], pricePerNight: '200', roomInformation: ['AC'] }} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Remounted Truthy Room');
  });

  it('should handle useEffect dependency array changes', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const newInitialData = { name: 'Dependency Changed Room', type: ['Single'], pricePerNight: '150', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={newInitialData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Dependency Changed Room');
    const anotherInitialData = { name: 'Another Dependency Room', type: ['Double'], pricePerNight: '250', roomInformation: ['AC'] };
    rerender(<Generalmode {...defaultProps} initialData={anotherInitialData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Another Dependency Room');
  });

  it('should handle useEffect when component is rendered but not executed', () => {
    const { rerender } = render(<Generalmode {...defaultProps} isOpen={false} initialData={undefined} />);
    expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
    rerender(<Generalmode {...defaultProps} isOpen={true} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
  });

  it('should handle useEffect with specific edge case for line 21', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const edgeCaseData = { name: 'Edge Case Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={edgeCaseData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Edge Case Room');
    rerender(<Generalmode {...defaultProps} initialData={edgeCaseData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Edge Case Room');
  });
  it('should handle useEffect with specific timing scenario for line 21', () => {
    const { rerender } = render(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('');
    const truthyData = { name: 'Truthy Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] };
    rerender(<Generalmode {...defaultProps} initialData={truthyData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Truthy Room');
    rerender(<Generalmode {...defaultProps} initialData={undefined} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Truthy Room');
    rerender(<Generalmode {...defaultProps} initialData={truthyData} />);
    expect(screen.getByTestId('name-input')).toHaveValue('Truthy Room');
  });
});
