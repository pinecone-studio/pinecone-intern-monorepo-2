import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { DeleteModal } from '@/components/post/DeleteModal';
import { DeletePostDocument } from '@/generated';

const deletePostMock: MockedResponse = {
  request: {
    query: DeletePostDocument,
    variables: {
      _id: '123',
    },
  },
  result: {
    data: {
      deletePost: {
        _id: '123',
      },
    },
  },
};

describe('DeletePostModal', () => {
  it('should render succes delete', async () => {
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={[deletePostMock]} addTypename={false}>
        <DeleteModal setOpenDeleteModal={jest.fn()} openDeleteModal={true} id="123" />
      </MockedProvider>
    );

    const modalBtn = getByTestId('delete-post-btn');
    const cancelBtn = getByTestId('cancel-btn');

    fireEvent.click(cancelBtn);

    fireEvent.click(modalBtn);

    await waitFor(() => expect(getByText('Delete')));
    // const modal = getByTestId('modalCancel');
    // fireEvent.keyDown(modal, { key: 'Enter' });
  });
});
