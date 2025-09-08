/* eslint-disable max-lines */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TinderProfile } from '../../../../src/components/profile/profile-settings/TinderProfile';
import '@testing-library/jest-dom';

// --- Mock child components ---
jest.mock('../../../../src/components/profile/profile-settings/TinderHeader', () => ({
  TinderHeader: () => <div data-testid="tinder-header">TinderHeader</div>
}));

jest.mock('../../../../src/components/profile/profile-settings/TinderNavigation', () => ({
  TinderNavigation: ({ activeSection, onSectionChange }: any) => (
    <div data-testid="tinder-navigation">
      <button onClick={() => onSectionChange('profile')} data-testid="profile-tab" />
      <button onClick={() => onSectionChange('images')} data-testid="images-tab" />
      <span data-testid="active-section">{activeSection}</span>
    </div>
  )
}));

jest.mock('../../../../src/components/profile/profile-settings/ProfileSection', () => ({
  ProfileSection: ({ onSuccess, profileData, onProfileDataChange }: any) => (
    <div data-testid="profile-section">
      <span data-testid="profile-name">{profileData.name}</span>
      <span data-testid="profile-email">{profileData.email}</span>
      <button onClick={() => onSuccess('Profile Updated Successfully')} data-testid="update-profile" />
      <button onClick={() => onProfileDataChange({ ...profileData, name: 'Updated Name' })} data-testid="change-profile-data" />
    </div>
  )
}));

jest.mock('../../../../src/components/profile/profile-settings/ImagesSection', () => ({
  ImagesSection: ({ onSuccess }: any) => (
    <div data-testid="images-section">
      <button onClick={() => onSuccess('Images Updated Successfully')} data-testid="update-images" />
    </div>
  )
}));

jest.mock('../../../../src/components/profile/profile-settings/Notification', () => ({
  Notification: ({ message, onClose }: any) => (
    <div data-testid="notification">
      <span data-testid="notification-message">{message}</span>
      <button onClick={onClose} data-testid="close-notification" />
    </div>
  )
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} data-testid="tinder-logo" />
  )
}));

// --- Helpers ---
const setup = () => render(<TinderProfile />);

describe('TinderProfile', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders all main components with initial data', () => {
    setup();
    expect(screen.getByTestId('tinder-header')).toBeTruthy();
    expect(screen.getByTestId('tinder-navigation')).toBeTruthy();
    expect(screen.getByTestId('profile-section')).toBeTruthy();
    expect(screen.getByText('Hi, Elon')).toBeTruthy();
    expect(screen.getByText('Musk@pinecone.mn')).toBeTruthy();
    expect(screen.getByTestId('active-section').textContent).toBe('profile');
    const logo = screen.getByTestId('tinder-logo');
    expect(logo).toHaveAttribute('src', '/tindalogos.svg');
  });

  test('switches between profile and images sections', async () => {
    setup();
    expect(screen.queryByTestId('images-section')).toBeFalsy();
    await userEvent.click(screen.getByTestId('images-tab'));
    expect(screen.getByTestId('images-section')).toBeTruthy();
    expect(screen.queryByTestId('profile-section')).toBeFalsy();
    await userEvent.click(screen.getByTestId('profile-tab'));
    expect(screen.getByTestId('profile-section')).toBeTruthy();
  });

  test('shows notifications from profile and images sections', async () => {
    setup();
    await userEvent.click(screen.getByTestId('update-profile'));
    expect(screen.getByTestId('notification-message').textContent).toBe('Profile Updated Successfully');
    await userEvent.click(screen.getByTestId('close-notification'));
    expect(screen.queryByTestId('notification')).toBeFalsy();

    await userEvent.click(screen.getByTestId('images-tab'));
    await userEvent.click(screen.getByTestId('update-images'));
    expect(screen.getByTestId('notification-message').textContent).toBe('Images Updated Successfully');
  });

  test('updates profile greeting when profile data changes', async () => {
    setup();
    expect(screen.getByText('Hi, Elon')).toBeTruthy();
    await userEvent.click(screen.getByTestId('change-profile-data'));
    expect(screen.getByText('Hi, Updated Name')).toBeTruthy();
  });

  test('notification auto-hide works', async () => {
    setup();
    // Trigger notification
    await userEvent.click(screen.getByTestId('update-profile'));
    expect(screen.getByTestId('notification')).toBeInTheDocument();

    // Wait for notification to disappear
    await waitFor(
      () => {
        expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
      },
      { timeout: 5000 } // match your component's auto-hide delay
    );
  });
});
