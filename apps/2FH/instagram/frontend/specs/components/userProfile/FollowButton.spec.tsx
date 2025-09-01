import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { FollowButton } from '../../../src/components/userProfile/FollowButton';

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported')) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

const FOLLOW_USER = gql`
  mutation FollowUser($targetUserId: ID!) {
    followUser(targetUserId: $targetUserId) {
      success
      message
      request {
        status
      }
    }
  }
`;

interface FollowUserResult {
  followUser: {
    success?: boolean;
    message?: string;
    request?: {
      status?: string;
    } | null;
  } | null;
}

const createMock = (result: FollowUserResult, error?: Error) => ({
  request: { query: FOLLOW_USER, variables: { targetUserId: 'test-user-id' } },
  result: error ? undefined : { data: result },
  error,
});

const renderFollowButton = (props = {}, mocks = [createMock({ followUser: { success: true, message: 'Success', request: { status: 'ACCEPTED' } } })]) => {
  const defaultProps = { targetUserId: 'test-user-id', initialIsFollowing: false, initialIsRequested: false, isPrivate: false, ...props };
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <FollowButton {...defaultProps} />
    </MockedProvider>
  );
};

describe('FollowButton Component', () => {
  it('should render correct button states and classes', () => {
    renderFollowButton();
    let button = screen.getByRole('button');
    expect(button).toHaveTextContent('Follow');
    expect(button).toHaveClass('bg-blue-600', 'text-white');

    renderFollowButton({ initialIsFollowing: true });
    const buttons = screen.getAllByRole('button');
    button = buttons[buttons.length - 1];
    expect(button).toHaveTextContent('Following');
    expect(button).toHaveClass('bg-neutral-200', 'text-black');

    renderFollowButton({ initialIsRequested: true });
    const allButtons = screen.getAllByRole('button');
    button = allButtons[allButtons.length - 1];
    expect(button).toHaveTextContent('Requested');
    expect(button).toHaveClass('bg-neutral-200', 'text-gray-600');
    expect(button).toBeDisabled();
  });

  it('should handle successful follow mutation', async () => {
    renderFollowButton();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveTextContent('Following');
    });
  });

  it('should handle follow request for private account', async () => {
    const mocks = [createMock({ followUser: { success: true, message: 'Request sent', request: { status: 'PENDING' } } })];
    renderFollowButton({ isPrivate: true }, mocks);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveTextContent('Requested');
      expect(button).toBeDisabled();
    });
  });

  it('should handle mutation error gracefully', async () => {
    const mocks = [createMock({ followUser: null }, new Error('Failed to follow user'))];
    renderFollowButton({}, mocks);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveTextContent('Follow');
      expect(button).toHaveClass('bg-blue-600');
    });
  });

  it('should show loading state during mutation', async () => {
    renderFollowButton();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveTextContent('...');
    });
  });

  it('should handle edge cases in mutation responses', async () => {
    const nullMock = [createMock({ followUser: null })];
    renderFollowButton({}, nullMock);
    let button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('Follow'));

    const noRequestMock = [createMock({ followUser: { success: false, message: 'Not found', request: null } })];
    renderFollowButton({}, noRequestMock);
    const buttons = screen.getAllByRole('button');
    button = buttons[buttons.length - 1];
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('Follow'));

    const undefinedSuccessMock = [createMock({ followUser: { success: undefined, message: 'Test', request: { status: 'ACCEPTED' } } })];
    renderFollowButton({}, undefinedSuccessMock);
    const allButtons = screen.getAllByRole('button');
    button = allButtons[allButtons.length - 1];
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('Follow'));

    const undefinedStatusMock = [createMock({ followUser: { success: true, message: 'Test', request: { status: undefined } } })];
    renderFollowButton({}, undefinedStatusMock);
    const finalButtons = screen.getAllByRole('button');
    button = finalButtons[finalButtons.length - 1];
    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('Following'));
  });

  it('should have correct data-testid attribute', () => {
    renderFollowButton({ targetUserId: 'custom-user-id' });
    const button = screen.getByTestId('follow-btn-custom-user-id');
    expect(button).toBeInTheDocument();
  });
});
