// import { fireEvent, render } from '@testing-library/react';
// import { MockedProvider } from '@apollo/client/testing';
// import { CreatePostDocument, GetUserDocument } from '@/generated';
// import { CreatePost } from '@/components/post/CreatePost';

// const createPostMock = [
//   {
//     request: {
//       query: GetUserDocument,
//     },
//     result: {
//       data: {
//         getUser: {
//           _id: '123',
//           userName: 'test',
//           profileImg: 'http://img1',
//         },
//       },
//     },
//   },
//   {
//     request: {
//       query: CreatePostDocument,
//       variables: {
//         user: '123',
//         images: ['http://img1'],
//         description: 'test desc',
//       },
//     },
//     result: {
//       data: {
//         createPost: {
//           _id: '123',
//         },
//       },
//     },
//   },
// ];

// describe('CreatePost', () => {
//   const mockSetOpenModal = jest.fn();
//   it('should render succes CreatePost', async () => {
//     const { getByTestId } = render(
//       <MockedProvider mocks={createPostMock} addTypename={false}>
//         <CreatePost setOpenModal={mockSetOpenModal} openModal={true} images={['http://img1']} setStep={jest.fn()} loading={true} setLoading={jest.fn()} />
//       </MockedProvider>
//     );

//     const input = getByTestId('input') as HTMLInputElement;

//     fireEvent.change(input, { target: { value: 'test desc' } });
//     fireEvent.click(getByTestId('createBtn'));
//   });
//   it('should render succes CreatePost', async () => {
//     const { getByTestId } = render(
//       <MockedProvider mocks={createPostMock} addTypename={false}>
//         <CreatePost setOpenModal={jest.fn()} openModal={true} images={['http://img1']} setStep={jest.fn()} loading={true} setLoading={jest.fn()} />
//       </MockedProvider>
//     );

//     fireEvent.click(getByTestId('closeModalBtn'));
//   });
// });
