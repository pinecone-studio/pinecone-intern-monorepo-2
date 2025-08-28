import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { General } from '../../../src/components/room/General';

// Mock the Generalmode component
jest.mock('../../../src/components/room/Generalmode', () => ({
  Generalmode: ({ isOpen, onClose, onSave, _loading, _initialData }: any) =>
    isOpen ? (
      <div data-testid="general-modal">
        <button onClick={() => onSave({ name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['WiFi'] })}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('General', () => {
  const defaultProps = {
    onSave: jest.fn(),
    loading: false,
    _onImageSave: jest.fn(),
    _data: {
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi', 'AC'],
    },
  };

  it('should render successfully', () => {
    render(<General {...defaultProps} />);

    expect(screen.getByText('General Info')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should display room data correctly', () => {
    render(<General {...defaultProps} />);

    expect(screen.getByText('Test Room')).toBeInTheDocument();
    expect(screen.getByText('Single')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('WiFi, AC')).toBeInTheDocument();
  });

  it('should open modal when edit button is clicked', () => {
    render(<General {...defaultProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByTestId('general-modal')).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(<General {...defaultProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('general-modal')).not.toBeInTheDocument();
  });

  it('should call onSave when save button is clicked', () => {
    const mockOnSave = jest.fn();
    render(<General {...defaultProps} onSave={mockOnSave} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Test Room',
      type: ['Single'],
      pricePerNight: '100',
      roomInformation: ['WiFi'],
    });
  });

  it('should handle empty data gracefully', () => {
    const emptyData = {
      name: '',
      type: [],
      pricePerNight: '',
      roomInformation: [],
    };

    render(<General {...defaultProps} _data={emptyData} />);

    // Check that all fields show -/- for empty data
    const dashElements = screen.getAllByText('-/-');
    expect(dashElements.length).toBeGreaterThan(0);
  });

  it('should format array data correctly', () => {
    const arrayData = {
      name: 'Test Room',
      type: ['Single', 'Deluxe'],
      pricePerNight: '100',
      roomInformation: ['WiFi', 'AC', 'Pool'],
    };

    render(<General {...defaultProps} _data={arrayData} />);

    expect(screen.getByText('Single, Deluxe')).toBeInTheDocument();
    expect(screen.getByText('WiFi, AC, Pool')).toBeInTheDocument();
  });
});
