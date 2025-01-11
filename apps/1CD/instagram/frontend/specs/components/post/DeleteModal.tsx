// import { fireEvent, render } from '@testing-library/react';
// import { MockedProvider, MockedResponse } from '@apollo/client/testing';
// import { DeleteModal } from '@/components/post/DeleteModal';
// import { DeletePostDocument } from '@/generated';

// const deletePostMock: MockedResponse = {
//   request: {
//     query: DeletePostDocument,
//     variables: {
//       _id: '123',
//     },
//   },
//   result: {
//     data: {
//       deletePost: {
//         _id: '123',
//       },
//     },
//   },
// };

// describe('DeletePostModal', () => {
//   const setOpenDeleteModal = jest.fn();
//   it('should render succes delete', async () => {
//     const { getByTestId } = render(
//       <MockedProvider mocks={[deletePostMock]} addTypename={false}>
//         <DeleteModal setOpenDeleteModal={jest.fn()} openDeleteModal={true} id="123" />
//       </MockedProvider>
//     );

//     const modalBtn = getByTestId('delete-post-btn');

//     fireEvent.click(modalBtn);
//     (setOpenDeleteModal as jest.Mock).mockReturnValue(true);
//     const cancelBtn = getByTestId('cancel-btn');

//     fireEvent.click(cancelBtn);
//     // await waitFor(() => expect(getByText('Delete')));
//     // const modal = getByTestId('modalCancel');
//     // fireEvent.keyDown(modal, { key: 'Enter' });
//   });
// });

// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom'; // for extended DOM matchers

// import { MockedProvider } from '@apollo/client/testing'; // For mocking Apollo Client
// import { DeletePostDocument } from '@/generated'; // Update with the actual mutation import
// import { DeleteModal } from '@/components/post/DeleteModal';

// describe('DeleteModal Component', () => {
//   const mockDeletePost = jest.fn();

//   const mocks = [
//     {
//       request: {
//         query: DeletePostDocument,
//         variables: { _id: 'test-id' },
//       },

//       result: () => {
//         mockDeletePost();
//         return { data: { deletePost: { success: true } } };
//       },
//     },
//   ];

//   const setup = (open: boolean, id: string) => {
//     const setOpenDeleteModal = jest.fn();
//     render(
//       <MockedProvider mocks={mocks} addTypename={false}>
//         <DeleteModal setOpenDeleteModal={setOpenDeleteModal} openDeleteModal={open} id={id} />
//       </MockedProvider>
//     );
//     return { setOpenDeleteModal };
//   };

//   test('renders delete modal with the correct content', () => {
//     setup(true, 'test-id');
//     expect(screen.getByTestId('open-delete-modal'));
//     // expect(screen.getByText('Delete post?test-id'));
//     expect(screen.getByText('Are you sure you want to delete this post?'));
//   });

//   test('closes modal when cancel button is clicked', () => {
//     const { setOpenDeleteModal } = setup(true, 'test-id');
//     fireEvent.click(screen.getByTestId('cancel-btn'));
//     expect(setOpenDeleteModal);
//   });

//   test('calls delete mutation when delete button is clicked', async () => {
//     const { setOpenDeleteModal } = setup(true, 'test-id');

//     fireEvent.click(screen.getByTestId('delete-post-btn'));

//     // Ensure the loading state is shown
//     expect(screen.getByText('Loading ...'));

//     // Wait for the mutation to complete
//     await waitFor(() => expect(mockDeletePost));

//     // Verify modal is closed
//     await waitFor(() => expect(setOpenDeleteModal));
//   });
// });
