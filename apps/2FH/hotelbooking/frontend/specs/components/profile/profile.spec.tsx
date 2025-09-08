// __tests__/ProfileForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileForm from '@/components/update-profile/ProfileForm';
import { toast } from 'sonner';

// Mock the toast
jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}));

describe('ProfileForm', () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-01-01',
  };

  it('renders correctly with initial user data', () => {
    render(<ProfileForm user={user} />);

    expect(screen.getByTestId('profile-form-container')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
  });

  it('updates input fields when user types', () => {
    render(<ProfileForm user={user} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const dobInput = screen.getByLabelText(/date of birth/i);

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(dobInput, { target: { value: '2000-02-02' } });

    expect(firstNameInput).toHaveValue('Jane');
    expect(lastNameInput).toHaveValue('Smith');
    expect(emailInput).toHaveValue('jane@example.com');
    expect(dobInput).toHaveValue('2000-02-02');
  });

  it('calls toast.success on form submit', () => {
    render(<ProfileForm user={user} />);

    const form = screen.getByTestId('profile-form');
    fireEvent.submit(form);

    expect(toast.success).toHaveBeenCalledWith('Profile updated!', { id: 'profile-toast' });
  });

  it('renders correctly when user is null', () => {
    render(<ProfileForm user={null} />);

    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('');
  });
});
