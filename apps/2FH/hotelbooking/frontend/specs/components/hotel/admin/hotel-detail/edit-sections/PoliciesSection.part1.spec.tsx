import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { PoliciesSection } from '@/components/admin/hotel-detail/edit-sections/PoliciesSection';

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

describe('PoliciesSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders all policies from form data', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByText('Policy 1')).toBeInTheDocument();
    expect(screen.getByText('Policy 2')).toBeInTheDocument();
  });

  it('displays policy data correctly', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByDisplayValue('14:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Please present valid ID')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Children under 12 stay free')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pets not allowed')).toBeInTheDocument();
  });

  it('handles check-in time change', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const checkInInput = screen.getByDisplayValue('14:00');
    fireEvent.change(checkInInput, { target: { value: '16:00' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('policies', [
      {
        checkIn: '16:00',
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
    ]);
  });

  it('handles check-out time change', () => {
    render(<PoliciesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const checkOutInput = screen.getByDisplayValue('11:00');
    fireEvent.change(checkOutInput, { target: { value: '10:00' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('policies', [
      {
        checkIn: '14:00',
        checkOut: '10:00',
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
    ]);
  });
});
