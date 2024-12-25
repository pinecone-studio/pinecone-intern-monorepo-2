import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeadingSection from '@/components/visit-profile/HeadingSection';
import { AccountVisibility } from '@/generated';
import '@testing-library/jest-dom';

describe('HeadingSection Component', () => {
  const mockHandleFollowClick = jest.fn();

  const mockProfileUser = {
    userName: 'testuser',
    profileImg: 'https://example.com/image.png',
    followerCount: 10,
    followingCount: 5,
    fullName: 'Test User',
    bio: 'This is a test bio',
    _id: '123',
    accountVisibility: AccountVisibility.Public,
    createdAt: '2024-12-12',
    updatedAt: '2024-12-12',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with user data', () => {
    render(<HeadingSection profileUser={mockProfileUser} followLoading={false} buttonState="Follow" handleFollowClick={mockHandleFollowClick} />);

    // expect(screen.getByTestId('proImage')).toHaveAttribute('src', mockProfileUser.profileImg);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('followers')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('following')).toBeInTheDocument();
    expect(screen.getByText('This is a test bio')).toBeInTheDocument();
  });

  it('disables the follow button when loading', () => {
    render(<HeadingSection profileUser={mockProfileUser} followLoading={true} buttonState="Follow" handleFollowClick={mockHandleFollowClick} />);

    const followButton = screen.getByText('Loading...');
    expect(followButton).toBeDisabled();
  });

  it('disables the follow button if the state is not "Follow"', () => {
    render(<HeadingSection profileUser={mockProfileUser} followLoading={false} buttonState="Requested" handleFollowClick={mockHandleFollowClick} />);

    const followButton = screen.getByText('Requested');
    expect(followButton).toBeDisabled();
  });

  it('triggers the follow button click when enabled', () => {
    render(<HeadingSection profileUser={mockProfileUser} followLoading={false} buttonState="Follow" handleFollowClick={mockHandleFollowClick} />);

    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);

    expect(mockHandleFollowClick).toHaveBeenCalledTimes(1);
  });

  it('renders a default profile image if no profile image is provided', () => {
    render(<HeadingSection profileUser={{ ...mockProfileUser, profileImg: undefined }} followLoading={false} buttonState="Follow" handleFollowClick={mockHandleFollowClick} />);

    const defaultImage = screen.getByTestId('proImage');
    expect(defaultImage).toHaveAttribute(
      'src',
      expect.stringContaining(
        'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png'
      )
    );
  });

  it('renders "0 posts" by default', () => {
    render(<HeadingSection profileUser={mockProfileUser} followLoading={false} buttonState="Follow" handleFollowClick={mockHandleFollowClick} />);

    expect(screen.getByText('0 posts')).toBeInTheDocument();
  });
});
