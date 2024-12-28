import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeadingSection from '@/components/visit-profile/HeadingSection';
import { AccountVisibility, FollowStatus } from '@/generated';

describe('HeadingSection Component', () => {
  const mockHandleFollowClick = jest.fn();

  const defaultProps = {
    profileUser: {
      _id: '123',
      userName: 'testuser',
      profileImg: '',
      followerCount: 10,
      followingCount: 5,
      fullName: 'Test User',
      bio: 'This is a test bio',
      accountVisibility: AccountVisibility.Public,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    followLoading: false,
    buttonState: 'Follow',
    handleFollowClick: mockHandleFollowClick,
    followData: undefined,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly with default props', () => {
    render(<HeadingSection {...defaultProps} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('This is a test bio')).toBeInTheDocument();
  });

  it('renders "Following" if followData status is APPROVED', () => {
    render(<HeadingSection {...defaultProps} followData={{ getFollowStatus: { status: FollowStatus.Approved } }} />);

    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('renders "Requested" if followData status is PENDING', () => {
    render(<HeadingSection {...defaultProps} followData={{ getFollowStatus: { status: FollowStatus.Pending } }} />);

    expect(screen.getByText('Requested')).toBeInTheDocument();
  });

  it('disables the follow button when loading', () => {
    render(<HeadingSection {...defaultProps} followLoading={true} />);

    const followButton = screen.getByText('Follow');
    expect(followButton).toBeDisabled();
  });

  it('calls handleFollowClick when follow button is clicked', () => {
    render(<HeadingSection {...defaultProps} />);

    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);

    expect(mockHandleFollowClick).toHaveBeenCalledTimes(1);
  });

  it('disables the follow button when buttonText is not "Follow"', () => {
    render(<HeadingSection {...defaultProps} followData={{ getFollowStatus: { status: FollowStatus.Approved } }} />);

    const followButton = screen.getByText('Following');
    expect(followButton).toBeDisabled();
  });

  it('renders a default profile image if no profile image is provided', () => {
    render(<HeadingSection {...defaultProps} />);

    const profileImage = screen.getByTestId('proImage');
    expect(profileImage).toHaveAttribute(
      'src',
      'https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png'
    );
  });

  it('renders the user-provided profile image when available', () => {
    render(<HeadingSection {...defaultProps} profileUser={{ ...defaultProps.profileUser, profileImg: 'https://example.com/profile.jpg' }} />);

    const profileImage = screen.getByTestId('proImage');
    expect(profileImage).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });
});
