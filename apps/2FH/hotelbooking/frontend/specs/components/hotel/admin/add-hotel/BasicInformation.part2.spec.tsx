import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { BasicInformation } from '@/components/admin/add-hotel/BasicInformation';
import { FormData } from '@/components/admin/add-hotel/types';

const mockFormData: FormData = {
  name: 'Test Hotel',
  phone: '+1234567890',
  city: 'Test City',
  country: 'Test Country',
  location: 'Test Location',
  stars: 4,
  rating: 8.5,
  description: 'Test description',
  images: [],
  amenities: [],
  policies: [],
  faqs: [],
  languages: [],
  optionalExtras: [],
};

const mockOnInputChange = jest.fn();

describe('BasicInformation - Part 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('handles user rating input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const ratingInput = screen.getByLabelText('User Rating *');
    fireEvent.change(ratingInput, { target: { value: '9.2' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('rating', 9.2);
  });

  it('handles description input change', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const descriptionInput = screen.getByLabelText('Description *');
    fireEvent.change(descriptionInput, { target: { value: 'Updated hotel description' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('description', 'Updated hotel description');
  });

  it('has correct input types and attributes', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const starsInput = screen.getByLabelText('Star Rating *');
    expect(starsInput).toHaveAttribute('type', 'number');
    expect(starsInput).toHaveAttribute('min', '1');
    expect(starsInput).toHaveAttribute('max', '5');

    const ratingInput = screen.getByLabelText('User Rating *');
    expect(ratingInput).toHaveAttribute('type', 'number');
    expect(ratingInput).toHaveAttribute('min', '0');
    expect(ratingInput).toHaveAttribute('max', '10');
    expect(ratingInput).toHaveAttribute('step', '0.1');
  });

  it('has required attributes on all fields', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const requiredInputs = [
      screen.getByLabelText('Hotel Name *'),
      screen.getByLabelText('Phone Number *'),
      screen.getByLabelText('City *'),
      screen.getByLabelText('Country *'),
      screen.getByLabelText('Location *'),
      screen.getByLabelText('Star Rating *'),
      screen.getByLabelText('User Rating *'),
      screen.getByLabelText('Description *'),
    ];

    requiredInputs.forEach((input) => {
      expect(input).toHaveAttribute('required');
    });
  });

  it('has correct placeholders', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    expect(screen.getByPlaceholderText('Enter hotel name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter phone number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter city')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter country')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter location/address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter hotel description')).toBeInTheDocument();
  });

  it('handles empty form data', () => {
    const emptyFormData: FormData = {
      name: '',
      phone: '',
      city: '',
      country: '',
      location: '',
      stars: 0,
      rating: 0,
      description: '',
      images: [],
      amenities: [],
      policies: [],
      faqs: [],
      languages: [],
      optionalExtras: [],
    };

    render(<BasicInformation formData={emptyFormData} onInputChange={mockOnInputChange} />);

    expect(screen.getAllByDisplayValue('')).toHaveLength(6);
    expect(screen.getAllByDisplayValue('0')).toHaveLength(2);
  });

  it('handles multiple input changes', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const nameInput = screen.getByLabelText('Hotel Name *');
    const phoneInput = screen.getByLabelText('Phone Number *');

    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.change(phoneInput, { target: { value: 'Updated Phone' } });

    expect(mockOnInputChange).toHaveBeenCalledTimes(2);
    expect(mockOnInputChange).toHaveBeenNthCalledWith(1, 'name', 'Updated Name');
    expect(mockOnInputChange).toHaveBeenNthCalledWith(2, 'phone', 'Updated Phone');
  });

  it('handles decimal rating values', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const ratingInput = screen.getByLabelText('User Rating *');
    fireEvent.change(ratingInput, { target: { value: '7.8' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('rating', 7.8);
  });

  it('handles zero values for numeric fields', () => {
    render(<BasicInformation formData={mockFormData} onInputChange={mockOnInputChange} />);

    const starsInput = screen.getByLabelText('Star Rating *');
    const ratingInput = screen.getByLabelText('User Rating *');

    fireEvent.change(starsInput, { target: { value: '0' } });
    fireEvent.change(ratingInput, { target: { value: '0' } });

    expect(mockOnInputChange).toHaveBeenCalledWith('stars', 0);
    expect(mockOnInputChange).toHaveBeenCalledWith('rating', 0);
  });
});
