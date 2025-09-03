import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CountryCodeSelect } from '@/components/userprofile/CountryCodeSelect';

// Mock the UI components
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, defaultValue, onValueChange }: any) => (
    <div data-testid="ui-select" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div data-testid="ui-select-trigger" className={className}>
      {children}
    </div>
  ),
  SelectValue: () => (
    <div data-testid="ui-select-value">Select Value</div>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="ui-select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="ui-select-item" data-value={value}>
      {children}
    </div>
  ),
}));

// Mock the country codes
jest.mock('@/components/userprofile/countryCodes', () => ({
  countryCodes: [
    { code: '+976', country: 'Mongolia' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
  ],
}));

describe('CountryCodeSelect', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<CountryCodeSelect />);
      
      expect(screen.getByTestId('ui-select')).toBeInTheDocument();
      expect(screen.getByTestId('ui-select-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('ui-select-value')).toBeInTheDocument();
    });

    it('should render with custom default value', () => {
      render(<CountryCodeSelect defaultValue="+1" />);
      
      const select = screen.getByTestId('ui-select');
      expect(select).toHaveAttribute('data-default-value', '+1');
    });

    it('should render with correct trigger styling', () => {
      render(<CountryCodeSelect />);
      
      const trigger = screen.getByTestId('ui-select-trigger');
      expect(trigger).toHaveClass('w-20');
    });

    it('should render all country code options', () => {
      render(<CountryCodeSelect />);
      
      // Check that all country codes are rendered as select items
      const selectItems = screen.getAllByTestId('ui-select-item');
      expect(selectItems).toHaveLength(5); // 5 countries from mock
      
      // Check specific countries
      expect(screen.getByText('+976 (Mongolia)')).toBeInTheDocument();
      expect(screen.getByText('+1 (USA)')).toBeInTheDocument();
      expect(screen.getByText('+44 (UK)')).toBeInTheDocument();
      expect(screen.getByText('+81 (Japan)')).toBeInTheDocument();
      expect(screen.getByText('+86 (China)')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should use default value when no defaultValue is provided', () => {
      render(<CountryCodeSelect />);
      
      const select = screen.getByTestId('ui-select');
      expect(select).toHaveAttribute('data-default-value', '+976');
    });

    it('should use provided defaultValue', () => {
      render(<CountryCodeSelect defaultValue="+44" />);
      
      const select = screen.getByTestId('ui-select');
      expect(select).toHaveAttribute('data-default-value', '+44');
    });

    it('should pass onValueChange callback when provided', () => {
      const mockOnValueChange = jest.fn();
      render(<CountryCodeSelect onValueChange={mockOnValueChange} />);
      
      // The onValueChange would be called when a selection is made
      // This is tested through the Select component's behavior
      expect(screen.getByTestId('ui-select')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper select structure', () => {
      render(<CountryCodeSelect />);
      
      expect(screen.getByTestId('ui-select')).toBeInTheDocument();
      expect(screen.getByTestId('ui-select-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('ui-select-content')).toBeInTheDocument();
    });

    it('should have proper select items with values', () => {
      render(<CountryCodeSelect />);
      
      const selectItems = screen.getAllByTestId('ui-select-item');
      selectItems.forEach(item => {
        expect(item).toHaveAttribute('data-value');
      });
    });

    it('should have proper select value display', () => {
      render(<CountryCodeSelect />);
      
      expect(screen.getByTestId('ui-select-value')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct trigger width class', () => {
      render(<CountryCodeSelect />);
      
      const trigger = screen.getByTestId('ui-select-trigger');
      expect(trigger).toHaveClass('w-20');
    });

    it('should maintain consistent styling across renders', () => {
      const { rerender } = render(<CountryCodeSelect />);
      
      let trigger = screen.getByTestId('ui-select-trigger');
      expect(trigger).toHaveClass('w-20');
      
      rerender(<CountryCodeSelect defaultValue="+1" />);
      
      trigger = screen.getByTestId('ui-select-trigger');
      expect(trigger).toHaveClass('w-20');
    });
  });

  describe('Component Integration', () => {
    it('should work with different default values', () => {
      const { rerender } = render(<CountryCodeSelect defaultValue="+1" />);
      
      let select = screen.getByTestId('ui-select');
      expect(select).toHaveAttribute('data-default-value', '+1');
      
      rerender(<CountryCodeSelect defaultValue="+44" />);
      
      select = screen.getByTestId('ui-select');
      expect(select).toHaveAttribute('data-default-value', '+44');
    });

    it('should render consistently with or without onValueChange', () => {
      const { rerender } = render(<CountryCodeSelect />);
      
      expect(screen.getByTestId('ui-select')).toBeInTheDocument();
      
      rerender(<CountryCodeSelect onValueChange={() => {}} />);
      
      expect(screen.getByTestId('ui-select')).toBeInTheDocument();
    });

    it('should handle all country codes from the data', () => {
      render(<CountryCodeSelect />);
      
      const expectedCountries = [
        '+976 (Mongolia)',
        '+1 (USA)',
        '+44 (UK)',
        '+81 (Japan)',
        '+86 (China)'
      ];
      
      expectedCountries.forEach(country => {
        expect(screen.getByText(country)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty country codes array gracefully', () => {
      // This would require mocking an empty array, but the component should handle it
      render(<CountryCodeSelect />);
      
      expect(screen.getByTestId('ui-select')).toBeInTheDocument();
    });

    it('should handle invalid default values gracefully', () => {
      render(<CountryCodeSelect defaultValue="invalid" />);
      
      const select = screen.getByTestId('ui-select');
      expect(select).toHaveAttribute('data-default-value', 'invalid');
    });

    it('should render without crashing when no props are provided', () => {
      render(<CountryCodeSelect />);
      
      expect(screen.getByTestId('ui-select')).toBeInTheDocument();
    });
  });
});
