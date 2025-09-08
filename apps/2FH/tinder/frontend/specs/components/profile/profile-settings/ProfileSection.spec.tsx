/* eslint-disable max-lines */
import { fireEvent, render, screen } from '@testing-library/react';
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

  test('renders personal info section and initial data', () => {
    setup();
    expect(screen.getByText('Personal Information')).toBeTruthy();
    expect(screen.getByText('This is how others will see you on the site.')).toBeTruthy();

    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('John Doe');
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('john@example.com');
    expect((screen.getByLabelText('Date of birth') as HTMLInputElement).value).toBe('1990-01-01');
    expect((screen.getByLabelText('Gender Preferences:') as HTMLSelectElement).value).toBe('Both');
    expect((screen.getByLabelText('Bio') as HTMLTextAreaElement).value).toBe('Lorem ipsum');
    expect((screen.getByLabelText('Profession') as HTMLInputElement).value).toBe('Engineer');
    expect((screen.getByLabelText('School/Work') as HTMLInputElement).value).toBe('Tech University');

    mockProfileData.interests.forEach((interest) => {
      expect(screen.getByText(interest)).toBeTruthy();
    });
    expect(screen.getByText('You can select up to a maximum of 10 interests.')).toBeTruthy();
    expect(screen.getByText('Your date of birth is used to calculate your age.')).toBeTruthy();
  });

  test('updates name input and calls onProfileDataChange', async () => {
    setup();
    const nameInput = screen.getByLabelText('Name');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Doe');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      name: 'Jane Doe',
    });
  });

  test('updates bio input and calls onProfileDataChange', async () => {
    setup();
    const bioTextarea = screen.getByLabelText('Bio');
    await userEvent.clear(bioTextarea);
    await userEvent.type(bioTextarea, 'New bio');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      bio: 'New bio',
    });
  });

  test('updates profession input and calls onProfileDataChange', async () => {
    setup();
    const professionInput = screen.getByTestId('profession-input');
    await userEvent.clear(professionInput);
    await userEvent.type(professionInput, 'Designer');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      profession: 'Designer',
    });
  });

  test('updates school/work input and calls onProfileDataChange', async () => {
    setup();
    const schoolInput = screen.getByTestId('school-work-input');
    await userEvent.clear(schoolInput);
    await userEvent.type(schoolInput, 'New University');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      schoolWork: 'New University',
    });
  });

  test('updates select input and calls onProfileDataChange', async () => {
    setup();
    const select = screen.getByLabelText('Gender Preferences:');
    await userEvent.selectOptions(select, 'Male');
    expect(mockOnProfileDataChange).toHaveBeenCalledWith({
      ...mockProfileData,
      genderPreferences: 'Male',
    });
  });

  test('handles interest toggling and form submission', async () => {
    setup();
    const readingButton = screen.getByText('Reading');
    await userEvent.click(readingButton);
    expect(readingButton.className).toContain('bg-red-500');
    await userEvent.click(readingButton);
    expect(readingButton.className).toContain('bg-gray-200');

    const gamingButton = screen.getByText('Gaming');
    await userEvent.click(gamingButton);

    const submitButton = screen.getByText('Update profile');
    await userEvent.click(submitButton);
    expect(mockConsoleLog).toHaveBeenCalledWith('Profile data:', {
      ...mockProfileData,
      selectedInterests: ['Gaming'],
    });
    expect(mockOnSuccess).toHaveBeenCalledWith('Profile Updated Successfully');
  });

  test('renders form structure and validates email/date inputs', () => {
    const { getByTestId } = render(
      <ProfileSection
        onSuccess={mockOnSuccess}
        profileData={mockProfileData}
        onProfileDataChange={mockOnProfileDataChange}
      />
    );

    const form = screen.getByDisplayValue('John Doe').closest('form');
    expect(form).toBeTruthy();
    expect(form?.className).toContain('space-y-5');

    const dateButton = screen.getByLabelText('Date of birth').parentElement?.querySelector('button');
    expect(dateButton).toBeTruthy();
    fireEvent.click(dateButton!);
    expect(dateButton?.className).toContain('absolute right-3');

    const emailInput = getByTestId('email-input') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const dateInput = getByTestId('date-of-birth-input') as HTMLInputElement;
    expect(dateInput.hasAttribute('required')).toBe(true);
    fireEvent.change(dateInput, { target: { value: '1995-05-05' } });
    expect(dateInput.value).toBe('1995-05-05');
  });
});
