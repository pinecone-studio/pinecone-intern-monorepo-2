import { UpdateImagesStep1 } from '@/components/post/UpdateImagesStep1';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { Dispatch, SetStateAction } from 'react';

// jest.mock('@/components/post/CreatePost', () => ({
//   CreatePost: () => <div data-testid="mocked-create-post"></div>,
// }));

describe('UpdateImagesStep1', () => {
  const mockSetOpenCreatePostModal: Dispatch<SetStateAction<boolean>> = jest.fn();

  it('should allow going back to step 1 from step 2', async () => {
    const mockImageURL = 'https://mocked-cloudinary-url.com/image.jpg';

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        mockImageURL,
      }),
    });
    const { getByTestId } = render(
      <MockedProvider>
        <UpdateImagesStep1 openCreatePostModal={true} setOpenCreatePostModal={mockSetOpenCreatePostModal} />
      </MockedProvider>
    );

    // Simulate file upload
    fireEvent.click(getByTestId('openInputBtn'));
    const input = getByTestId('input') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'test-image.jpg', { type: 'image/jpg' });
    fireEvent.change(input, { target: { files: [file] } });

    // fireEvent.click(getByTestId('closeBtn'));
  });
  it('should allow going back to step 1 from step 2', async () => {
    const { getByTestId } = render(
      <MockedProvider>
        <UpdateImagesStep1 openCreatePostModal={true} setOpenCreatePostModal={mockSetOpenCreatePostModal} />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('step1')));
    fireEvent.click(getByTestId('openInputBtn'));
    const input = getByTestId('input') as HTMLInputElement;
    // const file = new File([], 'test-image.jpg', { type: 'image/jpg' });
    fireEvent.change(input, { target: { files: null } });

    await waitFor(() => expect(getByTestId('input')));
    // fireEvent.click(getByTestId('closeBtn'));
  });
});
