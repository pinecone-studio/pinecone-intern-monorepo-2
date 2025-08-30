import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { BasicInfoSection } from '@/components/admin/hotel-detail/edit-sections/BasicInfoSection';

const mockFormData = {
  name: 'Test Hotel',
  description: 'Test description',
  phone: '+1234567890',
  stars: 4,
  country: 'Test Country',
  city: 'Test City',
  location: 'Test Location',
  rating: 8.5,
};

const mockHandleInputChange = jest.fn();

describe('BasicInfoSection - Part 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('has disabled user rating input field', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const ratingInput = screen.getByLabelText('User Rating (Read-only)');
    expect(ratingInput).toBeDisabled();
    expect(ratingInput).toHaveClass('bg-gray-100');
  });

  it('does not call handleInputChange for disabled fields', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const starsInput = screen.getByLabelText('Stars (Read-only)');
    const ratingInput = screen.getByLabelText('User Rating (Read-only)');

    fireEvent.change(starsInput, { target: { value: '5' } });
    fireEvent.change(ratingInput, { target: { value: '9.0' } });

    expect(mockHandleInputChange).not.toHaveBeenCalled();
  });

  it('handles empty form data', () => {
    const emptyFormData = {
      name: '',
      description: '',
      phone: '',
      stars: 0,
      country: '',
      city: '',
      location: '',
      rating: 0,
    };

    render(<BasicInfoSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);

    // Use getAllByDisplayValue to handle multiple empty inputs
    expect(screen.getAllByDisplayValue('')).toHaveLength(6); // name, description, phone, country, city, location
    expect(screen.getAllByDisplayValue('0')).toHaveLength(2); // stars, rating
  });

  it('handles special characters in form data', () => {
    const specialFormData = {
      ...mockFormData,
      name: 'Hotel & Resort <Special> "Quotes"',
      description: 'Description with\nnewlines and\ttabs',
      phone: '+1 (555) 123-4567',
      location: '123 Main St., Suite #100',
    };

    render(<BasicInfoSection formData={specialFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByDisplayValue('Hotel & Resort <Special> "Quotes"')).toBeInTheDocument();
    // For textarea, we need to check the text content instead of display value
    const descriptionTextarea = screen.getByLabelText('Description');
    expect(descriptionTextarea).toHaveTextContent('Description with newlines and tabs');
    expect(screen.getByDisplayValue('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St., Suite #100')).toBeInTheDocument();
  });

  it('has correct input types and attributes', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const starsInput = screen.getByLabelText('Stars (Read-only)');
    const ratingInput = screen.getByLabelText('User Rating (Read-only)');
    const cityInput = screen.getByLabelText('City');

    expect(starsInput).toHaveAttribute('type', 'number');
    expect(starsInput).toHaveAttribute('min', '1');
    expect(starsInput).toHaveAttribute('max', '5');

    expect(ratingInput).toHaveAttribute('type', 'number');
    expect(ratingInput).toHaveAttribute('step', '0.1');
    expect(ratingInput).toHaveAttribute('min', '0');
    expect(ratingInput).toHaveAttribute('max', '10');

    expect(cityInput).toHaveAttribute('placeholder', 'Enter city name...');
  });

  it('renders country input field correctly', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Country')).toBeInTheDocument();
  });

  it('handles form data with decimal values', () => {
    const decimalFormData = {
      ...mockFormData,
      stars: 4.5,
      rating: 8.75,
    };

    render(<BasicInfoSection formData={decimalFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByDisplayValue('4.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8.75')).toBeInTheDocument();
  });

  it('maintains form layout with grid structure', () => {
    render(<BasicInfoSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // The component should have grid layout for certain field groups
    const formContainer = screen.getByLabelText('Hotel Name').closest('.space-y-4');
    expect(formContainer).toBeInTheDocument();
  });
});
