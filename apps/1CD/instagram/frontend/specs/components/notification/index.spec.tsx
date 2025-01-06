import NotifyPostLikeCard from '@/app/(main)/_components/NotifyPostLikeCard';
import Notification from '@/components/notification';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect } from '@jest/globals';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockNotifications = [
  { _id: '1', otherUserId: { userName: 'MockUser', profileImg: 'https://res.cloudinary.com/dka8klbhn/image/upload/v1735788813/nguro3w6bkvs9zlad0d7.jpg' }, createdDate: '2025-01-03T00:00:00.000Z' },
];
const notifyMock = { getNotificationsByLoggedUser: mockNotifications };
describe('Notification', () => {
  it('should render notification component', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Notification />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('notification-component')));
    const confirmBtn = getByTestId('confirm-btn');
    const deleteBtn = getByTestId('confirm-btn');

    fireEvent.click(confirmBtn);
    fireEvent.click(deleteBtn);

    render(
      <MockedProvider>
        <Notification />
      </MockedProvider>
    );

    notifyMock.getNotificationsByLoggedUser.map((oneNotification) => {
      render(
        <MockedProvider>
          <NotifyPostLikeCard
            key={oneNotification._id}
            userName={oneNotification.otherUserId.userName}
            profileImg={oneNotification.otherUserId.profileImg}
            createdDate={new Date(oneNotification.createdDate)}
          />
        </MockedProvider>
      );
    });
  });
});

// const { getByTestId } = render(
//   <MockedProvider>
//     <Notification />
//   </MockedProvider>
// );

// await waitFor(() => expect(getByTestId('notification-component')));
// const confirmBtn = getByTestId('confirm-btn');
// const deleteBtn = getByTestId('confirm-btn');

// fireEvent.click(confirmBtn);
// fireEvent.click(deleteBtn);
