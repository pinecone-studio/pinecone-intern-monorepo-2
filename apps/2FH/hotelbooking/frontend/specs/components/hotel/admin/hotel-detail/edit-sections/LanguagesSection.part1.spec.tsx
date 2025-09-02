import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { LanguagesSection } from '@/components/admin/hotel-detail/edit-sections/LanguagesSection';

const mockFormData = {
  languages: ['English', 'Spanish', 'French'],
};

const mockHandleInputChange = jest.fn();

describe('LanguagesSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with title', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  it('displays all languages from form data', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    expect(screen.getByDisplayValue('English')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Spanish')).toBeInTheDocument();
    expect(screen.getByDisplayValue('French')).toBeInTheDocument();
  });

  it('handles language input change', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const englishInput = screen.getByDisplayValue('English');
    fireEvent.change(englishInput, { target: { value: 'German' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['German', 'Spanish', 'French']);
  });

  it('handles multiple language input changes', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const englishInput = screen.getByDisplayValue('English');
    const spanishInput = screen.getByDisplayValue('Spanish');

    fireEvent.change(englishInput, { target: { value: 'German' } });
    fireEvent.change(spanishInput, { target: { value: 'Italian' } });

    expect(mockHandleInputChange).toHaveBeenCalledTimes(2);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'languages', ['German', 'Spanish', 'French']);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'languages', ['English', 'Italian', 'French']);
  });

  it('removes language when remove button is clicked', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]); // Remove English

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['Spanish', 'French']);
  });

  it('removes language from specific index', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[1]); // Remove Spanish (index 1)

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['English', 'French']);
  });

  it('adds new language when add button is clicked', () => {
    render(<LanguagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const addButton = screen.getByText('Add Language');
    fireEvent.click(addButton);

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['English', 'Spanish', 'French', '']);
  });

  it('handles empty languages array', () => {
    const emptyFormData = { languages: [] };
    render(<LanguagesSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);

    const addButton = screen.getByText('Add Language');
    fireEvent.click(addButton);

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['']);
  });

  it('handles single language removal', () => {
    const singleLanguageData = { languages: ['English'] };
    render(<LanguagesSection formData={singleLanguageData} handleInputChange={mockHandleInputChange} />);

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    expect(mockHandleInputChange).toHaveBeenCalledWith('languages', []);
  });
});
