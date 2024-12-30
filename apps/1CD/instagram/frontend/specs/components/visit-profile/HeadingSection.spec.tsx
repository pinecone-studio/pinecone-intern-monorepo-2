import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeadingSection from '@/components/visit-profile/HeadingSection';

jest.mock('lucide-react', () => ({
  Ellipsis: jest.fn(() => <div data-testid="ellipsis-icon">...</div>),
}));

describe('HeadingSection', () => {
  const mockHandleButtonClick = jest.fn();
  const profileUser = {
    profileImg: 'https://example.com/profile.jpg',
    userName: 'TestUser',
    followerCount: 123,
    followingCount: 456,
    fullName: 'Test User',
    bio: 'This is a test bio.',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with profile user data', () => {
    render(<HeadingSection profileUser={profileUser} followLoading={false} buttonText="Follow" handleButtonClick={mockHandleButtonClick} />);

    // Profile image
    const profileImage = screen.getByTestId('proImage');
    expect(profileImage).toHaveAttribute('src', profileUser.profileImg);
    expect(profileImage).toHaveAttribute('alt', 'profile image');

    // User info
    expect(screen.getByText(profileUser.userName)).toBeInTheDocument();
    expect(screen.getByText(profileUser.fullName)).toBeInTheDocument();
    expect(screen.getByText(profileUser.bio)).toBeInTheDocument();

    // Followers and following
    expect(screen.getByText(`${profileUser.followerCount}`)).toBeInTheDocument();
    expect(screen.getByText('followers')).toBeInTheDocument();
    expect(screen.getByText(`${profileUser.followingCount}`)).toBeInTheDocument();
    expect(screen.getByText('following')).toBeInTheDocument();

    // Ellipsis icon
    expect(screen.getByTestId('ellipsis-icon')).toBeInTheDocument();
  });

  test('renders default profile image when profileImg is undefined', () => {
    render(<HeadingSection profileUser={{ ...profileUser, profileImg: undefined }} followLoading={false} buttonText="Follow" handleButtonClick={mockHandleButtonClick} />);

    const profileImage = screen.getByTestId('proImage');
    expect(profileImage).toHaveAttribute(
      'src',
      'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png'
    );
  });

  test('disables Follow button and applies loading styles when followLoading is true', () => {
    render(<HeadingSection profileUser={profileUser} followLoading={true} buttonText="Following..." handleButtonClick={mockHandleButtonClick} />);

    const followButton = screen.getByText('Following...');
    expect(followButton).toBeDisabled();
    expect(followButton).toHaveClass('opacity-50 cursor-not-allowed');
  });

  test('calls handleButtonClick when Follow button is clicked', async () => {
    render(<HeadingSection profileUser={profileUser} followLoading={false} buttonText="Follow" handleButtonClick={mockHandleButtonClick} />);

    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);

    expect(mockHandleButtonClick).toHaveBeenCalledTimes(1);
  });

  // test('renders 0 posts when profileUser is undefined', () => {
  //   render(<HeadingSection profileUser={undefined} followLoading={false} buttonText="Follow" handleButtonClick={mockHandleButtonClick} />);

  //   expect(screen.getByText('0 posts')).toBeInTheDocument();
  //   expect(screen.queryByText('followers')).not.toBeInTheDocument();
  //   expect(screen.queryByText('following')).not.toBeInTheDocument();
  // });

  test('renders Message button', () => {
    render(<HeadingSection profileUser={profileUser} followLoading={false} buttonText="Follow" handleButtonClick={mockHandleButtonClick} />);

    const messageButton = screen.getByText('Message');
    expect(messageButton).toBeInTheDocument();
  });
});
