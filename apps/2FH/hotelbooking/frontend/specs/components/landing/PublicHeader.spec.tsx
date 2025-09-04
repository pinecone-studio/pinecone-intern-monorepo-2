import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PublicHeader } from '../../../src/components/landing-page/PublicHeader';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('PublicHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<PublicHeader />);
      expect(screen.getByTestId('Header-Container')).toBeInTheDocument();
    });

    it('displays logo and navigation buttons', () => {
      render(<PublicHeader />);
      
      expect(screen.getByText('Pedia')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    it('has correct header styling with blue background', () => {
      render(<PublicHeader />);
      
      const headerContainer = screen.getByTestId('Header-Container');
      const innerDiv = headerContainer.querySelector('div');
      expect(innerDiv).toHaveClass('bg-[#013B94]');
    });

    it('has correct layout classes', () => {
      render(<PublicHeader />);
      
      const headerContainer = screen.getByTestId('Header-Container');
      const innerDiv = headerContainer.querySelector('div');
      expect(innerDiv).toHaveClass('flex', 'justify-between', 'w-full', 'pt-5', 'pb-5', 'px-40', 'items-center');
    });
  });

  describe('Navigation', () => {
    it('navigates to home when logo is clicked', () => {
      render(<PublicHeader />);
      
      const logoButton = screen.getByText('Pedia').closest('button');
      fireEvent.click(logoButton!);
      
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('navigates to signup when Register button is clicked', () => {
      render(<PublicHeader />);
      
      const registerButton = screen.getByText('Register');
      fireEvent.click(registerButton);
      
      expect(mockPush).toHaveBeenCalledWith('/signup');
    });

    it('navigates to login when Sign in button is clicked', () => {
      render(<PublicHeader />);
      
      const signInButton = screen.getByText('Sign in');
      fireEvent.click(signInButton);
      
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('Component Structure', () => {
    it('maintains proper nesting of elements', () => {
      render(<PublicHeader />);
      
      const headerContainer = screen.getByTestId('Header-Container');
      const logoIcon = headerContainer.querySelector('.p-3.bg-white.rounded-full');
      const logoText = screen.getByText('Pedia');
      const registerButton = screen.getByText('Register');
      const signInButton = screen.getByText('Sign in');
      
      expect(logoIcon).toBeInTheDocument();
      expect(logoText).toBeInTheDocument();
      expect(registerButton).toBeInTheDocument();
      expect(signInButton).toBeInTheDocument();
    });
  });
});
