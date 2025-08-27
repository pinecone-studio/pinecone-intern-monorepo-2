import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from '../../../src/components/auth/ErrorDisplay';
import { AuthError } from '../../../src/components/auth/types';

describe('ErrorDisplay Component', () => {
  it('should render nothing when error is null', () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message when error is provided', () => {
    const error: AuthError = {
      message: 'Test error message'
    };
    
    render(<ErrorDisplay error={error} />);
    
    expect(screen.getByText('Test error message')).toBeTruthy();
  });

  it('should render error with proper styling', () => {
    const error: AuthError = {
      message: 'Test error message'
    };
    
    const { container } = render(<ErrorDisplay error={error} />);
    
    const errorDiv = container.querySelector('.bg-red-50');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv).toHaveClass('rounded-lg', 'p-4', 'border', 'border-red-200');
  });

  it('should render error icon', () => {
    const error: AuthError = {
      message: 'Test error message'
    };
    
    const { container } = render(<ErrorDisplay error={error} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg).toHaveClass('h-5', 'w-5', 'text-red-400');
  });

  it('should use getErrorMessage for displaying error code messages', () => {
    const error: AuthError = {
      message: 'Generic error',
      code: 'USERNAME_EXISTS'
    };
    
    render(<ErrorDisplay error={error} />);
    
    expect(screen.getByText('Username already exists. Please choose a different one.')).toBeTruthy();
  });

  it('should handle error without code', () => {
    const error: AuthError = {
      message: 'Simple error message'
    };
    
    render(<ErrorDisplay error={error} />);
    
    expect(screen.getByText('Simple error message')).toBeTruthy();
  });

  it('should have proper error text styling', () => {
    const error: AuthError = {
      message: 'Test error message'
    };
    
    render(<ErrorDisplay error={error} />);
    
    const errorText = screen.getByText('Test error message');
    expect(errorText).toHaveClass('text-sm', 'font-medium', 'text-red-800');
  });

  it('should render complete component structure', () => {
    const error: AuthError = {
      message: 'Test error message'
    };
    
    const { container } = render(<ErrorDisplay error={error} />);
    
    const mainDiv = container.querySelector('.bg-red-50');
    expect(mainDiv).toBeTruthy();
    
    const flexDiv = container.querySelector('.flex');
    expect(flexDiv).toBeTruthy();
    
    const iconContainer = container.querySelector('.flex-shrink-0');
    expect(iconContainer).toBeTruthy();
    
    const messageContainer = container.querySelector('.ml-3');
    expect(messageContainer).toBeTruthy();
  });
});
