import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { AmenitiesSection } from '@/components/admin/hotel-detail/edit-sections/AmenitiesSection';

describe('AmenitiesSection', () => {
  const mockFormData = {
    amenities: ['WIFI', 'POOL'],
  };

  const mockHandleInputChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all available amenities', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // Check that all amenities are rendered
    expect(screen.getByText('POOL')).toBeInTheDocument();
    expect(screen.getByText('GYM')).toBeInTheDocument();
    expect(screen.getByText('RESTAURANT')).toBeInTheDocument();
    expect(screen.getByText('BAR')).toBeInTheDocument();
    expect(screen.getByText('WIFI')).toBeInTheDocument();
    expect(screen.getByText('PARKING')).toBeInTheDocument();
    expect(screen.getByText('FITNESS CENTER')).toBeInTheDocument();
    expect(screen.getByText('BUSINESS CENTER')).toBeInTheDocument();
    expect(screen.getByText('MEETING ROOMS')).toBeInTheDocument();
    expect(screen.getByText('CONFERENCE ROOMS')).toBeInTheDocument();
    expect(screen.getByText('ROOM SERVICE')).toBeInTheDocument();
    expect(screen.getByText('AIR CONDITIONING')).toBeInTheDocument();
    expect(screen.getByText('AIRPORT TRANSFER')).toBeInTheDocument();
    expect(screen.getByText('FREE WIFI')).toBeInTheDocument();
    expect(screen.getByText('FREE PARKING')).toBeInTheDocument();
    expect(screen.getByText('FREE CANCELLATION')).toBeInTheDocument();
    expect(screen.getByText('SPA')).toBeInTheDocument();
    expect(screen.getByText('PETS ALLOWED')).toBeInTheDocument();
    expect(screen.getByText('SMOKING ALLOWED')).toBeInTheDocument();
    expect(screen.getByText('LAUNDRY FACILITIES')).toBeInTheDocument();
  });

  it('displays checked amenities correctly', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // Check that WIFI and POOL checkboxes are checked
    const wifiCheckboxes = screen.getAllByRole('checkbox', { name: /WIFI/i });
    const poolCheckboxes = screen.getAllByRole('checkbox', { name: /POOL/i });

    expect(wifiCheckboxes[0]).toBeChecked();
    expect(poolCheckboxes[0]).toBeChecked();
  });

  it('displays unchecked amenities correctly', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // Check that GYM checkbox is unchecked
    const gymCheckboxes = screen.getAllByRole('checkbox', { name: /GYM/i });
    expect(gymCheckboxes[0]).not.toBeChecked();
  });

  it('adds amenity when checkbox is checked', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const gymCheckboxes = screen.getAllByRole('checkbox', { name: /GYM/i });
    fireEvent.click(gymCheckboxes[0]);

    expect(mockHandleInputChange).toHaveBeenCalledWith('amenities', ['WIFI', 'POOL', 'GYM']);
  });

  it('removes amenity when checkbox is unchecked', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const wifiCheckboxes = screen.getAllByRole('checkbox', { name: /WIFI/i });
    fireEvent.click(wifiCheckboxes[0]);

    expect(mockHandleInputChange).toHaveBeenCalledWith('amenities', ['POOL']);
  });

  it('handles multiple amenity changes', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // Add GYM
    const gymCheckboxes = screen.getAllByRole('checkbox', { name: /GYM/i });
    fireEvent.click(gymCheckboxes[0]);

    // Remove WIFI
    const wifiCheckboxes = screen.getAllByRole('checkbox', { name: /WIFI/i });
    fireEvent.click(wifiCheckboxes[0]);

    expect(mockHandleInputChange).toHaveBeenCalledTimes(2);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'amenities', ['WIFI', 'POOL', 'GYM']);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'amenities', ['POOL']);
  });

  it('handles empty amenities array', () => {
    const emptyFormData = { amenities: [] };
    render(<AmenitiesSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);

    const wifiCheckboxes = screen.getAllByRole('checkbox', { name: /WIFI/i });
    fireEvent.click(wifiCheckboxes[0]);

    expect(mockHandleInputChange).toHaveBeenCalledWith('amenities', ['WIFI']);
  });

  it('handles amenity removal from empty array', () => {
    const emptyFormData = { amenities: [] };
    render(<AmenitiesSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);

    const wifiCheckboxes = screen.getAllByRole('checkbox', { name: /WIFI/i });
    fireEvent.click(wifiCheckboxes[0]); // Add WIFI
    fireEvent.click(wifiCheckboxes[0]); // Remove WIFI

    expect(mockHandleInputChange).toHaveBeenCalledTimes(2);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'amenities', ['WIFI']);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'amenities', ['WIFI']);
  });

  it('renders with correct accessibility attributes', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // Use getAllByRole and select the first one to handle multiple checkboxes
    const wifiCheckboxes = screen.getAllByRole('checkbox', { name: /WIFI/i });
    expect(wifiCheckboxes[0]).toHaveAttribute('id', 'WIFI');
  });

  it('renders labels with correct formatting', () => {
    render(<AmenitiesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // Check that underscores are replaced with spaces
    expect(screen.getByText('FITNESS CENTER')).toBeInTheDocument();
    expect(screen.getByText('BUSINESS CENTER')).toBeInTheDocument();
    expect(screen.getByText('MEETING ROOMS')).toBeInTheDocument();
    expect(screen.getByText('CONFERENCE ROOMS')).toBeInTheDocument();
    expect(screen.getByText('ROOM SERVICE')).toBeInTheDocument();
    expect(screen.getByText('AIR CONDITIONING')).toBeInTheDocument();
    expect(screen.getByText('AIRPORT TRANSFER')).toBeInTheDocument();
    expect(screen.getByText('FREE WIFI')).toBeInTheDocument();
    expect(screen.getByText('FREE PARKING')).toBeInTheDocument();
    expect(screen.getByText('FREE CANCELLATION')).toBeInTheDocument();
    expect(screen.getByText('PETS ALLOWED')).toBeInTheDocument();
    expect(screen.getByText('SMOKING ALLOWED')).toBeInTheDocument();
    expect(screen.getByText('LAUNDRY FACILITIES')).toBeInTheDocument();
  });
});
