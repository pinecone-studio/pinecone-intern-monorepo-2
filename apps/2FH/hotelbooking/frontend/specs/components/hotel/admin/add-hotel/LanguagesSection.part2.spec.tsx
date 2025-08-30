import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { LanguagesSection } from '@/components/admin/add-hotel/LanguagesSection';

describe('LanguagesSection - Part 2', () => {
  const mockLanguages: string[] = ['English', 'Spanish', 'French'];
  const mockOnLanguagesChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('handles updating multiple language values', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const languageInputs = screen.getAllByPlaceholderText('Enter language');

    fireEvent.change(languageInputs[0], { target: { value: 'German' } });
    fireEvent.change(languageInputs[2], { target: { value: 'Italian' } });

    expect(mockOnLanguagesChange).toHaveBeenCalledTimes(2);
    expect(mockOnLanguagesChange).toHaveBeenNthCalledWith(1, ['German', 'Spanish', 'French']);
    expect(mockOnLanguagesChange).toHaveBeenNthCalledWith(2, ['English', 'Spanish', 'Italian']);
  });

  it('handles empty languages array', () => {
    render(<LanguagesSection languages={[]} onLanguagesChange={mockOnLanguagesChange} />);

    expect(screen.queryByPlaceholderText('Enter language')).not.toBeInTheDocument();
    expect(screen.getByText('Add Language')).toBeInTheDocument();
  });

  it('handles adding language to empty array', () => {
    render(<LanguagesSection languages={[]} onLanguagesChange={mockOnLanguagesChange} />);

    const addButton = screen.getByText('Add Language');
    fireEvent.click(addButton);

    expect(mockOnLanguagesChange).toHaveBeenCalledWith(['']);
  });

  it('has correct input attributes', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const languageInputs = screen.getAllByPlaceholderText('Enter language');
    languageInputs.forEach((input) => {
      expect(input).toHaveAttribute('required');
    });
  });

  it('has correct placeholders', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const placeholders = screen.getAllByPlaceholderText('Enter language');
    expect(placeholders).toHaveLength(3);
  });

  it('maintains language order when updating', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const languageInputs = screen.getAllByPlaceholderText('Enter language');
    fireEvent.change(languageInputs[1], { target: { value: 'Updated Spanish' } });

    expect(mockOnLanguagesChange).toHaveBeenCalledWith(['English', 'Updated Spanish', 'French']);
  });

  it('handles special characters in language names', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const languageInputs = screen.getAllByPlaceholderText('Enter language');
    fireEvent.change(languageInputs[0], { target: { value: 'Español (Spanish)' } });

    expect(mockOnLanguagesChange).toHaveBeenCalledWith(['Español (Spanish)', 'Spanish', 'French']);
  });

  it('handles very long language names', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const languageInputs = screen.getAllByPlaceholderText('Enter language');
    const longLanguageName = 'A'.repeat(100);
    fireEvent.change(languageInputs[0], { target: { value: longLanguageName } });

    expect(mockOnLanguagesChange).toHaveBeenCalledWith([longLanguageName, 'Spanish', 'French']);
  });

  it('handles rapid add/remove operations', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const addButton = screen.getByText('Add Language');
    // Get all buttons and filter for remove buttons (those with X icon)
    const allButtons = screen.getAllByTestId('button');
    const removeButtons = allButtons.filter((button) => button.querySelector('svg'));

    // Rapid operations
    fireEvent.click(addButton);
    fireEvent.click(removeButtons[0]);
    fireEvent.click(addButton);

    expect(mockOnLanguagesChange).toHaveBeenCalledTimes(3);
  });
});
