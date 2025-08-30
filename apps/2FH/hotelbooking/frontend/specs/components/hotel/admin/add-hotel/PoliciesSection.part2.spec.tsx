import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { PoliciesSection } from '@/components/admin/add-hotel/PoliciesSection';

describe('PoliciesSection - Part 2', () => {
  const mockPolicies = [
    {
      checkIn: '15:00',
      checkOut: '11:00',
      specialCheckInInstructions: 'Please bring a valid ID and credit card.',
      accessMethods: ['Key card', 'Mobile app'],
      childrenAndExtraBeds: 'Children under 12 stay free. Extra beds available for $25/night.',
      pets: 'Pets are welcome with a $50 deposit.',
    },
    {
      checkIn: '16:00',
      checkOut: '12:00',
      specialCheckInInstructions: 'Early check-in available upon request.',
      accessMethods: ['Key card'],
      childrenAndExtraBeds: 'Children of all ages welcome.',
      pets: 'No pets allowed.',
    },
  ];
  const mockOnPoliciesChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles updating check-out time', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const checkOutInputs = screen.getAllByDisplayValue('11:00');
    fireEvent.change(checkOutInputs[0], { target: { value: '12:00' } });

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([{ ...mockPolicies[0], checkOut: '12:00' }, mockPolicies[1]]);
  });

  it('handles updating special check-in instructions', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const instructionsInputs = screen.getAllByPlaceholderText('Enter special check-in instructions...');
    fireEvent.change(instructionsInputs[1], { target: { value: 'Updated instructions.' } });

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([mockPolicies[0], { ...mockPolicies[1], specialCheckInInstructions: 'Updated instructions.' }]);
  });

  it('handles updating children and extra beds policy', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const childrenInputs = screen.getAllByPlaceholderText('Enter children and extra beds policy...');
    fireEvent.change(childrenInputs[0], { target: { value: 'Updated children policy.' } });

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([{ ...mockPolicies[0], childrenAndExtraBeds: 'Updated children policy.' }, mockPolicies[1]]);
  });

  it('handles updating pet policy', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const petInputs = screen.getAllByPlaceholderText('Enter pet policy...');
    fireEvent.change(petInputs[1], { target: { value: 'Updated pet policy.' } });

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([mockPolicies[0], { ...mockPolicies[1], pets: 'Updated pet policy.' }]);
  });

  it('handles adding access method', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const addAccessMethodButtons = screen.getAllByText('Add Access Method');
    fireEvent.click(addAccessMethodButtons[0]);

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([{ ...mockPolicies[0], accessMethods: ['Key card', 'Mobile app', ''] }, mockPolicies[1]]);
  });

  it('handles removing access method', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    // Find all remove buttons (buttons with SVG icons, excluding Add buttons)
    const allButtons = screen.getAllByTestId('button');
    const allRemoveButtons = allButtons.filter((button) => button.querySelector('svg') && !button.textContent.includes('Add'));

    // Click any access method remove button and verify that the mock was called
    fireEvent.click(allRemoveButtons[2]);

    // Verify that the mock was called
    expect(mockOnPoliciesChange).toHaveBeenCalled();

    // Verify that the first policy's access methods were modified
    const lastCall = mockOnPoliciesChange.mock.calls[mockOnPoliciesChange.mock.calls.length - 1][0];
    expect(lastCall[0].accessMethods).toHaveLength(2);
    expect(lastCall[0].accessMethods).toContain('Key card');
    expect(lastCall[0].accessMethods).toContain('');
  });

  it('handles updating access method', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const accessMethodInputs = screen.getAllByPlaceholderText('Enter access method...');
    // Update the second access method in the first policy (index 1)
    fireEvent.change(accessMethodInputs[1], { target: { value: 'Updated access method' } });

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([{ ...mockPolicies[0], accessMethods: ['Key card', 'Updated access method'] }, mockPolicies[1]]);
  });
});
