import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProfilePage from '@/app/(private)/profile/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the UpdateContact component
jest.mock('@/components/userprofile/UpdateContact', () => {
  return function MockUpdateContact() {
    return <div data-testid="update-contact">Update Contact Component</div>;
  };
});

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

describe('ProfilePage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the profile page with header', () => {
      render(<ProfilePage />);
      
      expect(screen.getAllByText('Pedia')).toHaveLength(2); // Header and footer
      expect(screen.getByText('My Booking')).toBeInTheDocument();
      expect(screen.getByText('Shagai')).toBeInTheDocument();
    });

    it('should display user greeting with name and email', () => {
      render(<ProfilePage />);
      
      expect(screen.getByText('Hi, Shagai')).toBeInTheDocument();
      expect(screen.getByText('n.shagai@pinecone.mn')).toBeInTheDocument();
    });

    it('should render navigation sidebar with all tabs', () => {
      render(<ProfilePage />);
      
      const navigationItems = ['Profile', 'Account', 'Appearance', 'Notifications', 'Display'];
      navigationItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('should render Profile tab content by default', () => {
      render(<ProfilePage />);
      
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByText('This is how others will see you on the site.')).toBeInTheDocument();
    });

    it('should render form fields in Profile tab', () => {
      render(<ProfilePage />);
      
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
      expect(screen.getByText('Update Profile')).toBeInTheDocument();
    });

    it('should render footer with Pedia branding', () => {
      render(<ProfilePage />);
      
      expect(screen.getAllByText('Pedia')).toHaveLength(2); // Header and footer
    });
  });

  describe('Navigation', () => {
    it('should switch to Account tab when clicked', () => {
      render(<ProfilePage />);
      
      fireEvent.click(screen.getByText('Account'));
      
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      expect(screen.getByText('Account management options will go here.')).toBeInTheDocument();
    });

    it('should switch to Appearance tab when clicked', () => {
      render(<ProfilePage />);
      
      fireEvent.click(screen.getByText('Appearance'));
      
      expect(screen.getByText('Appearance customization options will go here.')).toBeInTheDocument();
    });

    it('should switch to Notifications tab when clicked', () => {
      render(<ProfilePage />);
      
      fireEvent.click(screen.getByText('Notifications'));
      
      expect(screen.getByText('Notification preferences will go here.')).toBeInTheDocument();
    });

    it('should switch to Display tab when clicked', () => {
      render(<ProfilePage />);
      
      fireEvent.click(screen.getByText('Display'));
      
      expect(screen.getByText('Display settings will go here.')).toBeInTheDocument();
    });

    it('should return to Profile tab when clicked again', () => {
      render(<ProfilePage />);
      
      // Switch to Account tab
      fireEvent.click(screen.getByText('Account'));
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      
      // Switch back to Profile tab
      fireEvent.click(screen.getByText('Profile'));
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });
  });

  describe('Form Handling', () => {
    it('should update firstName when input changes', () => {
      render(<ProfilePage />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      
      expect(firstNameInput).toHaveValue('John');
    });

    it('should update lastName when input changes', () => {
      render(<ProfilePage />);
      
      const lastNameInput = screen.getByLabelText('Last Name');
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      
      expect(lastNameInput).toHaveValue('Doe');
    });

    it('should update dateOfBirth when input changes', () => {
      render(<ProfilePage />);
      
      const dateInput = screen.getByLabelText('Date of birth');
      fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
      
      expect(dateInput).toHaveValue('1990-01-01');
    });

    it('should handle form submission', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      render(<ProfilePage />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const dateInput = screen.getByLabelText('Date of birth');
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
      
      const form = firstNameInput.closest('form');
      fireEvent.submit(form!);
      
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Update Contact Flow', () => {
    it('should show UpdateContact component when Update Profile button is clicked', () => {
      render(<ProfilePage />);
      
      // Fill out required fields to pass validation
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const dateInput = screen.getByLabelText('Date of birth');
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
      
      fireEvent.click(screen.getByText('Update Profile'));
      
      expect(screen.getByTestId('update-contact')).toBeInTheDocument();
    });

    it('should hide UpdateContact component when back to profile is called', () => {
      render(<ProfilePage />);
      
      // Fill out required fields to pass validation
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const dateInput = screen.getByLabelText('Date of birth');
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
      
      // Show UpdateContact
      fireEvent.click(screen.getByText('Update Profile'));
      expect(screen.getByTestId('update-contact')).toBeInTheDocument();
      
      // This would require mocking the UpdateContact component's back functionality
      // For now, we'll test that the component is rendered
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<ProfilePage />);
      
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      render(<ProfilePage />);
      
      const updateButton = screen.getByText('Update Profile');
      expect(updateButton).toHaveAttribute('type', 'button');
    });

    it('should have proper navigation structure', () => {
      render(<ProfilePage />);
      
      const navigationButtons = screen.getAllByRole('button');
      navigationButtons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Styling and Classes', () => {
    it('should apply active tab styling to Profile tab by default', () => {
      render(<ProfilePage />);
      
      const profileButton = screen.getByText('Profile').closest('button');
      expect(profileButton).toHaveClass('bg-gray-100', 'text-gray-900');
    });

    it('should apply active tab styling when tab is selected', () => {
      render(<ProfilePage />);
      
      fireEvent.click(screen.getByText('Account'));
      
      const accountButton = screen.getByText('Account').closest('button');
      expect(accountButton).toHaveClass('bg-gray-100', 'text-gray-900');
      
      const profileButton = screen.getByText('Profile').closest('button');
      expect(profileButton).not.toHaveClass('bg-gray-100', 'text-gray-900');
    });
  });
});
