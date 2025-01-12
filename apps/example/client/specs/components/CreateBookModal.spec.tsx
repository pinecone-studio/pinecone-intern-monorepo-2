import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { CreateBookModal } from '../../src/components';
import { CreateAuthorDocument, CreateBookDocument, GetAuthorsDocument } from '../../src/generated';
import { ErrorBoundary } from '../utils/ErrorBoundary';

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

const createBookMock: MockedResponse = {
  request: {
    query: CreateBookDocument,
    variables: {
      title: 'Test Book',
      authorId: '1',
    },
  },
  result: {
    data: {
      createBook: {
        _id: '1',
        title: 'Test Book',
      },
    },
  },
};

const getAuthorsMock: MockedResponse = {
  request: {
    query: GetAuthorsDocument,
  },
  result: {
    data: {
      getAuthors: [
        {
          _id: '1',
          name: 'Test Author',
        },
      ],
    },
  },
};

const getAuthorsErrorMock: MockedResponse = {
  request: {
    query: GetAuthorsDocument,
  },
  error: new Error('Error: Network error'),
};

describe('CreateBookModal', () => {
  it('should render', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[createAuthorMock, createBookMock, getAuthorsMock]} addTypename={false}>
        <CreateBookModal refetch={jest.fn()} />
      </MockedProvider>
    );

    const modalBtn = getByTestId('add-book-open-modal-btn');

    act(() => {
      fireEvent.click(modalBtn);
    });

    const modal = getByTestId('add-book-modal');
    const input = getByTestId('book-title-input').getElementsByTagName('input')[0];
    const select = getByTestId('author-select').getElementsByClassName('MuiSelect-select')[0];
    const createBtn = getByTestId('create-book-btn');

    act(() => {
      fireEvent.change(input, { target: { value: 'Test Book' } });
      fireEvent.mouseDown(select);
    });

    await waitFor(() => expect(getByTestId('option-1')).toBeDefined());

    act(() => {
      fireEvent.click(getByTestId('option-1'));
    });

    act(() => {
      fireEvent.click(createBtn);
    });

    await waitFor(() => expect(modal).toBeDefined());
  });

  it('should throw error when getAuthors failed', async () => {
    const { getByTestId } = render(
      <ErrorBoundary fallback={<div data-testid="error">Error</div>}>
        <MockedProvider mocks={[createAuthorMock, createBookMock, getAuthorsErrorMock]} addTypename={false}>
          <CreateBookModal refetch={jest.fn()} />
        </MockedProvider>
      </ErrorBoundary>
    );

    const modalBtn = getByTestId('add-book-open-modal-btn');

    act(() => {
      fireEvent.click(modalBtn);
    });

    await waitFor(() => expect(getByTestId('error')).toBeDefined());
  });

  it('should refetch authors', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[createAuthorMock, createBookMock, getAuthorsMock, getAuthorsMock]} addTypename={false}>
        <CreateBookModal refetch={jest.fn()} />
      </MockedProvider>
    );

    const modalBtn = getByTestId('add-book-open-modal-btn');

    act(() => {
      fireEvent.click(modalBtn);
    });

    const addAuthorBtn = getByTestId('add-author-open-modal-btn');

    act(() => {
      fireEvent.click(addAuthorBtn);
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
