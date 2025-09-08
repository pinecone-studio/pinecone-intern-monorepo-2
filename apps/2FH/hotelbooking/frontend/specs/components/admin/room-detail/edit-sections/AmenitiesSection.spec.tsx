import React from 'react';
/* eslint-disable max-lines */
import { render, screen, fireEvent } from '@testing-library/react';
import { AmenitiesSection } from '@/components/admin/room-detail/edit-sections/AmenitiesSection';

describe('AmenitiesSection', () => {
  const mockRoom = {
    internet: ['free_wifi'],
    foodAndDrink: ['free_breakfast', 'minibar'],
    bedRoom: ['air_conditioner'],
    bathroom: ['private', 'free_toiletries'],
    accessibility: ['wheelchair_accessible'],
    entertainment: ['tv'],
    other: ['desk', 'safe'],
  };

  const defaultProps = {
    room: mockRoom,
    handleInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all amenity categories', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByText('Internet')).toBeInTheDocument();
    expect(screen.getByText('Food & Drink')).toBeInTheDocument();
    expect(screen.getByText('Bedroom')).toBeInTheDocument();
    expect(screen.getByText('Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('Other Amenities')).toBeInTheDocument();
  });

  it('renders internet options', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Free WiFi')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Wired Internet')).toBeInTheDocument();
  });

  it('renders food and drink options', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Free Breakfast')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Lunch')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Dinner')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Snacks')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Drinks')).toBeInTheDocument();
    expect(screen.getByLabelText('Electric Kettle')).toBeInTheDocument();
    expect(screen.getByLabelText('Coffee Machine')).toBeInTheDocument();
    expect(screen.getByLabelText('Minibar')).toBeInTheDocument();
  });

  it('renders bedroom options', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Air Conditioner')).toBeInTheDocument();
    expect(screen.getByLabelText('Bed Sheets')).toBeInTheDocument();
    expect(screen.getByLabelText('Pillows')).toBeInTheDocument();
    expect(screen.getByLabelText('Blankets')).toBeInTheDocument();
    expect(screen.getByLabelText('Crib')).toBeInTheDocument();
    expect(screen.getByLabelText('Crib Not Available')).toBeInTheDocument();
    expect(screen.getByLabelText('Heating')).toBeInTheDocument();
  });

  it('renders bathroom options', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Private')).toBeInTheDocument();
    expect(screen.getByLabelText('Shared')).toBeInTheDocument();
    expect(screen.getByLabelText('Bathrobes')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Toiletries')).toBeInTheDocument();
    expect(screen.getByLabelText('Hair Dryer')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Shampoo')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Conditioner')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Body Wash')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Body Lotion')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Body Soap')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Body Scrub')).toBeInTheDocument();
    expect(screen.getByLabelText('Free Body Mask')).toBeInTheDocument();
    expect(screen.getByLabelText('Towels')).toBeInTheDocument();
    expect(screen.getByLabelText('Slippers')).toBeInTheDocument();
    expect(screen.getByLabelText('Toothbrush')).toBeInTheDocument();
    expect(screen.getByLabelText('Toothpaste')).toBeInTheDocument();
  });

  it('renders accessibility options', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Wheelchair Accessible')).toBeInTheDocument();
    expect(screen.getByLabelText('Wheelchair Accessible Bathroom')).toBeInTheDocument();
    expect(screen.getByLabelText('Wheelchair Accessible Shower')).toBeInTheDocument();
    expect(screen.getByLabelText('Wheelchair Accessible Bathtub')).toBeInTheDocument();
    expect(screen.getByLabelText('Wheelchair Accessible Door')).toBeInTheDocument();
    expect(screen.getByLabelText('Wheelchair Accessible Entrance')).toBeInTheDocument();
    expect(screen.getByLabelText('Wheelchair Accessible Parking')).toBeInTheDocument();
    expect(screen.getByLabelText('Thin Carpet')).toBeInTheDocument();
    expect(screen.getByLabelText('Access Via Exterior Corridors')).toBeInTheDocument();
  });

  it('renders entertainment options', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('TV')).toBeInTheDocument();
    expect(screen.getByLabelText('Cable Channels')).toBeInTheDocument();
    expect(screen.getByLabelText('DVD Player')).toBeInTheDocument();
    expect(screen.getByLabelText('Adult Movies')).toBeInTheDocument();
    expect(screen.getByLabelText('Computer')).toBeInTheDocument();
    expect(screen.getByLabelText('Console Free')).toBeInTheDocument();
  });

  it('renders other amenities options', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Daily Housekeeping')).toBeInTheDocument();
    expect(screen.getByLabelText('Desk')).toBeInTheDocument();
    expect(screen.getByLabelText('Laptop Workspace')).toBeInTheDocument();
    expect(screen.getByLabelText('Laptop Workspace Not Available')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Safe')).toBeInTheDocument();
    expect(screen.getByLabelText('Sitting Area')).toBeInTheDocument();
    expect(screen.getByLabelText('Soundproofed Rooms')).toBeInTheDocument();
    expect(screen.getByLabelText('Wardrobes')).toBeInTheDocument();
  });

  it('displays checked state for selected amenities', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Free WiFi')).toBeChecked();
    expect(screen.getByLabelText('Free Breakfast')).toBeChecked();
    expect(screen.getByLabelText('Minibar')).toBeChecked();
    expect(screen.getByLabelText('Air Conditioner')).toBeChecked();
    expect(screen.getByLabelText('Private')).toBeChecked();
    expect(screen.getByLabelText('Free Toiletries')).toBeChecked();
    expect(screen.getByLabelText('Wheelchair Accessible')).toBeChecked();
    expect(screen.getByLabelText('TV')).toBeChecked();
    expect(screen.getByLabelText('Desk')).toBeChecked();
    expect(screen.getByLabelText('Safe')).toBeChecked();
  });

  it('displays unchecked state for unselected amenities', () => {
    render(<AmenitiesSection {...defaultProps} />);

    expect(screen.getByLabelText('Free Wired Internet')).not.toBeChecked();
    expect(screen.getByLabelText('Free Lunch')).not.toBeChecked();
    expect(screen.getByLabelText('Bed Sheets')).not.toBeChecked();
    expect(screen.getByLabelText('Shared')).not.toBeChecked();
    expect(screen.getByLabelText('Cable Channels')).not.toBeChecked();
    expect(screen.getByLabelText('Daily Housekeeping')).not.toBeChecked();
  });

  it('handles checkbox selection for internet amenities', () => {
    const handleInputChange = jest.fn();
    render(<AmenitiesSection {...defaultProps} handleInputChange={handleInputChange} />);

    const freeWiredInternetCheckbox = screen.getByLabelText('Free Wired Internet');
    fireEvent.click(freeWiredInternetCheckbox);

    expect(handleInputChange).toHaveBeenCalledWith('internet', ['free_wifi', 'free_wired_internet']);
  });

  it('handles checkbox deselection for internet amenities', () => {
    const handleInputChange = jest.fn();
    render(<AmenitiesSection {...defaultProps} handleInputChange={handleInputChange} />);

    const freeWifiCheckbox = screen.getByLabelText('Free WiFi');
    fireEvent.click(freeWifiCheckbox);

    expect(handleInputChange).toHaveBeenCalledWith('internet', []);
  });

  it('handles checkbox selection for food and drink amenities', () => {
    const handleInputChange = jest.fn();
    render(<AmenitiesSection {...defaultProps} handleInputChange={handleInputChange} />);

    const freeLunchCheckbox = screen.getByLabelText('Free Lunch');
    fireEvent.click(freeLunchCheckbox);

    expect(handleInputChange).toHaveBeenCalledWith('foodAndDrink', ['free_breakfast', 'minibar', 'free_lunch']);
  });

  it('handles checkbox deselection for food and drink amenities', () => {
    const handleInputChange = jest.fn();
    render(<AmenitiesSection {...defaultProps} handleInputChange={handleInputChange} />);

    const freeBreakfastCheckbox = screen.getByLabelText('Free Breakfast');
    fireEvent.click(freeBreakfastCheckbox);

    expect(handleInputChange).toHaveBeenCalledWith('foodAndDrink', ['minibar']);
  });

  it('handles room with null amenities', () => {
    const roomWithNullAmenities = {
      internet: null,
      foodAndDrink: null,
      bedRoom: null,
      bathroom: null,
      accessibility: null,
      entertainment: null,
      other: null,
    };

    render(<AmenitiesSection {...defaultProps} room={roomWithNullAmenities} />);

    // Should not crash and should render all checkboxes as unchecked
    expect(screen.getByLabelText('Free WiFi')).not.toBeChecked();
    expect(screen.getByLabelText('Free Breakfast')).not.toBeChecked();
  });

  it('handles room with undefined amenities', () => {
    const roomWithUndefinedAmenities = {
      internet: undefined,
      foodAndDrink: undefined,
      bedRoom: undefined,
      bathroom: undefined,
      accessibility: undefined,
      entertainment: undefined,
      other: undefined,
    };

    render(<AmenitiesSection {...defaultProps} room={roomWithUndefinedAmenities} />);

    // Should not crash and should render all checkboxes as unchecked
    expect(screen.getByLabelText('Free WiFi')).not.toBeChecked();
    expect(screen.getByLabelText('Free Breakfast')).not.toBeChecked();
  });

  it('handles room with empty amenity arrays', () => {
    const roomWithEmptyAmenities = {
      internet: [],
      foodAndDrink: [],
      bedRoom: [],
      bathroom: [],
      accessibility: [],
      entertainment: [],
      other: [],
    };

    render(<AmenitiesSection {...defaultProps} room={roomWithEmptyAmenities} />);

    // Should render all checkboxes as unchecked
    expect(screen.getByLabelText('Free WiFi')).not.toBeChecked();
    expect(screen.getByLabelText('Free Breakfast')).not.toBeChecked();
  });

  it('renders amenities in grid layout', () => {
    render(<AmenitiesSection {...defaultProps} />);

    const gridContainers = document.querySelectorAll('.grid.grid-cols-2.gap-3');
    expect(gridContainers.length).toBe(7); // One for each category
  });

  it('renders amenities in scrollable containers', () => {
    render(<AmenitiesSection {...defaultProps} />);

    const scrollableContainers = document.querySelectorAll('.max-h-40.overflow-y-auto');
    expect(scrollableContainers.length).toBe(7); // One for each category
  });

  it('handles checkbox selection for all amenity categories', () => {
    const handleInputChange = jest.fn();
    render(<AmenitiesSection {...defaultProps} handleInputChange={handleInputChange} />);

    // Test bedroom amenities
    const bedSheetsCheckbox = screen.getByLabelText('Bed Sheets');
    fireEvent.click(bedSheetsCheckbox);
    expect(handleInputChange).toHaveBeenCalledWith('bedRoom', ['air_conditioner', 'bed_sheets']);

    // Test bathroom amenities
    const sharedCheckbox = screen.getByLabelText('Shared');
    fireEvent.click(sharedCheckbox);
    expect(handleInputChange).toHaveBeenCalledWith('bathroom', ['private', 'free_toiletries', 'shared']);

    // Test accessibility amenities
    const thinCarpetCheckbox = screen.getByLabelText('Thin Carpet');
    fireEvent.click(thinCarpetCheckbox);
    expect(handleInputChange).toHaveBeenCalledWith('accessibility', ['wheelchair_accessible', 'thin_carpet']);

    // Test entertainment amenities
    const cableChannelsCheckbox = screen.getByLabelText('Cable Channels');
    fireEvent.click(cableChannelsCheckbox);
    expect(handleInputChange).toHaveBeenCalledWith('entertainment', ['tv', 'cable_channels']);

    // Test other amenities
    const dailyHousekeepingCheckbox = screen.getByLabelText('Daily Housekeeping');
    fireEvent.click(dailyHousekeepingCheckbox);
    expect(handleInputChange).toHaveBeenCalledWith('other', ['desk', 'safe', 'daily_housekeeping']);
  });

  it('matches snapshot', () => {
    const { container } = render(<AmenitiesSection {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
