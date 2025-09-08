import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PoliciesSection } from '@/components/admin/add-hotel/PoliciesSection';

const mockPolicies = [
  {
    checkIn: '15:00',
    checkOut: '11:00',
    specialCheckInInstructions: 'Please present valid ID',
    accessMethods: ['Key card', 'Updated access method'],
    childrenAndExtraBeds: 'Children under 12 stay free',
    pets: 'Pets not allowed',
  },
  {
    checkIn: '16:00',
    checkOut: '12:00',
    specialCheckInInstructions: 'Early check-in available',
    accessMethods: ['Mobile app'],
    childrenAndExtraBeds: 'Extra bed available',
    pets: 'Pets allowed with fee',
  },
];

const mockOnPoliciesChange = jest.fn();

describe('PoliciesSection - Part 3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles multiple access methods per policy', () => {
    const policyWithMultipleMethods = {
      ...mockPolicies[0],
      accessMethods: ['Key card', 'Mobile app', 'Digital key', 'Biometric'],
    };

    render(<PoliciesSection policies={[policyWithMultipleMethods]} onPoliciesChange={mockOnPoliciesChange} />);

    expect(screen.getByDisplayValue('Key card')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mobile app')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Digital key')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Biometric')).toBeInTheDocument();
  });

  it('handles rapid add/remove operations', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const addButton = screen.getByText('Add Policy');
    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    // Rapid operations
    fireEvent.click(addButton);
    fireEvent.click(removeButtons[0]);
    fireEvent.click(addButton);

    expect(mockOnPoliciesChange).toHaveBeenCalledTimes(3);
  });

  it('renders policies in bordered containers', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const policyContainers = screen.getAllByText(/Policy \d+/).map((text) => text.closest('.border'));
    expect(policyContainers[0]).toHaveClass('border', 'rounded-lg', 'p-4');
  });

  it('displays correct labels for all form fields', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    expect(screen.getAllByText('Check-in Time')).toHaveLength(2);
    expect(screen.getAllByText('Check-out Time')).toHaveLength(2);
    expect(screen.getAllByText('Special Check-in Instructions')).toHaveLength(2);
    expect(screen.getAllByText('Access Methods')).toHaveLength(2);
    expect(screen.getAllByText('Children and Extra Beds Policy')).toHaveLength(2);
    expect(screen.getAllByText('Pet Policy')).toHaveLength(2);
  });

  it('handles complex access method operations', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const addAccessMethodButtons = screen.getAllByText('Add Access Method');

    // Add new access method
    fireEvent.click(addAccessMethodButtons[0]);

    // Update the new access method (now at index 2)
    const newInputs = screen.getAllByPlaceholderText('Enter access method...');
    fireEvent.change(newInputs[2], { target: { value: 'New method' } });

    expect(mockOnPoliciesChange).toHaveBeenCalledTimes(2);
    expect(mockOnPoliciesChange).toHaveBeenNthCalledWith(1, [{ ...mockPolicies[0], accessMethods: ['Key card', 'Updated access method', ''] }, mockPolicies[1]]);
    expect(mockOnPoliciesChange).toHaveBeenNthCalledWith(2, [{ ...mockPolicies[0], accessMethods: ['Key card', 'Updated access method', ''] }, mockPolicies[1]]);
  });
}); 