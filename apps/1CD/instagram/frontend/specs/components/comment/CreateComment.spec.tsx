import { fireEvent, render } from '@testing-library/react';
import { useCreateCommentMutation, useGetCommentsQuery } from '@/generated';
import { CreateComment } from '@/components/comment/CreateComment';
jest.mock('@/generated', () => ({
  useGetCommentsQuery: jest.fn(),
  useCreateCommentMutation: jest.fn(),
}));

describe('CreatePost comment', () => {
  const mockRefetch = jest.fn();
  const setCommentValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render succes CreatePost comment', async () => {
    const mock = jest.fn().mockResolvedValue({});

    (useCreateCommentMutation as jest.Mock).mockReturnValue([mock]);
    (setCommentValue as jest.Mock).mockReturnValue('');
    (useGetCommentsQuery as jest.Mock).mockReturnValue({
      refetch: mockRefetch,
    });

    const { getByTestId } = render(<CreateComment id="post1" />);

    const input = getByTestId('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test desc' } });
    fireEvent.click(getByTestId('createBtn'));
  });
});
