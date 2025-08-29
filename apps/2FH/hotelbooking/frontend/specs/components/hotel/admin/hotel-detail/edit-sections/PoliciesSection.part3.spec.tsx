import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { PoliciesSection } from '@/components/admin/hotel-detail/edit-sections/PoliciesSection';

describe('PoliciesSection - Part 3', () => {
  const mockFormData = {
    policies: [
      {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: 'Please present valid ID',
        childrenAndExtraBeds: 'Children under 12 stay free',
        pets: 'Pets not allowed',
      },
      {
        checkIn: '15:00',
        checkOut: '12:00',
        specialCheckInInstructions: 'Early check-in available',
        childrenAndExtraBeds: 'Extra bed available',
        pets: 'Pets allowed with fee',
      },
    ],
  };
  const mockHandleInputChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles special check-in instructions change', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const instructionsInput = screen.getByDisplayValue('Please present valid ID');
    fireEvent.change(instructionsInput, { target: { value: 'New instructions' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('policies', [
      {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: 'New instructions',
        childrenAndExtraBeds: 'Children under 12 stay free',
        pets: 'Pets not allowed',
      },
      {
        checkIn: '15:00',
        checkOut: '12:00',
        specialCheckInInstructions: 'Early check-in available',
        childrenAndExtraBeds: 'Extra bed available',
        pets: 'Pets allowed with fee',
      },
    ]);
  });

  it('handles children and extra beds policy change', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const childrenInput = screen.getByDisplayValue('Children under 12 stay free');
    fireEvent.change(childrenInput, { target: { value: 'New children policy' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('policies', [
      {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: 'Please present valid ID',
        childrenAndExtraBeds: 'New children policy',
        pets: 'Pets not allowed',
      },
      {
        checkIn: '15:00',
        checkOut: '12:00',
        specialCheckInInstructions: 'Early check-in available',
        childrenAndExtraBeds: 'Extra bed available',
        pets: 'Pets allowed with fee',
      },
    ]);
  });

  it('handles pet policy change', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const petsInput = screen.getByDisplayValue('Pets not allowed');
    fireEvent.change(petsInput, { target: { value: 'New pet policy' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('policies', [
      {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: 'Please present valid ID',
        childrenAndExtraBeds: 'Children under 12 stay free',
        pets: 'New pet policy',
      },
      {
        checkIn: '15:00',
        checkOut: '12:00',
        specialCheckInInstructions: 'Early check-in available',
        childrenAndExtraBeds: 'Extra bed available',
        pets: 'Pets allowed with fee',
      },
    ]);
  });

  it('handles multiple field changes in same policy', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const checkInInput = screen.getByDisplayValue('14:00');
    const checkOutInput = screen.getByDisplayValue('11:00');
    const instructionsInput = screen.getByDisplayValue('Please present valid ID');

    fireEvent.change(checkInInput, { target: { value: '16:00' } });
    fireEvent.change(checkOutInput, { target: { value: '10:00' } });
    fireEvent.change(instructionsInput, { target: { value: 'Updated instructions' } });

    expect(mockHandleInputChange).toHaveBeenCalledTimes(3);
  });
}); 