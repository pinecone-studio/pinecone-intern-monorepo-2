import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { OptionalExtrasSection } from '@/components/admin/add-hotel/OptionalExtrasSection';

const mockOptionalExtras = [
  {
    youNeedToKnow: 'Check-in time is 3:00 PM, check-out is 11:00 AM.',
    weShouldMention: 'Free breakfast is included in your stay.',
  },
  {
    youNeedToKnow: 'Parking is available on-site for $15 per night.',
    weShouldMention: 'We offer airport shuttle service for an additional fee.',
  },
];

const mockOnOptionalExtrasChange = jest.fn();

describe('OptionalExtrasSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with title and icon', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    expect(screen.getAllByText('What You Need to Know')[0]).toBeInTheDocument();
  });

  it('renders all existing optional extras', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    expect(screen.getByDisplayValue('Check-in time is 3:00 PM, check-out is 11:00 AM.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Free breakfast is included in your stay.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Parking is available on-site for $15 per night.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('We offer airport shuttle service for an additional fee.')).toBeInTheDocument();
  });

  it('displays extra information numbers correctly', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    expect(screen.getByText('Extra Information 1')).toBeInTheDocument();
    expect(screen.getByText('Extra Information 2')).toBeInTheDocument();
  });

  it('displays add extra information button', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    expect(screen.getByText('Add Extra Information')).toBeInTheDocument();
  });

  it('handles adding a new optional extra', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const addButton = screen.getByText('Add Extra Information');
    fireEvent.click(addButton);

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledWith([...mockOptionalExtras, { youNeedToKnow: '', weShouldMention: '' }]);
  });

  it('handles removing an optional extra', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    expect(removeButtons).toHaveLength(2); // Should have 2 remove buttons for 2 extras

    fireEvent.click(removeButtons[0]); // Remove first extra

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledWith([mockOptionalExtras[1]]);
  });

  it('handles updating "What You Need to Know" field', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter important information guests need to know...');
    fireEvent.change(youNeedToKnowInputs[1], { target: { value: 'Updated important information.' } });

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledWith([mockOptionalExtras[0], { ...mockOptionalExtras[1], youNeedToKnow: 'Updated important information.' }]);
  });

  it('handles updating "We Should Mention" field', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const weShouldMentionInputs = screen.getAllByPlaceholderText('Enter additional information we should mention...');
    fireEvent.change(weShouldMentionInputs[0], { target: { value: 'Updated additional information.' } });

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledWith([{ ...mockOptionalExtras[0], weShouldMention: 'Updated additional information.' }, mockOptionalExtras[1]]);
  });

  it('does not show remove button when only one optional extra exists', () => {
    render(<OptionalExtrasSection optionalExtras={[mockOptionalExtras[0]]} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    expect(removeButtons).toHaveLength(0);
  });

  it('handles multiple optional extra additions', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const addButton = screen.getByText('Add Extra Information');

    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledTimes(2);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(1, [...mockOptionalExtras, { youNeedToKnow: '', weShouldMention: '' }]);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(2, [...mockOptionalExtras, { youNeedToKnow: '', weShouldMention: '' }]);
  });

  it('handles removing multiple optional extras', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    fireEvent.click(removeButtons[0]); // Remove first
    fireEvent.click(removeButtons[0]); // Remove second (now first after first removal)

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledTimes(2);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(1, [mockOptionalExtras[1]]);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(2, [mockOptionalExtras[1]]);
  });
});
