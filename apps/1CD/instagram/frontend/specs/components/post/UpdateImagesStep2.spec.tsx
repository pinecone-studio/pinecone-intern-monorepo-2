import { UpdateImagesStep2 } from '@/components/post/UpdateImagesStep2';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, waitFor } from '@testing-library/react';

// jest.mock('@/components/post/CreatePost', () => ({
//   CreatePost: () => <div data-testid="mocked-create-post"></div>,
// }));
const mockImages = ['https://img.png', 'https://img.png'];
describe('UpdateImagesStep2', () => {
  it('should allow going back to step 2 from step 1', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <UpdateImagesStep2 step={true} setStep={jest.fn()} setOpenCreatePostModal={jest.fn()} images={mockImages} loading={true} setLoading={jest.fn()} />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('step2')));
    fireEvent.click(getByTestId('Btn1'));
  });
  it('should UpdateImagesStep2 ', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <UpdateImagesStep2 step={true} setStep={jest.fn()} setOpenCreatePostModal={jest.fn()} images={mockImages} loading={true} setLoading={jest.fn()} />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('step2')));
    fireEvent.click(getByTestId('Btn2'));
  });
});
