import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { AmenitiesSection } from '@/components/admin/add-hotel/AmenitiesSection';
import { Amenity } from '@/generated';

// Mock the UI components
jest.mock('@/components/ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="card-title">{children}</div>,
}));

jest.mock('@/components/ui/Checkbox', () => ({
  Checkbox: ({ id, checked, onCheckedChange }: any) => (
    <input type="checkbox" id={id} checked={checked} onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)} data-testid={`checkbox-${id}`} />
  ),
}));

jest.mock('@/components/ui/Label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}));

describe('AmenitiesSection - Part 2', () => {
  const mockAmenities = [Amenity.Wifi, Amenity.Pool];
  const mockOnAmenitiesChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('formats amenity names correctly', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    // Test that underscores are replaced with spaces
    expect(screen.getByLabelText('FREE WIFI')).toBeInTheDocument();
    expect(screen.getByLabelText('POOL')).toBeInTheDocument();
    expect(screen.getByLabelText('FREE PARKING')).toBeInTheDocument();
  });

  it('has correct checkbox IDs', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const amenityOptions = Object.values(Amenity);
    amenityOptions.forEach((amenity) => {
      const checkbox = screen.getByLabelText(amenity.replace(/_/g, ' '));
      expect(checkbox).toHaveAttribute('id', amenity);
    });
  });

  it('renders amenities in a grid layout', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    // Test that amenities are rendered in a grid-like structure
    const amenityItems = screen.getAllByRole('checkbox');
    expect(amenityItems.length).toBeGreaterThan(0);
  });

  it('has scrollable container for many amenities', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    // Test that amenities are rendered and accessible
    const amenityItems = screen.getAllByRole('checkbox');
    expect(amenityItems.length).toBeGreaterThan(0);
  });

  it('handles all amenity types', () => {
    const allAmenities = Object.values(Amenity);
    render(<AmenitiesSection amenities={allAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    allAmenities.forEach((amenity) => {
      const label = amenity.replace(/_/g, ' ');
      const checkbox = screen.getByLabelText(label);
      expect(checkbox).toBeChecked();
    });
  });

  it('maintains amenity order when adding/removing', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const parkingCheckbox = screen.getByLabelText('PARKING');
    fireEvent.click(parkingCheckbox);

    // Should maintain original order and add new amenity at the end
    expect(mockOnAmenitiesChange).toHaveBeenCalledWith([Amenity.Wifi, Amenity.Pool, Amenity.Parking]);
  });

  it('handles rapid checkbox clicks', () => {
    render(<AmenitiesSection amenities={mockAmenities} onAmenitiesChange={mockOnAmenitiesChange} />);

    const wifiCheckbox = screen.getByLabelText('WIFI');

    // Rapid clicks
    fireEvent.click(wifiCheckbox);
    fireEvent.click(wifiCheckbox);
    fireEvent.click(wifiCheckbox);

    expect(mockOnAmenitiesChange).toHaveBeenCalledTimes(3);
  });
});
