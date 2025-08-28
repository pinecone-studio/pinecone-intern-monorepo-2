import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SaveHandler } from '../../../src/components/room/SaveHandler';

// Mock the useCreateRoomMutation hook
jest.mock('../../../src/generated', () => ({
  useCreateRoomMutation: () => [jest.fn(), { loading: false, error: null }],
}));

describe('SaveHandler', () => {
  const defaultProps = {
    selectedHotelId: 'hotel1',
    roomData: {
      general: {
        name: 'Test Room',
        type: ['Single'],
        pricePerNight: '100',
        roomInformation: ['WiFi'],
      },
      services: {
        bathroom: ['Private'],
        accessibility: ['Wheelchair'],
        entertainment: ['TV'],
        foodAndDrink: ['Breakfast'],
        other: ['Desk'],
        internet: ['WiFi'],
        bedRoom: ['AC'],
      },
      images: ['image1.jpg'],
    },
    setRoomData: jest.fn(),
    loading: false,
  };

  it('should render successfully', () => {
    const { container } = render(<SaveHandler {...defaultProps} />);

    expect(container.textContent).toContain('Create Room');
  });

  it('should be enabled when hotel is selected', () => {
    const { container } = render(<SaveHandler {...defaultProps} />);

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button).not.toHaveAttribute('disabled');
  });

  it('should be disabled when no hotel is selected', () => {
    const { container } = render(<SaveHandler {...defaultProps} selectedHotelId="" />);

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button).toHaveAttribute('disabled');
  });

  it('should be disabled when loading', async () => {
    const { container } = render(<SaveHandler {...defaultProps} />);

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    if (button) {
      fireEvent.click(button);

      // Wait for the loading state to be set
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(button).toHaveAttribute('disabled');
    }
  });

  it('should show loading text when loading', async () => {
    const { container } = render(<SaveHandler {...defaultProps} />);

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    if (button) {
      fireEvent.click(button);

      // Wait for the loading state to be set
      await waitFor(() => {
        expect(container.textContent).toContain('Creating Room...');
      });
    }
  });

  it('should handle button click', () => {
    const { container } = render(<SaveHandler {...defaultProps} />);

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    if (button) {
      fireEvent.click(button);
      // Should not throw any errors
    }
  });

  it('should handle click with missing required data', () => {
    const { container } = render(
      <SaveHandler
        {...defaultProps}
        roomData={{
          ...defaultProps.roomData,
          general: { ...defaultProps.roomData.general, name: '' },
        }}
      />
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    if (button) {
      fireEvent.click(button);
    }
  });
});
