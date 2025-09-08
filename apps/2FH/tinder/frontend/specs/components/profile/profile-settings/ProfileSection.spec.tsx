/* eslint-disable max-lines */
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileSection } from '../../../../src/components/profile/profile-settings/ProfileSection';

const mockProfileData = {
  name: 'John Doe',
  email: 'john@example.com',
  dateOfBirth: '1990-01-01',
  genderPreferences: 'Both',
  bio: 'Lorem ipsum',
  profession: 'Engineer',
  schoolWork: 'Tech University',
  interests: ['Reading', 'Gaming', 'Travel'],
};

const mockOnSuccess = jest.fn();
const mockOnProfileDataChange = jest.fn();
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

const setup = () => {
  render(
    <ProfileSection
      onSuccess={mockOnSuccess}
      profileData={mockProfileData}
      onProfileDataChange={mockOnProfileDataChange}
    />
  );
};

describe('ProfileSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders personal information section', () => {
    setup();
    expect(screen.getByText('Personal Information')).toBeTruthy();
    expect(screen.getByText('This is how others will see you on the site.')).toBeTruthy();
  });

  test('renders form inputs with initial profile data', () => {
    setup();
    expect(screen.getByLabelText('Name').value).toBe('John Doe');
    expect(screen.getByLabelText('Email').value).toBe('john@example.com');
    expect(screen.getByLabelText('Date of birth').value).toBe('1990-01-01');
    expect(screen.getByLabelText('Gender Preferences:').value).toBe('Both');
    expect(screen.getByLabelText('Bio').value).toBe('Lorem ipsum');
    expect(screen.getByLabelText('Profession').value).toBe('Engineer');
    expect(screen.getByLabelText('School/Work').value).toBe('Tech University');
  });

  test('updates form data and calls onProfileDataChange on input change', async () => {
    setup();
    const nameInput = screen.getByLabelText('Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Doe');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      name: 'Jane Doe',
    });
  });

  test('updates gender preferences and calls onProfileDataChange', async () => {
    setup();
    const select = screen.getByLabelText('Gender Preferences:');
    await userEvent.selectOptions(select, 'Male');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      genderPreferences: 'Male',
    });
  });

  test('toggles interest on and off', async () => {
    setup();
    const readingButton = screen.getByText('Reading');
    await userEvent.click(readingButton);
    expect(readingButton.className).toContain('bg-red-500 text-white');
    await userEvent.click(readingButton);
    expect(readingButton.className).toContain('bg-gray-200 text-gray-700');
  });

  test('handles form submission, logs data, and calls onSuccess', async () => {
    setup();
    const submitButton = screen.getByText('Update profile');
    await userEvent.click(submitButton);
    expect(mockConsoleLog).toHaveBeenCalledWith('Profile data:', {
      ...mockProfileData,
      selectedInterests: [],
    });
    expect(mockOnSuccess).toHaveBeenCalledWith('Profile Updated Successfully');
  });

  test('renders interest buttons and helper text', () => {
    setup();
    mockProfileData.interests.forEach((interest) => {
      expect(screen.getByText(interest)).toBeTruthy();
    });
    expect(screen.getByText('You can select up to a maximum of 10 interests.')).toBeTruthy();
  });

  test('renders date of birth button and helper text', () => {
    setup();
    const dateButton = within(screen.getByLabelText('Date of birth').parentElement).getByRole('button');
    expect(dateButton).toBeTruthy();
    expect(screen.getByText('Your date of birth is used to calculate your age.')).toBeTruthy();
  });

  test('updates bio and calls onProfileDataChange', async () => {
    setup();
    const bioTextarea = screen.getByLabelText('Bio');
    await userEvent.clear(bioTextarea);
    await userEvent.type(bioTextarea, 'New bio');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      bio: 'New bio',
    });
  });

  test('updates profession and calls onProfileDataChange', async () => {
    setup();
    const professionInput = screen.getByLabelText('Profession');
    await userEvent.clear(professionInput);
    await userEvent.type(professionInput, 'Designer');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      profession: 'Designer',
    });
  });

  test('updates school/work and calls onProfileDataChange', async () => {
    setup();
    const schoolWorkInput = screen.getByLabelText('School/Work');
    await userEvent.clear(schoolWorkInput);
    await userEvent.type(schoolWorkInput, 'New School');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      schoolWork: 'New School',
    });
  });

  test('renders calendar button with correct classes', () => {
    setup();
    const dateButton = within(screen.getByLabelText('Date of birth').parentElement).getByRole('button');
    expect(dateButton.className).toContain('absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500');
  });

  test('renders form element', () => {
    setup();
    const form = screen.getByDisplayValue('John Doe').closest('form');
    expect(form).toBeTruthy();
    expect(form.className).toContain('space-y-5');
  });
});
