import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { BasicInformation } from '@/components/admin/add-hotel/BasicInformation';

const mockFormData = {
  name: 'Test Hotel',
  phone: '+1234567890',
  city: 'Test City',
  country: 'Test Country',
  location: '123 Test Street',
  stars: 4,
  rating: 8.5,
  description: 'A wonderful test hotel',
  images: [],
  amenities: [],
  policies: [],
  faqs: [],
  languages: [],
  optionalExtras: [],
};

const mockOnInputChange = jest.fn();

describe('BasicInformation - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with title and icon', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    expect(screen.getByText('General Information')).toBeInTheDocument();
  });

  it('renders all form fields with correct labels', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    expect(screen.getByLabelText('Hotel Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number *')).toBeInTheDocument();
    expect(screen.getByLabelText('City *')).toBeInTheDocument();
    expect(screen.getByLabelText('Country *')).toBeInTheDocument();
    expect(screen.getByLabelText('Location *')).toBeInTheDocument();
    expect(screen.getByLabelText('Star Rating *')).toBeInTheDocument();
    expect(screen.getByLabelText('User Rating *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
  });

  it('displays current form data values', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Country')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Test Street')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A wonderful test hotel')).toBeInTheDocument();
  });

  it('handles hotel name input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const nameInput = screen.getByLabelText('Hotel Name *');
    fireEvent.change(nameInput, { target: { value: 'New Hotel Name' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('name', 'New Hotel Name');
  });

  it('handles phone number input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const phoneInput = screen.getByLabelText('Phone Number *');
    fireEvent.change(phoneInput, { target: { value: '+9876543210' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('phone', '+9876543210');
  });

  it('handles city input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const cityInput = screen.getByLabelText('City *');
    fireEvent.change(cityInput, { target: { value: 'New City' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('city', 'New City');
  });

  it('handles country input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const countryInput = screen.getByLabelText('Country *');
    fireEvent.change(countryInput, { target: { value: 'New Country' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('country', 'New Country');
  });

  it('handles location input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const locationInput = screen.getByLabelText('Location *');
    fireEvent.change(locationInput, { target: { value: '456 New Street' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('location', '456 New Street');
  });

  it('handles star rating input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const starsInput = screen.getByLabelText('Star Rating *');
    fireEvent.change(starsInput, { target: { value: '5' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('stars', 5);
  });
});
