import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { OptionalExtrasSection } from '@/components/admin/add-hotel/OptionalExtrasSection';

describe('OptionalExtrasSection - Part 2', () => {
  const mockOptionalExtras = [
    {
      youNeedToKnow: 'Free breakfast included',
      weShouldMention: '24/7 front desk service',
    },
    {
      youNeedToKnow: 'Free WiFi in all areas',
      weShouldMention: 'Complimentary parking available',
    },
  ];
  const mockOnOptionalExtrasChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('handles updating multiple fields', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter important information guests need to know...');
    const weShouldMentionInputs = screen.getAllByPlaceholderText('Enter additional information we should mention...');

    fireEvent.change(youNeedToKnowInputs[0], { target: { value: 'New important info.' } });
    fireEvent.change(weShouldMentionInputs[1], { target: { value: 'New additional info.' } });

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledTimes(2);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(1, [{ ...mockOptionalExtras[0], youNeedToKnow: 'New important info.' }, mockOptionalExtras[1]]);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(2, [
      { ...mockOptionalExtras[0], youNeedToKnow: 'Free breakfast included' },
      { ...mockOptionalExtras[1], weShouldMention: 'New additional info.' },
    ]);
  });

  it('handles empty optional extras array', () => {
    render(<OptionalExtrasSection optionalExtras={[]} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    expect(screen.queryByPlaceholderText('Enter important information guests need to know...')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter additional information we should mention...')).not.toBeInTheDocument();
    expect(screen.getByText('Add Extra Information')).toBeInTheDocument();
  });

  it('handles adding optional extra to empty array', () => {
    render(<OptionalExtrasSection optionalExtras={[]} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const addButton = screen.getByText('Add Extra Information');
    fireEvent.click(addButton);

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledWith([{ youNeedToKnow: '', weShouldMention: '' }]);
  });

  it('has correct textarea attributes and placeholders', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter important information guests need to know...');
    const weShouldMentionInputs = screen.getAllByPlaceholderText('Enter additional information we should mention...');

    expect(youNeedToKnowInputs).toHaveLength(2);
    expect(weShouldMentionInputs).toHaveLength(2);

    youNeedToKnowInputs.forEach((textarea) => {
      expect(textarea).toHaveAttribute('rows', '3');
    });

    weShouldMentionInputs.forEach((textarea) => {
      expect(textarea).toHaveAttribute('rows', '3');
    });
  });

  it('has correct IDs for form elements', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    expect(screen.getAllByLabelText('What You Need to Know')[0]).toHaveAttribute('id', 'you-need-to-know-0');
    expect(screen.getAllByLabelText('We Should Mention')[0]).toHaveAttribute('id', 'we-should-mention-0');
  });

  it('maintains optional extra order when updating', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter important information guests need to know...');
    fireEvent.change(youNeedToKnowInputs[1], { target: { value: 'Updated second important info.' } });

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledWith([mockOptionalExtras[0], { ...mockOptionalExtras[1], youNeedToKnow: 'Updated second important info.' }]);
  });

  it('handles special characters in text fields', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter important information guests need to know...');
    const weShouldMentionInputs = screen.getAllByPlaceholderText('Enter additional information we should mention...');

    fireEvent.change(youNeedToKnowInputs[0], { target: { value: 'Check-in: 3:00 PM (15:00) - Late check-in available!' } });
    fireEvent.change(weShouldMentionInputs[0], { target: { value: 'Free WiFi password: "Hotel123" - Available 24/7!' } });

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledTimes(2);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(1, [{ ...mockOptionalExtras[0], youNeedToKnow: 'Check-in: 3:00 PM (15:00) - Late check-in available!' }, mockOptionalExtras[1]]);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(2, [
      { ...mockOptionalExtras[0], youNeedToKnow: 'Free breakfast included', weShouldMention: 'Free WiFi password: "Hotel123" - Available 24/7!' },
      mockOptionalExtras[1],
    ]);
  });

  it('handles very long text content', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const youNeedToKnowInputs = screen.getAllByPlaceholderText('Enter important information guests need to know...');
    const weShouldMentionInputs = screen.getAllByPlaceholderText('Enter additional information we should mention...');

    const longText1 = 'A'.repeat(500);
    const longText2 = 'B'.repeat(1000);

    fireEvent.change(youNeedToKnowInputs[0], { target: { value: longText1 } });
    fireEvent.change(weShouldMentionInputs[0], { target: { value: longText2 } });

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledTimes(2);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(1, [{ ...mockOptionalExtras[0], youNeedToKnow: longText1 }, mockOptionalExtras[1]]);
    expect(mockOnOptionalExtrasChange).toHaveBeenNthCalledWith(2, [{ ...mockOptionalExtras[0], youNeedToKnow: 'Free breakfast included', weShouldMention: longText2 }, mockOptionalExtras[1]]);
  });

  it('handles rapid add/remove operations', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const addButton = screen.getByText('Add Extra Information');
    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    // Rapid operations
    fireEvent.click(addButton);
    fireEvent.click(removeButtons[0]);
    fireEvent.click(addButton);

    expect(mockOnOptionalExtrasChange).toHaveBeenCalledTimes(3);
  });

  it('renders optional extras in bordered containers', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    const extraContainers = screen.getAllByText(/Extra Information \d+/).map((text) => text.closest('.border'));
    expect(extraContainers[0]).toHaveClass('border', 'rounded-lg', 'p-4');
  });

  it('displays correct labels for both textarea fields', () => {
    render(<OptionalExtrasSection optionalExtras={mockOptionalExtras} onOptionalExtrasChange={mockOnOptionalExtrasChange} />);

    expect(screen.getAllByText('What You Need to Know')).toHaveLength(3);
    expect(screen.getAllByText('We Should Mention')).toHaveLength(2);
  });
});
