import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UpdateSettings from '@/components/userprofile/UpdateSettings';

describe('UpdateSettings', () => {
  describe('Rendering', () => {
    it('should render the main container', () => {
      render(<UpdateSettings />);
      
      expect(screen.getByText('Security & Settings')).toBeInTheDocument();
      expect(screen.getByText('Keep your account safe with a secure password')).toBeInTheDocument();
    });

    it('should render the main heading and description', () => {
      render(<UpdateSettings />);
      
      expect(screen.getByText('Security & Settings')).toBeInTheDocument();
      expect(screen.getByText('Keep your account safe with a secure password')).toBeInTheDocument();
    });

    it('should render email card with correct information', () => {
      render(<UpdateSettings />);
      
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('n.shagai@pinecone.mn')).toBeInTheDocument();
    });

    it('should render change password card', () => {
      render(<UpdateSettings />);
      
      expect(screen.getByText('Change password')).toBeInTheDocument();
    });

    it('should render email icon in email card', () => {
      render(<UpdateSettings />);
      
      // Check for SVG icon (email icon) - look for the email path
      const svgElements = document.querySelectorAll('svg');
      const emailSvg = Array.from(svgElements).find(svg => 
        svg.querySelector('path[d*="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"]')
      );
      expect(emailSvg).toBeInTheDocument();
    });

    it('should render key icon in change password card', () => {
      render(<UpdateSettings />);
      
      // Check for SVG icon (key icon) - look for the key path
      const svgElements = document.querySelectorAll('svg');
      const keySvg = Array.from(svgElements).find(svg => 
        svg.querySelector('path[d*="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"]')
      );
      expect(keySvg).toBeInTheDocument();
    });

    it('should render arrow icon in change password card', () => {
      render(<UpdateSettings />);
      
      // Check for SVG icon (arrow icon) - look for the arrow path
      const svgElements = document.querySelectorAll('svg');
      const arrowSvg = Array.from(svgElements).find(svg => 
        svg.querySelector('path[d*="M9 5l7 7-7 7"]')
      );
      expect(arrowSvg).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have proper grid layout', () => {
      render(<UpdateSettings />);
      
      // Find the grid container by looking for the div with grid classes
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have proper spacing for main content', () => {
      render(<UpdateSettings />);
      
      const mainContent = screen.getByText('Security & Settings').closest('div');
      expect(mainContent).toHaveClass('mb-8');
    });

    it('should have proper padding for main container', () => {
      render(<UpdateSettings />);
      
      const mainContainer = screen.getByText('Security & Settings').closest('div')?.parentElement;
      expect(mainContainer).toHaveClass('p-8');
    });

    it('should have proper max width for main container', () => {
      render(<UpdateSettings />);
      
      const mainContainer = screen.getByText('Security & Settings').closest('div')?.parentElement;
      expect(mainContainer).toHaveClass('max-w-4xl');
    });

    it('should center the main container', () => {
      render(<UpdateSettings />);
      
      const mainContainer = screen.getByText('Security & Settings').closest('div')?.parentElement;
      expect(mainContainer).toHaveClass('mx-auto');
    });
  });

  describe('Email Card', () => {
    it('should have blue styling for email card', () => {
      render(<UpdateSettings />);
      
      const emailCard = screen.getByText('Email').closest('div')?.parentElement?.parentElement;
      expect(emailCard).toHaveClass('bg-blue-50', 'border-blue-200');
    });

    it('should have proper padding for email card', () => {
      render(<UpdateSettings />);
      
      const emailCard = screen.getByText('Email').closest('div')?.parentElement?.parentElement;
      expect(emailCard).toHaveClass('p-6');
    });

    it('should have rounded corners for email card', () => {
      render(<UpdateSettings />);
      
      const emailCard = screen.getByText('Email').closest('div')?.parentElement?.parentElement;
      expect(emailCard).toHaveClass('rounded-lg');
    });

    it('should have border for email card', () => {
      render(<UpdateSettings />);
      
      const emailCard = screen.getByText('Email').closest('div')?.parentElement?.parentElement;
      expect(emailCard).toHaveClass('border');
    });

    it('should display email label in uppercase', () => {
      render(<UpdateSettings />);
      
      const emailLabel = screen.getByText('Email');
      expect(emailLabel).toHaveClass('uppercase', 'tracking-wide');
    });

    it('should display email address in large text', () => {
      render(<UpdateSettings />);
      
      const emailAddress = screen.getByText('n.shagai@pinecone.mn');
      expect(emailAddress).toHaveClass('text-lg');
    });

    it('should have proper icon styling in email card', () => {
      render(<UpdateSettings />);
      
      const emailCard = screen.getByText('Email').closest('div')?.parentElement;
      const iconContainer = emailCard?.querySelector('.w-12.h-12.bg-blue-200');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Change Password Card', () => {
    it('should have green styling for change password card', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement?.parentElement;
      expect(passwordCard).toHaveClass('bg-green-50', 'border-green-200');
    });

    it('should have hover effect for change password card', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement?.parentElement;
      expect(passwordCard).toHaveClass('hover:bg-green-100', 'transition-colors');
    });

    it('should be clickable (cursor pointer)', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement?.parentElement;
      expect(passwordCard).toHaveClass('cursor-pointer');
    });

    it('should have proper padding for change password card', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement?.parentElement;
      expect(passwordCard).toHaveClass('p-6');
    });

    it('should have rounded corners for change password card', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement?.parentElement;
      expect(passwordCard).toHaveClass('rounded-lg');
    });

    it('should have border for change password card', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement?.parentElement;
      expect(passwordCard).toHaveClass('border');
    });

    it('should display change password text in large size', () => {
      render(<UpdateSettings />);
      
      const changePasswordText = screen.getByText('Change password');
      expect(changePasswordText).toHaveClass('text-lg');
    });

    it('should have proper icon styling in change password card', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement;
      const iconContainer = passwordCard?.querySelector('.w-12.h-12.bg-green-200');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should have arrow icon container', () => {
      render(<UpdateSettings />);
      
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement;
      const arrowContainer = passwordCard?.querySelector('.w-8.h-8.bg-green-200');
      expect(arrowContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<UpdateSettings />);
      
      const heading = screen.getByText('Security & Settings');
      expect(heading.tagName).toBe('H1');
    });

    it('should have proper text hierarchy', () => {
      render(<UpdateSettings />);
      
      const description = screen.getByText('Keep your account safe with a secure password');
      expect(description).toBeInTheDocument();
    });

    it('should have proper card structure', () => {
      render(<UpdateSettings />);
      
      const emailCard = screen.getByText('Email').closest('div')?.parentElement;
      const passwordCard = screen.getByText('Change password').closest('div')?.parentElement;
      
      expect(emailCard).toBeInTheDocument();
      expect(passwordCard).toBeInTheDocument();
    });

    it('should have proper icon structure', () => {
      render(<UpdateSettings />);
      
      const svgElements = document.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe('Component Structure', () => {
    it('should have proper flex layout for card content', () => {
      render(<UpdateSettings />);
      
      const flexContainers = document.querySelectorAll('.flex.items-center.space-x-4');
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    it('should have proper spacing between card elements', () => {
      render(<UpdateSettings />);
      
      const flexContainers = document.querySelectorAll('.flex.items-center.space-x-4');
      expect(flexContainers.length).toBeGreaterThan(0);
    });

    it('should have proper icon container sizing', () => {
      render(<UpdateSettings />);
      
      const iconContainers = document.querySelectorAll('.w-12.h-12');
      expect(iconContainers.length).toBeGreaterThan(0);
    });

    it('should have proper text container (flex-1)', () => {
      render(<UpdateSettings />);
      
      const textContainers = document.querySelectorAll('.flex-1');
      expect(textContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      render(<UpdateSettings />);
      
      // Find the grid container by looking for the div with grid classes
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('should stack cards vertically on mobile', () => {
      render(<UpdateSettings />);
      
      // Find the grid container by looking for the div with grid classes
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
      expect(gridContainer).toHaveClass('grid-cols-1');
    });

    it('should display cards side by side on medium screens and up', () => {
      render(<UpdateSettings />);
      
      // Find the grid container by looking for the div with grid classes
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
      expect(gridContainer).toHaveClass('md:grid-cols-2');
    });
  });
});
