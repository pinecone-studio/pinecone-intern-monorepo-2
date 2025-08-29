import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Roomservice } from '../../../src/components/room/Roomservice';

jest.mock('../../../src/components/room/Roomservicemodal', () => ({
  RoomServiceModal: ({ isOpen, onClose, onSave, loading, _data }: any) =>
    isOpen ? (
      <div data-testid="roomservice-modal">
        <button
          onClick={() => onSave({ bathroom: ['Private'], accessibility: ['Wheelchair'], entertainment: ['TV'], foodAndDrink: ['Breakfast'], other: ['Desk'], internet: ['WiFi'], bedRoom: ['AC'] })}
        >
          Save
        </button>
        <button onClick={onClose}>Close</button>
        <span data-testid="modal-loading">{loading ? 'Loading' : 'Not Loading'}</span>
      </div>
    ) : null,
}));

describe('Roomservice Modal Actions & State', () => {
  const defaultProps = {
    onSave: jest.fn(),
    loading: false,
    _data: {
      bathroom: ['Private', 'Shared'],
      accessibility: ['Wheelchair'],
      entertainment: ['TV', 'WiFi'],
      foodAndDrink: ['Breakfast'],
      other: ['Desk'],
      internet: ['WiFi'],
      bedRoom: ['AC', 'Heating'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open modal when edit button is clicked', () => {
    render(<Roomservice {...defaultProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByTestId('roomservice-modal')).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(<Roomservice {...defaultProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('roomservice-modal')).not.toBeInTheDocument();
  });

  it('should call onSave when save button is clicked', () => {
    const mockOnSave = jest.fn();
    render(<Roomservice {...defaultProps} onSave={mockOnSave} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      bathroom: ['Private'],
      accessibility: ['Wheelchair'],
      entertainment: ['TV'],
      foodAndDrink: ['Breakfast'],
      other: ['Desk'],
      internet: ['WiFi'],
      bedRoom: ['AC'],
    });
  });

  it('should update local state when save is called', () => {
    render(<Roomservice onSave={defaultProps.onSave} loading={defaultProps.loading} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getByText('Private')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair')).toBeInTheDocument();
    expect(screen.getByText('Tv')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Desk')).toBeInTheDocument();
    expect(screen.getByText('Wifi')).toBeInTheDocument();
    expect(screen.getByText('Ac')).toBeInTheDocument();
  });

  it('should close modal after saving', () => {
    render(<Roomservice onSave={defaultProps.onSave} loading={defaultProps.loading} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.queryByTestId('roomservice-modal')).not.toBeInTheDocument();
  });

  it('should prioritize _data over local state for display', () => {
    const mockOnSave = jest.fn();
    const initialData = {
      bathroom: ['initial'],
      accessibility: ['initial'],
      entertainment: ['initial'],
      foodAndDrink: ['initial'],
      other: ['initial'],
      internet: ['initial'],
      bedRoom: ['initial'],
    };

    render(<Roomservice onSave={mockOnSave} loading={false} _data={initialData} />);

    expect(screen.getAllByText('Initial')).toHaveLength(7);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(screen.getAllByText('Initial')).toHaveLength(7);
  });

  it('should call onSave and close modal in handleSave', () => {
    const mockOnSave = jest.fn();
    render(<Roomservice onSave={mockOnSave} loading={false} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      bathroom: ['Private'],
      accessibility: ['Wheelchair'],
      entertainment: ['TV'],
      foodAndDrink: ['Breakfast'],
      other: ['Desk'],
      internet: ['WiFi'],
      bedRoom: ['AC'],
    });

    expect(screen.queryByTestId('roomservice-modal')).not.toBeInTheDocument();
  });
});
