/* eslint-disable */
// describe('ViewProfile Page', () => {
//   beforeEach(() => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'GetOneUser') {
//         req.reply({
//           data: {
//             getOneUser: {
//               _id: '123',
//               userName: 'testuser',
//               fullName: 'Test User',
//               bio: 'This is a test bio',
//               profileImg: '',
//               accountVisibility: 'PUBLIC',
//               followerCount: 10,
//               followingCount: 5,
//             },
//           },
//         });
//       }
//       if (req.body.operationName === 'GetFollowStatus') {
//         req.reply({
//           data: {
//             getFollowStatus: {
//               status: 'FOLLOWING',
//             },
//           },
//         });
//       }
//       if (req.body.operationName === 'SendFollowReq') {
//         const { followingId } = req.body.variables;
//         if (followingId === '123') {
//           req.reply({
//             data: {
//               sendFollowReq: {
//                 status: 'PENDING',
//               },
//             },
//           });
//         } else {
//           req.reply({
//             errors: [{ message: 'Error sending follow request' }],
//           });
//         }
//       }
//     }).as('graphql');
//     cy.visit('/home/viewprofile/123');
//   });

//   it('should display user details correctly', () => {
//     cy.get('[data-cy="visit-profile-page"]').should('be.visible');
//     cy.contains('testuser').should('be.visible');
//     cy.contains('Test User').should('be.visible');
//     cy.contains('This is a test bio').should('be.visible');
//   });

//   it('should show the follow button state as "Following" for approved status', () => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'GetFollowStatus') {
//         req.reply({
//           data: {
//             getFollowStatus: {
//               status: 'APPROVED',
//             },
//           },
//         });
//       }
//     }).as('getFollowStatusApproved'); // Alias for easier debugging

//     cy.reload(); // Reload after intercept setup
//     cy.wait('@getFollowStatusApproved'); // Wait for the intercept to ensure data is applied
//     cy.contains('Following').should('be.visible'); // Verify the button state
//   });

//   it('should show the follow button state as "Requested" for pending status', () => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'GetFollowStatus') {
//         req.reply({
//           data: {
//             getFollowStatus: {
//               status: 'PENDING',
//             },
//           },
//         });
//       }
//     }).as('getFollowStatusPending');
//     cy.reload();
//     cy.contains('Requested').should('be.visible');
//   });

//   // it('should handle follow button state when clicked and update to "Requested"', () => {
//   //   cy.contains('Follow').should('be.visible').click();
//   //   cy.wait('@graphql');
//   //   cy.contains('Requested').should('be.visible');
//   // });

//   it('should handle follow button state when clicked and update to "Following"', () => {
//     // Intercept the SendFollowReq request
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'SendFollowReq') {
//         setTimeout(() => {
//           req.reply({
//             data: {
//               sendFollowReq: {
//                 status: 'APPROVED',
//               },
//             },
//           });
//         }, 500); // Mock a delay
//       }
//     }).as('sendFollowReq');
//     // Alias for easier debugging

//     // Ensure the "Follow" button is visible and click it
//     cy.contains('Follow').should('be.visible').click();

//     // Wait for the intercepted request to complete
//     cy.wait('@sendFollowReq');

//     // Verify the button state updates to "Following"
//     cy.contains('Following').should('be.visible');
//   });

//   it('should show error if follow request fails', () => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'SendFollowReq') {
//         req.reply({
//           errors: [{ message: 'Error sending follow request' }],
//         });
//       }
//     }).as('sendFollowReqError');
//     cy.contains('Follow').click();
//     cy.wait('@sendFollowReqError');
//     cy.contains('Follow').should('be.visible');
//     cy.log('Error sending follow request');
//   });

//   it('should display public user profile section', () => {
//     cy.get('[data-cy="public-user"]').should('exist');
//   });

//   it('should display private user profile section', () => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'GetOneUser') {
//         req.reply({
//           data: {
//             getOneUser: {
//               _id: '123',
//               userName: 'testuser',
//               fullName: 'Test User',
//               bio: 'This is a test bio',
//               profileImg: '',
//               accountVisibility: 'PRIVATE',
//               followerCount: 10,
//               followingCount: 5,
//             },
//           },
//         });
//       }
//     }).as('getPrivateUser');
//     cy.reload();
//     cy.get('[data-cy="private-user"]').should('be.visible');
//   });

//   it('should handle unfollow button logic and update to "Follow"', () => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'Unfollow') {
//         req.reply({
//           data: {
//             unfollow: true,
//           },
//         });
//       }
//       if (req.body.operationName === 'GetFollowStatus') {
//         req.reply({
//           data: {
//             getFollowStatus: null,
//           },
//         });
//       }
//     }).as('unfollowUser');
//     cy.contains('Following').click();
//     cy.wait('@unfollowUser');
//     cy.contains('Follow').should('be.visible');
//   });

//   it('should display error if unfollow request fails', () => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'Unfollow') {
//         req.reply({
//           errors: [{ message: 'Error unfollowing user' }],
//         });
//       }
//     }).as('unfollowError');
//     cy.contains('Following').click();
//     cy.wait('@unfollowError');
//     cy.contains('Following').should('be.visible');
//   });
// });
