import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainPageStory from '@/app/(main)/_components/story/MainPageStory';
import { MockedProvider } from '@apollo/client/testing';

const mockUser = {
  _id: '12345',
  userName: 'TestUser',
  profileImg: '/images/test-profile.jpg',
};

const mockUserNoImage = {
  _id: '12345',
  userName: 'TestUserNoImage',
  profileImg: null,
};

describe('MainPageStory Component', () => {
  it('renders correctly with user data and profile image', () => {
    render(
      <MockedProvider>
        <MainPageStory user={mockUser} />
      </MockedProvider>
    );

    const avatar = screen.getByTestId('avatar-image').closest('span');
    const img = within(avatar).getByRole('img');
    expect(img).toHaveAttribute('src', '/images/test-profile.jpg');
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/story/12345');
  });

  it('renders fallback image when profile image is not provided', () => {
    render(
      <MockedProvider>
        <MainPageStory user={mockUserNoImage} />
      </MockedProvider>
    );

    const avatar = screen.getByTestId('avatar-image').closest('span');
    const img = within(avatar).getByRole('img');
    expect(img).toHaveAttribute('src', '/images/profileImg.webp');
    expect(screen.getByText('TestUserNoImage')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/story/12345');
  });

  it('renders with proper styles', () => {
    render(
      <MockedProvider>
        <MainPageStory user={mockUser} />
      </MockedProvider>
    );

    const container = screen.getByRole('link').firstChild;
    expect(container).toHaveClass('flex flex-col gap-2 mt-6 w-fit');
  });

  it('renders userName in a span element with correct className', () => {
    render(
      <MockedProvider>
        <MainPageStory user={mockUser} />
      </MockedProvider>
    );

    const userName = screen.getByText('TestUser');
    expect(userName).toHaveClass('text-xs text-[#09090B] text-center');
  });
});
