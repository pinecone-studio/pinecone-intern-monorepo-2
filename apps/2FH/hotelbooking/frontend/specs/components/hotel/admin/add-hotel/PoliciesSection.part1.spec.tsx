import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { PoliciesSection } from '@/components/admin/add-hotel/PoliciesSection';

describe('PoliciesSection - Part 1', () => {
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

  it('renders the component with title and icon', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    expect(screen.getByText('Policies')).toBeInTheDocument();
  });

  it('renders all existing policies', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    expect(screen.getByDisplayValue('15:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Please bring a valid ID and credit card.')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Key card')).toHaveLength(2); // One in each policy
    expect(screen.getByDisplayValue('Mobile app')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Children under 12 stay free. Extra beds available for $25/night.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pets are welcome with a $50 deposit.')).toBeInTheDocument();
  });

  it('displays policy numbers correctly', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    expect(screen.getByText('Policy 1')).toBeInTheDocument();
    expect(screen.getByText('Policy 2')).toBeInTheDocument();
  });

  it('displays add policy button', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    expect(screen.getByText('Add Policy')).toBeInTheDocument();
  });

  it('handles adding a new policy', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const addButton = screen.getByText('Add Policy');
    fireEvent.click(addButton);

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([
      ...mockPolicies,
      {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: '',
        accessMethods: ['Key card'],
        childrenAndExtraBeds: '',
        pets: '',
      },
    ]);
  });

  it('handles removing a policy', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    // Get all buttons with SVG icons (remove buttons)
    const allButtons = screen.getAllByTestId('button');
    const removeButtons = allButtons.filter((button) => button.querySelector('svg') && !button.textContent.includes('Add'));

    expect(removeButtons).toHaveLength(4); // 2 policy remove buttons + 2 access method remove buttons

    fireEvent.click(removeButtons[0]); // Remove first policy

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([mockPolicies[1]]);
  });

  it('handles updating check-in time', () => {
    render(<PoliciesSection policies={mockPolicies} onPoliciesChange={mockOnPoliciesChange} />);

    const checkInInputs = screen.getAllByDisplayValue('15:00');
    fireEvent.change(checkInInputs[0], { target: { value: '16:00' } });

    expect(mockOnPoliciesChange).toHaveBeenCalledWith([{ ...mockPolicies[0], checkIn: '16:00' }, mockPolicies[1]]);
  });
});
