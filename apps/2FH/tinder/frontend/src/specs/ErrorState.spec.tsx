import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '../components/swipe/ErrorState';

describe('ErrorState', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true
    });
  });

  it('renders error title correctly', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    expect(screen.getByText('Алдаа гарлаа!')).toBeInTheDocument();
  });

  it('renders error message correctly', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
  });

  it('renders error details correctly', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    expect(screen.getByText('Error details:')).toBeInTheDocument();
    expect(screen.getByText('Profiles error: Error occurred')).toBeInTheDocument();
    expect(screen.getByText('User profile error: No error')).toBeInTheDocument();
    expect(screen.getByText('Network status: Unknown')).toBeInTheDocument();
  });

  it('renders retry button correctly', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const retryButton = screen.getByRole('button', { name: 'Дахин оролдох' });
    expect(retryButton).toBeInTheDocument();
  });

  it('applies correct button styling', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const retryButton = screen.getByRole('button', { name: 'Дахин оролдох' });
    expect(retryButton).toHaveClass('bg-red-500', 'text-white', 'px-6', 'py-3', 'rounded-full', 'font-semibold', 'hover:bg-red-600', 'transition-colors');
  });

  it('applies correct container styling', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const container = screen.getByText('Алдаа гарлаа!').closest('div');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'w-full');
  });

  it('applies correct text container styling', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const textContainer = screen.getByText('Алдаа гарлаа!').closest('div');
    expect(textContainer).toHaveClass('text-center');
  });

  it('applies correct title styling', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const title = screen.getByText('Алдаа гарлаа!');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-800', 'mb-4');
  });

  it('applies correct error message styling', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const errorMessage = screen.getByText('Unknown error occurred');
    expect(errorMessage).toHaveClass('text-gray-600', 'mb-4');
  });

  it('applies correct error details styling', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const errorDetails = screen.getByText('Error details:').closest('div');
    expect(errorDetails).toHaveClass('text-sm', 'text-gray-500', 'mb-4');
  });

  it('calls refetch function when retry button is clicked', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const retryButton = screen.getByRole('button', { name: 'Дахин оролдох' });
    fireEvent.click(retryButton);
    
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('reloads page when retry button is clicked', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const retryButton = screen.getByRole('button', { name: 'Дахин оролдох' });
    fireEvent.click(retryButton);
    
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('calls both refetch and reload when retry button is clicked', () => {
    render(<ErrorState refetch={mockRefetch} />);
    
    const retryButton = screen.getByRole('button', { name: 'Дахин оролдох' });
    fireEvent.click(retryButton);
    
    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing', () => {
    expect(() => render(<ErrorState refetch={mockRefetch} />)).not.toThrow();
  });

  it('maintains consistent layout structure', () => {
    const { container } = render(<ErrorState refetch={mockRefetch} />);
    
    const mainContainer = container.firstChild as HTMLElement;
    const textContainer = mainContainer?.firstChild as HTMLElement;
    const title = textContainer?.firstChild as HTMLElement;
    const errorMessage = title?.nextElementSibling as HTMLElement;
    const errorDetails = errorMessage?.nextElementSibling as HTMLElement;
    const button = textContainer?.lastChild as HTMLElement;
    
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'w-full');
    expect(textContainer).toHaveClass('text-center');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-800', 'mb-4');
    expect(errorMessage).toHaveClass('text-gray-600', 'mb-4');
    expect(errorDetails).toHaveClass('text-sm', 'text-gray-500', 'mb-4');
    expect(button).toHaveClass('bg-red-500', 'text-white', 'px-6', 'py-3', 'rounded-full', 'font-semibold', 'hover:bg-red-600', 'transition-colors');
  });
});
