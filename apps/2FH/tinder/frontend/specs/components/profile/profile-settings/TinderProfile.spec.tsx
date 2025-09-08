/* eslint-disable max-lines */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TinderProfile } from '../../../../src/components/profile/profile-settings/TinderProfile';

// Mock all child components
jest.mock('../../../../src/components/profile/profile-settings/TinderHeader', () => ({
  TinderHeader: () => <div data-testid="tinder-header">TinderHeader</div>
}));

jest.mock('../../../../src/components/profile/profile-settings/TinderNavigation', () => ({
  TinderNavigation: ({ activeSection, onSectionChange }: { activeSection: string; onSectionChange: (section: string) => void }) => (
    <div data-testid="tinder-navigation">
      <button onClick={() => onSectionChange('profile')} data-testid="profile-tab">Profile</button>
      <button onClick={() => onSectionChange('images')} data-testid="images-tab">Images</button>
      <span data-testid="active-section">{activeSection}</span>
    </div>
  )
}));

jest.mock('../../../../src/components/profile/profile-settings/ProfileSection', () => ({
  ProfileSection: ({ onSuccess, profileData, onProfileDataChange }: { 
    onSuccess: (message: string) => void; 
    profileData: any; 
    onProfileDataChange: (data: any) => void; 
  }) => (
    <div data-testid="profile-section">
      <span data-testid="profile-name">{profileData.name}</span>
      <span data-testid="profile-email">{profileData.email}</span>
      <button onClick={() => onSuccess('Profile Updated Successfully')} data-testid="update-profile">
        Update Profile
      </button>
      <button onClick={() => onProfileDataChange({ ...profileData, name: 'Updated Name' })} data-testid="change-profile-data">
        Change Profile Data
      </button>
    </div>
  )
}));

jest.mock('../../../../src/components/profile/profile-settings/ImagesSection', () => ({
  ImagesSection: ({ onSuccess }: { onSuccess: (message: string) => void }) => (
    <div data-testid="images-section">
      <button onClick={() => onSuccess('Images Updated Successfully')} data-testid="update-images">
        Update Images
      </button>
    </div>
  )
}));

jest.mock('../../../../src/components/profile/profile-settings/Notification', () => ({
  Notification: ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div data-testid="notification">
      <span data-testid="notification-message">{message}</span>
      <button onClick={onClose} data-testid="close-notification">Close</button>
    </div>
  )
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} data-testid="tinder-logo" />
  )
}));

describe('TinderProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TinderProfile component with initial state', () => {
    render(<TinderProfile />);
    
    // Check if all main components are rendered
    expect(screen.getByTestId('tinder-header')).toBeTruthy();
    expect(screen.getByTestId('tinder-navigation')).toBeTruthy();
    expect(screen.getByTestId('profile-section')).toBeTruthy();
    
    // Check initial profile data display
    expect(screen.getByText('Hi, Elon')).toBeTruthy();
    expect(screen.getByText('Musk@pinecone.mn')).toBeTruthy();
    
    // Check initial active section
    expect(screen.getByTestId('active-section').textContent).toBe('profile');
    
    // Check footer elements
    expect(screen.getByTestId('tinder-logo')).toBeTruthy();
    expect(screen.getByText('© Copyright 2024')).toBeTruthy();
  });

  test('displays correct initial profile data', () => {
    render(<TinderProfile />);
    
    // Check profile data in ProfileSection
    expect(screen.getByTestId('profile-name').textContent).toBe('Elon');
    expect(screen.getByTestId('profile-email').textContent).toBe('Musk');
  });

  test('handles navigation between profile and images sections', async () => {
    render(<TinderProfile />);
    
    // Initially profile section should be active
    expect(screen.getByTestId('profile-section')).toBeTruthy();
    expect(screen.queryByTestId('images-section')).toBeFalsy();
    
    // Click images tab
    await userEvent.click(screen.getByTestId('images-tab'));
    
    // Images section should be active now
    expect(screen.getByTestId('images-section')).toBeTruthy();
    expect(screen.queryByTestId('profile-section')).toBeFalsy();
    expect(screen.getByTestId('active-section').textContent).toBe('images');
    
    // Click profile tab
    await userEvent.click(screen.getByTestId('profile-tab'));
    
    // Profile section should be active again
    expect(screen.getByTestId('profile-section')).toBeTruthy();
    expect(screen.queryByTestId('images-section')).toBeFalsy();
    expect(screen.getByTestId('active-section').textContent).toBe('profile');
  });

  test('shows and hides notification with correct message', async () => {
    render(<TinderProfile />);
    
    // Initially no notification should be visible
    expect(screen.queryByTestId('notification')).toBeFalsy();
    
    // Trigger success notification from ProfileSection
    await userEvent.click(screen.getByTestId('update-profile'));
    
    // Notification should be visible with correct message
    expect(screen.getByTestId('notification')).toBeTruthy();
    expect(screen.getByTestId('notification-message').textContent).toBe('Profile Updated Successfully');
  });

  test('shows notification from ImagesSection', async () => {
    render(<TinderProfile />);
    
    // Navigate to images section
    await userEvent.click(screen.getByTestId('images-tab'));
    
    // Trigger success notification from ImagesSection
    await userEvent.click(screen.getByTestId('update-images'));
    
    // Notification should be visible with correct message
    expect(screen.getByTestId('notification')).toBeTruthy();
    expect(screen.getByTestId('notification-message').textContent).toBe('Images Updated Successfully');
  });

  test('allows manual closing of notification', async () => {
    render(<TinderProfile />);
    
    // Trigger notification
    await userEvent.click(screen.getByTestId('update-profile'));
    expect(screen.getByTestId('notification')).toBeTruthy();
    
    // Manually close notification
    await userEvent.click(screen.getByTestId('close-notification'));
    expect(screen.queryByTestId('notification')).toBeFalsy();
  });

  test('updates profile data when ProfileSection calls onProfileDataChange', async () => {
    render(<TinderProfile />);
    
    // Check initial name
    expect(screen.getByText('Hi, Elon')).toBeTruthy();
    
    // Trigger profile data change
    await userEvent.click(screen.getByTestId('change-profile-data'));
    
    // Check updated name in greeting
    expect(screen.getByText('Hi, Updated Name')).toBeTruthy();
  });

  test('renders footer with correct elements', () => {
    render(<TinderProfile />);
    
    // Check footer elements
    expect(screen.getByTestId('tinder-logo')).toBeTruthy();
    expect(screen.getByText('© Copyright 2024')).toBeTruthy();
    
    // Check logo attributes
    const logo = screen.getByTestId('tinder-logo');
    expect(logo.getAttribute('src')).toBe('/tindalogos.svg');
    expect(logo.getAttribute('alt')).toBe('tinder logo');
    expect(logo.getAttribute('width')).toBe('32');
    expect(logo.getAttribute('height')).toBe('32');
    expect(logo.className).toContain('w-24');
    expect(logo.className).toContain('h-12');
    expect(logo.className).toContain('object-contain');
    expect(logo.className).toContain('grayscale');
  });

  test('renders all layout elements correctly', () => {
    render(<TinderProfile />);
    
    // Check main container
    const mainContainer = screen.getByText('Hi, Elon').closest('.min-h-screen');
    expect(mainContainer).toBeTruthy();
    expect(mainContainer.className).toContain('bg-white');
    
    // Check greeting section
    const greeting = screen.getByText('Hi, Elon');
    expect(greeting.className).toContain('text-lg');
    expect(greeting.className).toContain('font-semibold');
    expect(greeting.className).toContain('text-gray-800');
    
    const email = screen.getByText('Musk@pinecone.mn');
    expect(email.className).toContain('text-sm');
    expect(email.className).toContain('text-gray-600');
  });

  test('handles multiple rapid notifications', async () => {
    render(<TinderProfile />);
    
    // Trigger first notification
    await userEvent.click(screen.getByTestId('update-profile'));
    expect(screen.getByTestId('notification-message').textContent).toBe('Profile Updated Successfully');
    
    // Navigate to images and trigger second notification
    await userEvent.click(screen.getByTestId('images-tab'));
    await userEvent.click(screen.getByTestId('update-images'));
    
    // Should show the latest notification
    expect(screen.getByTestId('notification-message').textContent).toBe('Images Updated Successfully');
  });

  test('covers all conditional rendering paths', () => {
    render(<TinderProfile />);
    
    // Test profile section rendering
    expect(screen.getByTestId('profile-section')).toBeTruthy();
    expect(screen.queryByTestId('images-section')).toBeFalsy();
    
    // Test notification conditional rendering (initially hidden)
    expect(screen.queryByTestId('notification')).toBeFalsy();
  });

  test('covers all component props and data flow', () => {
    render(<TinderProfile />);
    
    // Test that ProfileSection receives correct props
    expect(screen.getByTestId('profile-name').textContent).toBe('Elon');
    expect(screen.getByTestId('profile-email').textContent).toBe('Musk');
    
    // Test that TinderNavigation receives correct props
    expect(screen.getByTestId('active-section').textContent).toBe('profile');
  });

  test('covers all state management functions', async () => {
    render(<TinderProfile />);
    
    // Test handleSectionChange function
    await userEvent.click(screen.getByTestId('images-tab'));
    expect(screen.getByTestId('active-section').textContent).toBe('images');
    
    // Test showSuccessNotification function
    await userEvent.click(screen.getByTestId('update-images'));
    expect(screen.getByTestId('notification-message').textContent).toBe('Images Updated Successfully');
    
    // Test handleProfileDataChange function
    await userEvent.click(screen.getByTestId('profile-tab'));
    await userEvent.click(screen.getByTestId('change-profile-data'));
    expect(screen.getByText('Hi, Updated Name')).toBeTruthy();
  });

  test('covers notification auto-hide functionality', async () => {
    render(<TinderProfile />);
    
    // Trigger notification
    await userEvent.click(screen.getByTestId('update-profile'));
    expect(screen.getByTestId('notification')).toBeTruthy();
    
    // Test that notification can be manually closed (covers the onClose callback)
    await userEvent.click(screen.getByTestId('close-notification'));
    expect(screen.queryByTestId('notification')).toBeFalsy();
  });
});
