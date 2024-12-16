// import { fireEvent, render, waitFor } from '@testing-library/react';
// import { MockedProvider } from '@apollo/client/testing';

// import { UpdateImagesStep1 } from '@/components/post/UpdateImagesStep1';

// // const deletePostMock: string[] = ['http://img1'];

// describe('DeletePostModal', () => {
//   it('should render succes delete', async () => {
//     const { getByTestId, getByText } = render(
//       <MockedProvider addTypename={false}>
//         <UpdateImagesStep1 setOpenCreatePostModal={jest.fn()} openCreatePostModal={true} />
//       </MockedProvider>
//     );

//     await waitFor(() => expect(getByText('Delete')));
//     const modal = getByTestId('modalCancel');
//     fireEvent.keyDown(modal, { key: 'Enter' });
//   });
// });

import { UpdateImagesStep1 } from '@/components/post/UpdateImagesStep1';
import { render, fireEvent, waitFor } from '@testing-library/react';
// Adjust the import as per your project structure
import { Dispatch, SetStateAction } from 'react';

// Mock the CreatePost component
// jest.mock('./CreatePost', () => ({
//   CreatePost: ({ setOpenModal, openModal, images }: any) => (
//     <div>
//       <p>Mock CreatePost</p>
//       <p>Images Count: {images.length}</p>
//     </div>
//   ),
// }));

describe('UpdateImagesStep1', () => {
  const mockSetOpenCreatePostModal: Dispatch<SetStateAction<boolean>> = jest.fn();

  it('should allow going back to step 1 from step 2', async () => {
    const { getByTestId } = render(<UpdateImagesStep1 openCreatePostModal={true} setOpenCreatePostModal={mockSetOpenCreatePostModal} />);
    await waitFor(() => expect(getByTestId('step1')));
    // Simulate file upload
    fireEvent.click(getByTestId('openInputBtn'));
    const input = getByTestId('input') as HTMLInputElement;
    const file = new File(['(⌐□_□)'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file] } });

    // Wait for the step to change to 2
    await waitFor(() => expect(getByTestId('step2')));

    // Simulate clicking the "Back" button

    // Verify that we are back in step 1 (the image upload step)
  });
});
