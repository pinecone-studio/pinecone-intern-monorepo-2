import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { SearchInput } from '@/components/searchBar/SearchInput';

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});
describe('SearchInput', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders search input with placeholder', () => {
    render(
      <SearchInput
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByPlaceholderText('Search');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });
  it('displays search query value', () => {
    const searchQuery = 'test query';
    render(
      <SearchInput
        searchQuery={searchQuery}
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByDisplayValue(searchQuery);
    expect(input).toBeInTheDocument();
  });
  it('calls onSearchChange when input value changes', async () => {
    const user = userEvent.setup();
    render(
      <SearchInput
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByPlaceholderText('Search');
    await user.type(input, 'new query');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(9); // Called for each character
  });
  it('shows clear button when search query is not empty', () => {
    render(
      <SearchInput
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeInTheDocument();
  });
  it('hides clear button when search query is empty', () => {
    render(
      <SearchInput
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const clearButton = screen.queryByRole('button', { name: 'Clear search' });
    expect(clearButton).not.toBeInTheDocument();
  });
  it('calls onClear when clear button is clicked', () => {
    render(
      <SearchInput
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    fireEvent.click(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
  it('renders search icon', () => {
    render(
      <SearchInput
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });
  it('applies correct CSS classes', () => {
    render(
      <SearchInput
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass(
      'w-full',
      'pl-10',
      'pr-10',
      'py-2',
      'bg-gray-100',
      'rounded-lg',
      'outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'text-sm'
    );
  });
  it('handles multiple input changes', () => {
    render(
      <SearchInput
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.change(input, { target: { value: 'second' } });
    fireEvent.change(input, { target: { value: 'third' } });
    expect(mockOnSearchChange).toHaveBeenCalledTimes(3);
  });
  it('handles empty string input', async () => {
    const user = userEvent.setup();
    render(
      <SearchInput
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByDisplayValue('test');
    await user.clear(input);
    expect(mockOnSearchChange).toHaveBeenCalled();
  });
});
