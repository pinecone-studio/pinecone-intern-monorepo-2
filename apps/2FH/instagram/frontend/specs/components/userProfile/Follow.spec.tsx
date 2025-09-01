import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Followers } from '@/components/userProfile/Followers';

const mockCurrentUser = { _id: 'user1', userName: 'currentUser' };

describe('Followers component', () => {
  it('renders followers count correctly', () => {
    render(
      <MockedProvider>
        <Followers followers={[]} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    expect(screen.getByRole('button', { name: /0 Followers/i })).toBeInTheDocument();
  });

  it('shows "No followers yet" when followers list is empty', () => {
    render(
      <MockedProvider>
        <Followers followers={[]} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /0 Followers/i }));
    expect(screen.getByText(/No followers yet/i)).toBeInTheDocument();
  });

  it('renders follower list when followers exist', () => {
    const followers = [
      { _id: 'user2', userName: 'Alice', profileImage: null },
      { _id: 'user3', userName: 'Bob', profileImage: null },
    ];
    render(
      <MockedProvider>
        <Followers followers={followers} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /2 Followers/i }));

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders FollowButton for the current user follower', () => {
    const followers = [{ _id: 'user1', userName: 'currentUser', profileImage: null }];
    render(
      <MockedProvider>
        <Followers followers={followers} currentUser={mockCurrentUser} />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /1 Followers/i }));

    expect(screen.getByTestId('follow-btn-user1')).toBeInTheDocument();
  });

  it('opens dialog on trigger click', () => {
    const followers = [{ _id: 'user2', userName: 'Alice', profileImage: null }];
    render(
      <MockedProvider>
        <Followers followers={followers} currentUser={mockCurrentUser} />
      </MockedProvider>
    );

    expect(screen.queryByText('Alice')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /1 Followers/i }));
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
