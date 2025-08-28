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

describe('Roomservice Loading States', () => {
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

  it('should handle loading prop correctly', () => {
    render(<Roomservice {...defaultProps} loading={true} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByTestId('modal-loading')).toBeInTheDocument();
  });

  it('should handle loading prop being false', () => {
    render(<Roomservice {...defaultProps} loading={false} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByTestId('modal-loading')).toBeInTheDocument();
  });

  it('should handle loading prop being undefined', () => {
    render(<Roomservice onSave={defaultProps.onSave} _data={defaultProps._data} loading={undefined} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByTestId('modal-loading')).toBeInTheDocument();
  });
});
