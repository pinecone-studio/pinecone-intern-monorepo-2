import Notification from '@/components/notification';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, waitFor, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { useGetNotificationsByLoggedUserQuery } from '@/generated';
import { result } from 'cypress/types/lodash';

const mockNotifyPostLike = [{ _id: '1', otherUserId: { userName: 'MockUser', profileImg: 'https://www.example.com/proImg.jpg' }, createdDate: new Date('2025-01-03T00:00:00.000Z') }];
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/generated', () => ({ useGetNotificationsByLoggedUserQuery: jest.fn(() => ({ data: { getNotificationsByLoggedUser: mockNotifyPostLike }, loading: true })) }));
const mocks: MockedResponse[] = [
  {
    request: { query: GetNotificationsByLoggedUser },
    result: {
      data: { getNotificationsByLoggedUser: [{ _id: '1', otherUserId: { userName: 'MockUser1', profileImg: 'https://www.example.com/proImg1.jpg' }, createdAt: '2025-01-06T00:00:00.000Z' }] },
    },
  },
];

describe('notification', () => {
  it('render notification', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Notification />
      </MockedProvider>
    );
    const notifyCompo = await waitFor(() => screen.getByTestId('notification-component'));
    expect(notifyCompo).toBeDefined();
  });
});
