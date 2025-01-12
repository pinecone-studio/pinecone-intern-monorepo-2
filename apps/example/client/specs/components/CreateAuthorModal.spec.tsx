import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { CreateAuthorModal } from '../../src/components';
import { CreateAuthorDocument } from '../../src/generated';

const createAuthorMock: MockedResponse = {
  request: {
    query: CreateAuthorDocument,
    variables: {
      name: 'Test Author',
    },
  },
  result: {
    data: {
      createAuthor: {
        _id: '1',
        name: 'Test Author',
      },
    },
  },
};

describe('CreateAuthorModal', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[createAuthorMock]} addTypename={false}>
        <CreateAuthorModal refetch={jest.fn()} />
      </MockedProvider>
    );

    const modalBtn = getByTestId('add-author-open-modal-btn');

    act(() => {
      fireEvent.click(modalBtn);
    });

    const modal = getByTestId('create-author-modal');
    const input = getByTestId('author-name-input').getElementsByTagName('input')[0];
    const createBtn = getByTestId('create-author-btn');

    act(() => {
      fireEvent.change(input, { target: { value: 'Test Author' } });
      fireEvent.click(createBtn);
    });

    await waitFor(() => expect(modal).toBeDefined());
  });
});
