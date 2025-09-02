import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { LanguagesSection } from '@/components/admin/add-hotel/LanguagesSection';

const mockLanguages = ['English', 'Spanish', 'French'];
const mockOnLanguagesChange = jest.fn();

describe('LanguagesSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with title and icon', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('renders all existing languages as inputs', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    expect(screen.getByDisplayValue('English')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Spanish')).toBeInTheDocument();
    expect(screen.getByDisplayValue('French')).toBeInTheDocument();
  });

  it('displays add language button', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    expect(screen.getByText('Add Language')).toBeInTheDocument();
  });

  it('handles adding a new language', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const addButton = screen.getByText('Add Language');
    fireEvent.click(addButton);

    expect(mockOnLanguagesChange).toHaveBeenCalledWith([...mockLanguages, '']);
  });

  it('handles removing a language', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    expect(removeButtons).toHaveLength(3); // Should have 3 remove buttons for 3 languages

    fireEvent.click(removeButtons[0]); // Remove first language

    expect(mockOnLanguagesChange).toHaveBeenCalledWith(['Spanish', 'French']);
  });

  it('handles updating a language value', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const languageInputs = screen.getAllByPlaceholderText('Enter language');
    fireEvent.change(languageInputs[1], { target: { value: 'German' } });

    expect(mockOnLanguagesChange).toHaveBeenCalledWith(['English', 'German', 'French']);
  });

  it('does not show remove button when only one language exists', () => {
    render(<LanguagesSection languages={['English']} onLanguagesChange={mockOnLanguagesChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    expect(removeButtons).toHaveLength(0);
  });

  it('handles multiple language additions', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const addButton = screen.getByText('Add Language');

    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(mockOnLanguagesChange).toHaveBeenCalledTimes(2);
    expect(mockOnLanguagesChange).toHaveBeenNthCalledWith(1, [...mockLanguages, '']);
    expect(mockOnLanguagesChange).toHaveBeenNthCalledWith(2, [...mockLanguages, '']);
  });

  it('handles removing multiple languages', () => {
    render(<LanguagesSection languages={mockLanguages} onLanguagesChange={mockOnLanguagesChange} />);

    const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && button.textContent === '');

    fireEvent.click(removeButtons[0]); // Remove first
    fireEvent.click(removeButtons[1]); // Remove second (now first after first removal)

    expect(mockOnLanguagesChange).toHaveBeenCalledTimes(2);
    expect(mockOnLanguagesChange).toHaveBeenNthCalledWith(1, ['Spanish', 'French']);
    expect(mockOnLanguagesChange).toHaveBeenNthCalledWith(2, ['English', 'French']);
  });
});
