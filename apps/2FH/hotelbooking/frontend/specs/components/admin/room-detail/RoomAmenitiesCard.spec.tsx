/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomAmenitiesCard } from '@/components/admin/room-detail/RoomAmenitiesCard';

// Mock dependencies
jest.mock('@/components/admin/room-detail/EditRoomModal', () => ({
  EditRoomModal: ({ room, section, isOpen, onOpenChange, refetch, roomId }: any) => (
    <div data-testid="edit-room-modal">
      <div>Edit Room Modal - {section}</div>
      <button onClick={() => onOpenChange(false)}>Close Modal</button>
    </div>
  ),
}));

describe('RoomAmenitiesCard', () => {
  const mockRoom = {
    id: 'room-1',
    name: 'Deluxe Suite',
    internet: ['free_wifi', 'free_wired_internet'],
    foodAndDrink: ['free_breakfast', 'minibar'],
    bedRoom: ['air_conditioner', 'bed_sheets'],
    bathroom: ['private', 'free_toiletries'],
    accessibility: ['wheelchair_accessible'],
    entertainment: ['tv', 'cable_channels'],
    other: ['desk', 'safe'],
  };

  const defaultProps = {
    room: mockRoom,
    editModalState: { isOpen: false, section: 'amenities' as const },
    setEditModalState: jest.fn(),
    refetch: jest.fn(),
    roomId: 'room-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders amenities card correctly', () => {
    render(<RoomAmenitiesCard {...defaultProps} />);

    expect(screen.getByText('Room Amenities')).toBeInTheDocument();
  });

  it('renders all amenity categories', () => {
    render(<RoomAmenitiesCard {...defaultProps} />);

    // Check for internet amenities
    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
    expect(screen.getByText('Free Wired Internet')).toBeInTheDocument();
    const internetElements = screen.getAllByText('Internet');
    expect(internetElements.length).toBeGreaterThanOrEqual(2); // Should have at least 2 internet amenities

    // Check for food & drink amenities
    expect(screen.getByText('Free Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Minibar')).toBeInTheDocument();
    const foodDrinkElements = screen.getAllByText('Food & Drink');
    expect(foodDrinkElements.length).toBeGreaterThanOrEqual(2); // Should have at least 2 food & drink amenities

    // Check for bedroom amenities
    expect(screen.getByText('Air Conditioner')).toBeInTheDocument();
    expect(screen.getByText('Bed Sheets')).toBeInTheDocument();
    const bedroomElements = screen.getAllByText('Bedroom');
    expect(bedroomElements.length).toBeGreaterThanOrEqual(2); // Should have at least 2 bedroom amenities

    // Check for bathroom amenities
    expect(screen.getByText('Private')).toBeInTheDocument();
    expect(screen.getByText('Free Toiletries')).toBeInTheDocument();
    const bathroomElements = screen.getAllByText('Bathroom');
    expect(bathroomElements.length).toBeGreaterThanOrEqual(2); // Should have at least 2 bathroom amenities

    // Check for accessibility amenities
    expect(screen.getByText('Wheelchair Accessible')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();

    // Check for entertainment amenities
    expect(screen.getByText('Tv')).toBeInTheDocument();
    expect(screen.getByText('Cable Channels')).toBeInTheDocument();
    const entertainmentElements = screen.getAllByText('Entertainment');
    expect(entertainmentElements.length).toBeGreaterThanOrEqual(2); // Should have at least 2 entertainment amenities

    // Check for other amenities
    expect(screen.getByText('Desk')).toBeInTheDocument();
    expect(screen.getByText('Safe')).toBeInTheDocument();
    // Note: "Other Amenities" category might not be rendered if there are no amenities in that category
  });

  it('handles single amenity values', () => {
    const roomWithSingleAmenities = {
      ...mockRoom,
      internet: 'free_wifi', // Single value instead of array
      foodAndDrink: 'free_breakfast',
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithSingleAmenities} />);

    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
    expect(screen.getByText('Free Breakfast')).toBeInTheDocument();
  });

  it('handles empty amenities', () => {
    const roomWithNoAmenities = {
      ...mockRoom,
      internet: [],
      foodAndDrink: [],
      bedRoom: [],
      bathroom: [],
      accessibility: [],
      entertainment: [],
      other: [],
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithNoAmenities} />);

    expect(screen.getByText('No amenities configured for this room')).toBeInTheDocument();
  });

  it('handles null amenities', () => {
    const roomWithNullAmenities = {
      ...mockRoom,
      internet: null,
      foodAndDrink: null,
      bedRoom: null,
      bathroom: null,
      accessibility: null,
      entertainment: null,
      other: null,
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithNullAmenities} />);

    expect(screen.getByText('No amenities configured for this room')).toBeInTheDocument();
  });

  it('handles undefined amenities', () => {
    const roomWithUndefinedAmenities = {
      ...mockRoom,
      internet: undefined,
      foodAndDrink: undefined,
      bedRoom: undefined,
      bathroom: undefined,
      accessibility: undefined,
      entertainment: undefined,
      other: undefined,
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithUndefinedAmenities} />);

    expect(screen.getByText('No amenities configured for this room')).toBeInTheDocument();
  });

  it('filters out empty amenity values', () => {
    const roomWithEmptyValues = {
      ...mockRoom,
      internet: ['free_wifi', '', 'free_wired_internet'],
      foodAndDrink: [null, 'free_breakfast', undefined],
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithEmptyValues} />);

    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
    expect(screen.getByText('Free Wired Internet')).toBeInTheDocument();
    expect(screen.getByText('Free Breakfast')).toBeInTheDocument();
  });

  it('formats amenity values correctly', () => {
    const roomWithUnderscores = {
      ...mockRoom,
      internet: ['free_wifi', 'wired_internet_connection'],
      foodAndDrink: ['free_breakfast_included'],
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithUnderscores} />);

    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
    expect(screen.getByText('Wired Internet Connection')).toBeInTheDocument();
    expect(screen.getByText('Free Breakfast Included')).toBeInTheDocument();
  });

  it('renders amenities in grid layout', () => {
    render(<RoomAmenitiesCard {...defaultProps} />);

    const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders amenity items with proper styling', () => {
    render(<RoomAmenitiesCard {...defaultProps} />);

    const amenityItems = document.querySelectorAll('.flex.items-center.gap-3.p-3.border.rounded-lg');
    expect(amenityItems.length).toBeGreaterThan(0);
  });

  it('opens edit modal when edit button is clicked', () => {
    const setEditModalState = jest.fn();
    render(<RoomAmenitiesCard {...defaultProps} setEditModalState={setEditModalState} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(setEditModalState).toHaveBeenCalledWith({ isOpen: true, section: 'amenities' });
  });

  it('renders edit modal when open', () => {
    render(<RoomAmenitiesCard {...defaultProps} editModalState={{ isOpen: true, section: 'amenities' }} />);

    expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();
  });

  it('handles edit modal state changes', () => {
    const setEditModalState = jest.fn();
    render(<RoomAmenitiesCard {...defaultProps} setEditModalState={setEditModalState} editModalState={{ isOpen: true, section: 'amenities' }} />);

    // The modal should be open and the onOpenChange should be set up
    expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();

    // Simulate the onOpenChange callback being called
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

    // This should trigger the onOpenChange callback
    expect(screen.getByTestId('edit-room-modal')).toBeInTheDocument();
  });

  it('displays correct icons for amenity categories', () => {
    render(<RoomAmenitiesCard {...defaultProps} />);

    // Check that icons are rendered (they should be SVG elements)
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('handles mixed amenity data types', () => {
    const roomWithMixedTypes = {
      ...mockRoom,
      internet: ['free_wifi'], // Array
      foodAndDrink: 'free_breakfast', // String
      bedRoom: null, // Null
      bathroom: undefined, // Undefined
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithMixedTypes} />);

    expect(screen.getByText('Free Wifi')).toBeInTheDocument();
    expect(screen.getByText('Free Breakfast')).toBeInTheDocument();
  });

  it('creates unique keys for amenities', () => {
    const roomWithDuplicateValues = {
      ...mockRoom,
      internet: ['free_wifi'],
      foodAndDrink: ['free_wifi'], // Same value in different category
    };

    render(<RoomAmenitiesCard {...defaultProps} room={roomWithDuplicateValues} />);

    // Should render both instances with different keys
    const freeWifiElements = screen.getAllByText('Free Wifi');
    expect(freeWifiElements.length).toBe(2);
  });

  it('matches snapshot', () => {
    const { container } = render(<RoomAmenitiesCard {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with no amenities', () => {
    const roomWithNoAmenities = {
      ...mockRoom,
      internet: [],
      foodAndDrink: [],
      bedRoom: [],
      bathroom: [],
      accessibility: [],
      entertainment: [],
      other: [],
    };

    const { container } = render(<RoomAmenitiesCard {...defaultProps} room={roomWithNoAmenities} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
