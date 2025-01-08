import NotifyPostLikeCard from '@/app/(main)/_components/NotifyPostLikeCard';
import Notification from '@/components/notification';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { expect, jest } from '@jest/globals';
import { GetNotificationsByLoggedUserDocument } from '@/generated';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
const postLikeNotifyMock = [
  {
    request: { query: GetNotificationsByLoggedUserDocument },
    result: {
      data: { getNotificationsByLoggedUser: [{ _id: '1', createdDate: new Date('2025-01-02T10:00:00Z'), otherUserId: { userName: 'mock User', profileImg: 'http://www.example.com/proImg.jpg' } }] },
    },
  },
];

// const mockPostLike = [{ _id: 'mock1', createdDate: new Date('2025-01-01T10:00:00Z'), otherUserId: { userName: 'Mock User', profileImg: 'http://www.example.com/proImg.jpg' } }];
jest.mock('@/app/(main)/_components/NotifyPostLikeCard', () => ({
  __esModule: true,
  default: ({ userName, profileImg, createdDate }: { userName: string; profileImg: string; createdDate: Date }) => (
    <div data-testid="notify-postlike-card">
      <img src={profileImg} alt="zurag" data-testid="notify-postlike-proImg" />
      <span data-testid="notify-postlike-username">{userName}</span>
      <span data-testid="notify-postlike-dateDistance">{new Date(createdDate).toLocaleDateString()}</span>
    </div>
  ),
}));

describe('Notification', () => {
  it('should render notification component', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={postLikeNotifyMock}>
        <Notification />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('notification-component')));
    const confirmBtn = getByTestId('confirm-btn');
    const deleteBtn = getByTestId('confirm-btn');

    fireEvent.click(confirmBtn);
    fireEvent.click(deleteBtn);
  });
  it('should render notifications postlike card', async () => {
    render(
      <>
        {postLikeNotifyMock[0].result.data.getNotificationsByLoggedUser.map((oneNotification) => (
          <NotifyPostLikeCard key={oneNotification._id} userName={oneNotification.otherUserId.userName} profileImg={oneNotification.otherUserId.profileImg} createdDate={oneNotification.createdDate} />
        ))}
      </>
    );
    expect(screen.getAllByTestId('notify-postlike-card')).toHaveLength(postLikeNotifyMock[0].result.data.getNotificationsByLoggedUser.length);
    expect(screen.getByTestId('notify-postlike-proImg')).toBeDefined();
    expect(screen.getByTestId('notify-postlike-username')).toBeDefined();
    expect(screen.getByTestId('notify-postlike-dateDistance')).toBeDefined();
  });
});
