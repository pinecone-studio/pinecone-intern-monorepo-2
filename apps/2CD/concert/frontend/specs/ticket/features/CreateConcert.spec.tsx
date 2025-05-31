/* eslint-disable no-unused-vars */
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import CreateConcert from 'src/app/(admin)/ticket/_features/CreateConcert';
import { CreateConcertDocument, Response, TicketType } from '@/generated';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';

const createConcertMock = {
  request: {
    query: CreateConcertDocument,
    variables: {
      input: {
        title: 'Mock Concert',
        description: 'Description',
        venueId: '683421865ac6aef99c922dfa',
        thumbnailUrl: 'https://example.com/image.jpg',
        artists: ['artist-id-1'],
        ticket: [
          { type: TicketType.Vip, quantity: 10, price: 10000 },
          { type: TicketType.Standard, quantity: 20, price: 5000 },
          { type: TicketType.Backseat, quantity: 30, price: 3000 },
        ],
        schedule: [
          {
            startDate: new Date('2025-06-01T12:00:00Z'),
            endDate: new Date('2025-06-01T14:00:00Z'),
          },
        ],
      },
    },
  },
  result: {
    data: {
      Success: 'Success',
    },
  },
};

describe('CreateConcert', () => {
  it('should render and create concert successfully', async () => {
    const { getByText, getByLabelText, getByRole, getByTestId } = render(
      <MockedProvider mocks={[createConcertMock]} addTypename={false}>
        <CreateConcert />
      </MockedProvider>
    );

    const openBtn = getByTestId("create-concert-modal-btn");
    fireEvent.click(openBtn);

    const titleInput = getByLabelText('Тоглолтын нэр');
    const descInput = getByLabelText('Хөтөлбөрийн тухай');
    const imgInput = getByLabelText('Хөтөлбөрийн зураг');

    fireEvent.change(titleInput, { target: { value: 'Test Concert' } });
    fireEvent.change(descInput, { target: { value: 'Test Description' } });
    fireEvent.change(imgInput, { target: { value: '' } });

    const submitBtn = getByRole('button', { name: 'Үүсгэх' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).disabled();
    });
  });

  it('should catch error from createConcert mutation', async () => {
    const errorMock: MockedResponse = {
      request: createConcertMock.request,
      error: new Error('Network error'),
    };

    const { getByText, getByLabelText, getByRole, getByTestId } = render(
      <ErrorBoundary fallback={<div data-testid="error">Error</div>}>
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <CreateConcert />
        </MockedProvider>
      </ErrorBoundary>
    );

    const openBtn = getByText('Тасалбар Нэмэх');
    fireEvent.click(openBtn);

    fireEvent.change(getByLabelText('Тоглолтын нэр'), { target: { value: 'Test Concert' } });
    fireEvent.change(getByLabelText('Хөтөлбөрийн тухай'), { target: { value: 'Test Description' } });

    const submitBtn = getByRole('button', { name: 'Үүсгэх' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(getByTestId('error')).disabled();
    });
  });
});
