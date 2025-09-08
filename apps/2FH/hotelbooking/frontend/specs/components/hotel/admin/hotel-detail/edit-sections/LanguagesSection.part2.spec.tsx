import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { LanguagesSection } from '@/components/admin/hotel-detail/edit-sections/LanguagesSection';

describe('LanguagesSection - Part 2', () => {
  const mockFormData = {
    languages: ['English', 'Spanish', 'French'],
  };

  const mockHandleInputChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles multiple language additions', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const addButton = screen.getByText('Add Language');
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(mockHandleInputChange).toHaveBeenCalledTimes(2);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'languages', ['English', 'Spanish', 'French', '']);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'languages', ['English', 'Spanish', 'French', '']);
  });

  it('handles complex language operations', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    // Add a new language
    const addButton = screen.getByText('Add Language');
    fireEvent.click(addButton);

    // Change the first language
    const englishInput = screen.getByDisplayValue('English');
    fireEvent.change(englishInput, { target: { value: 'German' } });

    // Remove the second language
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[1]); // Remove Spanish

    expect(mockHandleInputChange).toHaveBeenCalledTimes(3);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'languages', ['English', 'Spanish', 'French', '']);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'languages', ['German', 'Spanish', 'French']);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(3, 'languages', ['English', 'French']);
  });

  it('renders correct number of remove buttons', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(3);
  });

  it('renders add button with correct text', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const addButton = screen.getByText('Add Language');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute('type', 'button');
  });

  it('renders remove buttons with correct attributes', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const removeButtons = screen.getAllByText('Remove');
    removeButtons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button');
      // The variant attribute is not set on the actual button element
      // The size attribute is not set on the actual button element
    });
  });

  it('renders inputs with correct structure', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);
  });

  it('handles language input with special characters', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const englishInput = screen.getByDisplayValue('English');
    fireEvent.change(englishInput, { target: { value: 'Español' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['Español', 'Spanish', 'French']);
  });

  it('handles language input with numbers', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const englishInput = screen.getByDisplayValue('English');
    fireEvent.change(englishInput, { target: { value: 'English 101' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['English 101', 'Spanish', 'French']);
  });

  it('handles empty language input', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const englishInput = screen.getByDisplayValue('English');
    fireEvent.change(englishInput, { target: { value: '' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['', 'Spanish', 'French']);
  });
});
