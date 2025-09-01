import '@testing-library/jest-dom';
import { Followings } from '@/components/userProfile/Followings';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock FollowButton
jest.mock('../../../src/components/userProfile/FollowButton', () => ({
  FollowButton: ({ targetUserId }: { targetUserId: string }) => <button data-testid={`follow-btn-${targetUserId}`}>FollowButton</button>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'mocked-image'} />;
  },
}));

describe('Followings Component', () => {
  const currentUser = { _id: '123', userName: 'currentUser' };

  it('renders followings count and opens dialog', () => {
    render(<Followings followings={[]} currentUser={currentUser} />);
    expect(screen.getByRole('button', { name: /0 Followings/i })).toBeInTheDocument();

    // Dialog trigger дархад open болохыг шалгана
    fireEvent.click(screen.getByRole('button', { name: /0 Followings/i }));
    expect(screen.getByText(/No followings yet/i)).toBeInTheDocument();
  });

  it('renders list of followings', () => {
    const followings = [
      { _id: '1', userName: 'Alice', profileImage: null },
      { _id: '2', userName: 'Bob', profileImage: null },
    ];

    render(<Followings followings={followings} currentUser={currentUser} />);

    fireEvent.click(screen.getByRole('button', { name: /2 Followings/i }));

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders FollowButton only for current user', () => {
    const followings = [
      { _id: '123', userName: 'currentUser', profileImage: null },
      { _id: '2', userName: 'Bob', profileImage: null },
    ];

    render(<Followings followings={followings} currentUser={currentUser} />);

    fireEvent.click(screen.getByRole('button', { name: /2 Followings/i }));

    // зөвхөн currentUser дээр FollowButton гарна
    expect(screen.getByTestId('follow-btn-123')).toBeInTheDocument();
    expect(screen.queryByTestId('follow-btn-2')).not.toBeInTheDocument();
  });
});
