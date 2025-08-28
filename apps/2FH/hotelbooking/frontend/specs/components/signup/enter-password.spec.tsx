import { useOtpContext } from '@/components/providers';
import { EnterPassword } from '@/components/signup/_components/EnterPassword';
import { CreateUserDocument } from '@/generated';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const mockPassword = 'Aa@12345678';
const mockEmail = 'test@example.com';
const mockPush = jest.fn();

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/components/providers', () => ({ useOtpContext: jest.fn() }));
jest.mock('@/components/signup/_components/assets/LoadingSvg', () => ({
  LoadingSvg: () => <div data-testid="loading-svg">Loading...</div>,
}));

const successMock: MockedResponse = {
  request: {
    query: CreateUserDocument,
    variables: { input: { email: mockEmail, password: mockPassword } },
  },
  result: { data: { createUser: { id: '1', email: mockEmail } } },
};

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (useOtpContext as jest.Mock).mockReturnValue({ email: mockEmail, password: '' });
});

const setup = (mocks: MockedResponse[] = [successMock]) => {
  const utils = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <EnterPassword />
    </MockedProvider>
  );
  const password = utils.getByTestId('input-password-input') as HTMLInputElement;
  const confirm = utils.getByTestId('input-confirm-password-input') as HTMLInputElement;
  const btn = utils.getByTestId('create-user-btn');
  return { ...utils, password, confirm, btn };
};

describe('EnterPassword', () => {
  it('1. Success → toast + redirect', async () => {
    const { password, confirm, btn } = setup();
    fireEvent.change(password, { target: { value: mockPassword } });
    fireEvent.change(confirm, { target: { value: mockPassword } });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(`${mockEmail} user successfully created`);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('2. Error → toast.error', async () => {
    const errorMock: MockedResponse = {
      request: { query: CreateUserDocument, variables: { input: { email: mockEmail, password: mockPassword } } },
      error: new Error('fail'),
    };
    const { password, confirm, btn } = setup([errorMock]);
    fireEvent.change(password, { target: { value: mockPassword } });
    fireEvent.change(confirm, { target: { value: mockPassword } });
    fireEvent.click(btn);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('User create error'));
    expect(mockPush).not.toHaveBeenCalled();
  });
});
