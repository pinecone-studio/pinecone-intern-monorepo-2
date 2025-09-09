// __tests__/ProfileForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileForm from '@/components/update-profile/ProfileForm';
import { toast } from 'sonner';

// Mock toast
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock Apollo hook
const mockUpdateUser = jest.fn();
jest.mock('@/generated', () => ({
  useUpdateUserMutationMutation: () => [mockUpdateUser],
}));

describe('ProfileForm', () => {
  const user = {
    _id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial values', () => {
    render(<ProfileForm user={user} />);
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
  });

  it('calls toast.success on successful update', async () => {
    mockUpdateUser.mockResolvedValueOnce({ data: { updateUser: { _id: '123' } } });

    render(<ProfileForm user={user} />);
    fireEvent.submit(screen.getByTestId('profile-form'));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Profile updated!', { id: 'profile-toast' }));
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

    // Assert the formData state changed (handleChange was called)
    expect(firstNameInput).toHaveValue('Jane');
    expect(lastNameInput).toHaveValue('Smith');
    expect(emailInput).toHaveValue('jane@example.com');
    expect(dobInput).toHaveValue('2000-02-02');
  });

  it('calls toast.error when user ID is missing', async () => {
    render(<ProfileForm user={null} />); // user._id is undefined
    fireEvent.submit(screen.getByTestId('profile-form'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('User not found', { id: 'profile-toast' }));
  });

  it('calls toast.error on mutation failure', async () => {
    mockUpdateUser.mockRejectedValueOnce(new Error('Network error'));

    render(<ProfileForm user={user} />);
    fireEvent.submit(screen.getByTestId('profile-form'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to update profile', { id: 'profile-toast' }));
  });
});
