import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { AmenitiesSection } from '@/components/admin/add-hotel/AmenitiesSection';
import { Amenity } from '@/generated';

const mockAmenities = [Amenity.Wifi, Amenity.Pool];
const mockOnAmenitiesChange = jest.fn();

describe('AmenitiesSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with title and icon', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    expect(screen.getByText('Amenities')).toBeInTheDocument();
  });

  it('renders all amenity options as checkboxes', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const amenityOptions = Object.values(Amenity);
    amenityOptions.forEach((amenity) => {
      const label = amenity.replace(/_/g, ' ');
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('displays selected amenities as checked', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const wifiCheckbox = screen.getByLabelText('WIFI');
    const poolCheckbox = screen.getByLabelText('POOL');
    const parkingCheckbox = screen.getByLabelText('PARKING');

    expect(wifiCheckbox).toBeChecked();
    expect(poolCheckbox).toBeChecked();
    expect(parkingCheckbox).not.toBeChecked();
  });

  it('handles adding a new amenity', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const parkingCheckbox = screen.getByLabelText('PARKING');
    fireEvent.click(parkingCheckbox);

    expect(mockOnAmenitiesChange).toHaveBeenCalledWith([...mockAmenities, Amenity.Parking]);
  });

  it('handles removing an existing amenity', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const wifiCheckbox = screen.getByLabelText('WIFI');
    fireEvent.click(wifiCheckbox);

    expect(mockOnAmenitiesChange).toHaveBeenCalledWith([Amenity.Pool]);
  });

  it('handles multiple amenity selections', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const parkingCheckbox = screen.getByLabelText('PARKING');
    const gymCheckbox = screen.getByLabelText('GYM');

    fireEvent.click(parkingCheckbox);
    fireEvent.click(gymCheckbox);

    expect(mockOnAmenitiesChange).toHaveBeenCalledTimes(2);
    expect(mockOnAmenitiesChange).toHaveBeenNthCalledWith(1, [...mockAmenities, Amenity.Parking]);
    expect(mockOnAmenitiesChange).toHaveBeenNthCalledWith(2, [...mockAmenities, Amenity.Gym]);
  });

  it('handles toggling the same amenity multiple times', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const wifiCheckbox = screen.getByLabelText('WIFI');

    // Remove WIFI
    fireEvent.click(wifiCheckbox);
    expect(mockOnAmenitiesChange).toHaveBeenCalledWith([Amenity.Pool]);

    // Add WIFI back
    fireEvent.click(wifiCheckbox);
    expect(mockOnAmenitiesChange).toHaveBeenCalledWith([Amenity.Pool]);
  });

  it('handles empty amenities array', () => {
    render(<AmenitiesSection amenities={[]} onAmenitiesChange={mockOnAmenitiesChange} />);

    const wifiCheckbox = screen.getByLabelText('WIFI');
    expect(wifiCheckbox).not.toBeChecked();

    fireEvent.click(wifiCheckbox);
    expect(mockOnAmenitiesChange).toHaveBeenCalledWith([Amenity.Wifi]);
  });
});
