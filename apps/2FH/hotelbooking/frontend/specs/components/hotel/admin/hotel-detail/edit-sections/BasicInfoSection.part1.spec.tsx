import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { BasicInfoSection } from '@/components/admin/hotel-detail/edit-sections/BasicInfoSection';

const mockFormData = {
  name: 'Test Hotel',
  description: 'A test hotel description',
  phone: '+1234567890',
  stars: 4,
  country: 'Test Country',
  city: 'New York',
  location: '123 Test Street',
  rating: 8.5,
};

const mockHandleInputChange = jest.fn();

describe('BasicInfoSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders all form fields', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByLabelText('Hotel Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Stars (Read-only)')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('User Rating (Read-only)')).toBeInTheDocument();
  });

  it('displays current form data values', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A test hotel description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Test Street')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8.5')).toBeInTheDocument();
  });

  it('calls handleInputChange when editable fields change', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const nameInput = screen.getByLabelText('Hotel Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Hotel Name' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('name', 'Updated Hotel Name');
  });

  it('calls handleInputChange when description changes', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('description', 'Updated description');
  });

  it('calls handleInputChange when phone number changes', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: '+0987654321' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('phone', '+0987654321');
  });

  it('calls handleInputChange when city changes', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const cityInput = screen.getByLabelText('City');
    fireEvent.change(cityInput, { target: { value: 'Los Angeles' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('city', 'Los Angeles');
  });

  it('calls handleInputChange when location changes', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const locationInput = screen.getByLabelText('Location');
    fireEvent.change(locationInput, { target: { value: '456 New Street' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('location', '456 New Street');
  });

  it('calls handleInputChange when country input changes', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Canada' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('country', 'Canada');
  });

  it('has disabled stars input field', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const starsInput = screen.getByLabelText('Stars (Read-only)');
    expect(starsInput).toBeDisabled();
    expect(starsInput).toHaveClass('bg-gray-100');
  });
});
