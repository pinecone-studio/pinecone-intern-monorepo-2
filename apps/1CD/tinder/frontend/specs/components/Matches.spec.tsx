// import '@testing-library/jest-dom';
// import { render, screen, waitFor } from '@testing-library/react';
// import { useMatchedUsersContext, MatchProvider } from '@/components/providers/MatchProvider';


// import { MockedProvider } from '@apollo/client/testing';
// import { GET_MATCHEDUSERS } from '@/graphql/chatgraphql';

// // Mock the useQuery hook from Apollo Client
// jest.mock('@apollo/client', () => ({
//   ...jest.requireActual('@apollo/client'),
//   useQuery: jest.fn(),
// }));

// // Helper component to wrap the useMatchedUsersContext hook and render the UI
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

//     render(
//       <MockedProvider mocks={[mockedData]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     // Wait for the data to load
//     await waitFor(() => screen.getByText('Matched Users'));

//     // Ensure the matched users are displayed
//     expect(screen.getByText('User 1')).toBeInTheDocument();
//     expect(screen.getByText('User 2')).toBeInTheDocument();
//   });

//   it('shows loading state when data is loading', () => {
//     // Mock loading state
//     const mockedLoading = {
//       request: {
//         query: GET_MATCHEDUSERS,
//       },
//       result: {
//         data: null,
//       },
//       error: new Error('Data not loaded'),
//     };

//     useQuery.mockReturnValue({
//       loading: true,
//       data: null,
//       error: null,
//       refetch: jest.fn(),
//     });

//     render(
//       <MockedProvider mocks={[mockedLoading]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     // Ensure that loading state is shown
//     expect(screen.getByText('Loading...')).toBeInTheDocument();
//   });

//   it('shows error message when there is an error', async () => {
//     const mockedError = {
//       request: {
//         query: GET_MATCHEDUSERS,
//       },
//       result: {},
//       error: new Error('Error occurred'),
//     };

//     useQuery.mockReturnValue({
//       loading: false,
//       data: null,
//       error: { message: 'Error occurred' },
//       refetch: jest.fn(),
//     });

//     render(
//       <MockedProvider mocks={[mockedError]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     // Ensure that error message is shown
//     await waitFor(() => screen.getByText('Error occurred: Error occurred'));
//     expect(screen.getByText('Error occurred: Error occurred')).toBeInTheDocument();
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

//     render(
//       <MockedProvider mocks={[mockedEmptyData]} addTypename={false}>
//         <MatchProvider>
//           <TestComponent />
//         </MatchProvider>
//       </MockedProvider>
//     );

//     // Ensure that "No matches found" is displayed
//     await waitFor(() => screen.getByText('No matches found'));
//     expect(screen.getByText('No matches found')).toBeInTheDocument();
//   });
// });
