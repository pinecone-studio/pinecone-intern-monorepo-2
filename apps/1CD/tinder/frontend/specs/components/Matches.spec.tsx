// import { render, screen, waitFor } from '@testing-library/react';
// import { MockedProvider } from '@apollo/client/testing';
// import { useMatchedUsersContext, MatchProvider } from '../../src/components/providers/MatchProvider';
// import { useQuery } from '@apollo/client';
// import { GET_MATCHEDUSERS } from '@/graphql/chatgraphql';



// jest.mock('@apollo/client', () => ({
//   ...jest.requireActual('@apollo/client'),
//   useQuery: jest.fn(),
// }));


// const TestComponent = () => {
//   const { matchedData, matchloading, matcherror } = useMatchedUsersContext();
  
//   if (matchloading) {
//     return <div>Loading...</div>;
//   }
  
//   if (matcherror) {
//     return <div>Error occurred: {matcherror.message}</div>;
//   }

//   if (!matchedData || matchedData.length === 0) {
//     return <div>No matches found</div>;
//   }

//   return (
//     <div>
//       <h1>Matched Users</h1>
//       {matchedData.map(user => (
//         <div key={user._id}>{user.name}</div>
//       ))}
//     </div>
//   );
// };

// describe('MatchProvider and useMatchedUsersContext', () => {

//   it('renders matched users when data is fetched successfully', async () => {
//     const mockedData = {
//       request: {
//         query: GET_MATCHEDUSERS,
//       },
//       result: {
//         data: {
//           getMatch: [
//             { _id: '123', name: 'User 1', age: 30, profession: 'Engineer' },
//             { _id: '456', name: 'User 2', age: 25, profession: 'Designer' },
//           ],
//         },
//       },
//     };

//     (useQuery as jest.Mock).mockReturnValueOnce({
//       loading: false,
//       data: mockedData.result.data,
//       error: null,
//     });

//     render(
//       <MockedProvider mocks={[mockedData]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     await waitFor(() => screen.getByText('Matched Users'));

//     expect(screen.getByText('User 1'));
//     expect(screen.getByText('User 2'));
//   });

//   it('shows loading state when data is loading', () => {
//     // Mock loading state
//     (useQuery as jest.Mock).mockReturnValueOnce({
//       loading: true,
//       data: null,
//       error: null,
//     });

//     render(
//       <MockedProvider mocks={[]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     expect(screen.getByText('Loading...'));
//   });

//   it('shows error message when there is an error', async () => {
//     const mockedError = {
//       request: {
//         query: GET_MATCHEDUSERS,
//       },
//       result: {},
//       error: new Error('Error occurred'),
//     };

//     (useQuery as jest.Mock).mockReturnValueOnce({
//       loading: false,
//       data: null,
//       error: { message: 'Error occurred' },
//     });

//     render(
//       <MockedProvider mocks={[mockedError]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     await waitFor(() => screen.getByText('Error occurred: Error occurred'));
//     expect(screen.getByText('Error occurred: Error occurred'));
//   });

//   it('shows no matches found when matchedData is empty or null', async () => {
//     const mockedEmptyData = {
//       request: {
//         query: GET_MATCHEDUSERS,
//       },
//       result: {
//         data: {
//           getMatch: [],
//         },
//       },
//     };

//     (useQuery as jest.Mock).mockReturnValueOnce({
//       loading: false,
//       data: mockedEmptyData.result.data,
//       error: null,
//     });

//     render(
//       <MockedProvider mocks={[mockedEmptyData]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     await waitFor(() => screen.getByText('No matches found'));
//     expect(screen.getByText('No matches found'));
//   });
// });
