// import { render, screen, fireEvent } from '@testing-library/react';
// import { useGetPostByPostIdQuery, useUpdatePostMutation } from '@/generated';
// import '@testing-library/jest-dom';
// import { UpdatePost } from '@/app/(main)/_components/UpdatePost';

// jest.mock('@/generated', () => ({
//   useGetPostByPostIdQuery: jest.fn(),
//   useUpdatePostMutation: jest.fn(),
// }));

// describe('UpdatePost Component', () => {
//   const setOpenUpdateModalMock = jest.fn();
//   const mockUpdatePost = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();

//     (useGetPostByPostIdQuery as jest.Mock).mockReturnValue({
//       data: {
//         getPostByPostId: {
//           _id: 'post123',
//           description: 'Original description',
//           images: ['/test-image.jpg'],
//           user: {
//             userName: 'John Doe',
//             profileImg: '/profile.jpg',
//           },
//         },
//       },
//     });

//     (useUpdatePostMutation as jest.Mock).mockReturnValue([mockUpdatePost]);
//   });

//   it('renders the modal with correct data', () => {
//     render(<UpdatePost id="post123" setOpenUpdateModal={setOpenUpdateModalMock} openUpdateModal={true} />);

//     expect(screen.getByText('Edit a post'));
//     expect(screen.getByPlaceholderText('Description ...'));
//     expect(screen.getByText('John Doe'));
//     expect(screen.getByAltText('img'));
//   });

//   it('allows the user to edit the description', () => {
//     render(<UpdatePost id="post123" setOpenUpdateModal={setOpenUpdateModalMock} openUpdateModal={true} />);

//     const input = screen.getByTestId('input');
//     fireEvent.change(input, { target: { value: 'Updated description' } });

//     expect(input);
//   });

//   it('calls updatePost mutation and closes the modal on edit', async () => {
//     render(<UpdatePost id="post123" setOpenUpdateModal={setOpenUpdateModalMock} openUpdateModal={true} />);

//     const editButton = screen.getByTestId('createBtn');
//     const input = screen.getByTestId('input');

//     fireEvent.change(input, { target: { value: 'Updated description' } });
//     fireEvent.click(editButton);
//   });

//   it('closes the modal when close button is clicked', () => {
//     render(<UpdatePost id="post123" setOpenUpdateModal={setOpenUpdateModalMock} openUpdateModal={true} />);

//     const closeButton = screen.getByTestId('closeModalBtn');
//     fireEvent.click(closeButton);

//     expect(setOpenUpdateModalMock);
//   });
// });
