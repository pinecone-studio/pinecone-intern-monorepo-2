import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NoMoreProfiles } from '../components/swipe/NoMoreProfiles';

describe('NoMoreProfiles', () => {
  const mockSetCurrentIndex = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title correctly', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    expect(screen.getByText('No more profiles!')).toBeInTheDocument();
  });

  it('renders start over button correctly', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const startOverButton = screen.getByRole('button', { name: 'Start Over' });
    expect(startOverButton).toBeInTheDocument();
  });

  it('applies correct button styling', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const startOverButton = screen.getByRole('button', { name: 'Start Over' });
    expect(startOverButton).toHaveClass('bg-red-500', 'text-white', 'px-6', 'py-3', 'rounded-full', 'font-semibold', 'hover:bg-red-600', 'transition-colors');
  });

  it('applies correct container styling', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const container = screen.getByText('No more profiles!').closest('div');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'w-full');
  });

  it('applies correct text container styling', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const textContainer = screen.getByText('No more profiles!').closest('div');
    expect(textContainer).toHaveClass('text-center');
  });

  it('applies correct title styling', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const title = screen.getByText('No more profiles!');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-800', 'mb-4');
  });

  it('calls setCurrentIndex with 0 when start over button is clicked', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const startOverButton = screen.getByRole('button', { name: 'Start Over' });
    fireEvent.click(startOverButton);
    
    expect(mockSetCurrentIndex).toHaveBeenCalledWith(0);
  });

  it('calls setCurrentIndex only once when button is clicked', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const startOverButton = screen.getByRole('button', { name: 'Start Over' });
    fireEvent.click(startOverButton);
    
    expect(mockSetCurrentIndex).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing', () => {
    expect(() => render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />)).not.toThrow();
  });

  it('maintains consistent layout structure', () => {
    const { container } = render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const mainContainer = container.firstChild as HTMLElement;
    const textContainer = mainContainer?.firstChild as HTMLElement;
    const title = textContainer?.firstChild as HTMLElement;
    const button = textContainer?.lastChild as HTMLElement;
    
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'w-full');
    expect(textContainer).toHaveClass('text-center');
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-800', 'mb-4');
    expect(button).toHaveClass('bg-red-500', 'text-white', 'px-6', 'py-3', 'rounded-full', 'font-semibold', 'hover:bg-red-600', 'transition-colors');
  });

  it('handles multiple button clicks correctly', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const startOverButton = screen.getByRole('button', { name: 'Start Over' });
    
    fireEvent.click(startOverButton);
    fireEvent.click(startOverButton);
    fireEvent.click(startOverButton);
    
    expect(mockSetCurrentIndex).toHaveBeenCalledTimes(3);
    expect(mockSetCurrentIndex).toHaveBeenNthCalledWith(1, 0);
    expect(mockSetCurrentIndex).toHaveBeenNthCalledWith(2, 0);
    expect(mockSetCurrentIndex).toHaveBeenNthCalledWith(3, 0);
  });

  it('has correct button accessibility', () => {
    render(<NoMoreProfiles setCurrentIndex={mockSetCurrentIndex} />);
    
    const startOverButton = screen.getByRole('button', { name: 'Start Over' });
    expect(startOverButton).toBeEnabled();
    expect(startOverButton).toHaveAttribute('type', 'button');
  });
});
