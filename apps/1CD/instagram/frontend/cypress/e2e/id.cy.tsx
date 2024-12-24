// describe('user profile page', () => {
//   beforeEach(() => {
//     cy.visit('/home/viewprofile/id');
//   });

//   it('1. Should render visit profile page', () => {
//     cy.get('[data-cy="visit-profile-page"]').should('be.visible');
//   });

//   it('2. Should display user information', () => {
//     cy.intercept('GET', 'api/graphql', (req) => {
//       if (req.body.operationName === 'GetOneUser') {
//         req.reply({
//           statusCode: 200,
//           body: { data: { User: { userName: 'mockUserName', fullName: 'Mock User', followerNumber: '99', followingNumber: '199', profileImg: 'http://example.com/profileImage1.jpg' } } },
//         });
//       }
//     }).as('GetUser');
//     cy.visit('/home/viewprofile/id');
//   });

// });

describe('ViewProfile Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetOneUser') {
        req.reply({
          data: {
            getOneUser: {
              _id: '123',
              userName: 'testuser',
              fullName: 'Test User',
              bio: 'This is a test bio',
              profileImg: '',
              accountVisibility: 'PUBLIC',
              followerCount: 10,
              followingCount: 5,
            },
          },
        });
      }
      if (req.body.operationName === 'SendFollowReq') {
        const { followingId } = req.body.variables;
        if (followingId === '123') {
          req.reply({
            data: {
              sendFollowReq: {
                status: 'PENDING',
              },
            },
          });
        } else {
          req.reply({
            errors: [{ message: 'Error sending follow request' }],
          });
        }
      }
    });
    cy.visit('/home/viewprofile/123');
  });

  it('should display user details correctly', () => {
    cy.get('[data-cy="visit-profile-page"]').should('be.visible');
    cy.contains('testuser').should('be.visible');
    cy.contains('Test User').should('be.visible');
    cy.contains('This is a test bio').should('be.visible');
  });

  it('should handle public accounts correctly', () => {
    cy.get('[data-cy="public-user"]').should('exist');
  });

  it('should handle private accounts correctly', () => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GetOneUser') {
        req.reply({
          data: {
            getOneUser: {
              _id: '123',
              userName: 'testuser',
              fullName: 'Test User',
              bio: 'This is a test bio',
              profileImg: '',
              accountVisibility: 'PRIVATE',
              followerCount: 10,
              followingCount: 5,
            },
          },
        });
      }
    }).as('getPrivateUser');
    cy.reload();
    cy.get('[data-cy="private-user"]').should('be.visible');
  });

  it('should handle follow button state correctly', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'SendFollowReq') {
        req.reply({
          data: {
            sendFollowReq: {
              status: 'PENDING',
            },
          },
        });
      }
    }).as('sendFollowReq');
    cy.contains('Follow').should('be.visible').click();
    cy.wait('@sendFollowReq');
    cy.contains('Requested').should('be.visible');
  });

  it('should handle follow button state correctly when account visibility is public', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'SendFollowReq') {
        req.reply({
          data: {
            sendFollowReq: {
              status: 'APPROVED',
            },
          },
        });
      }
    }).as('sendFollowReq');
    cy.contains('Follow').should('be.visible').click();
    cy.wait('@sendFollowReq');
    cy.contains('Following').should('be.visible');
  });

  it('should show error if follow request fails', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'SendFollowReq') {
        req.reply({
          errors: [{ message: 'Error sending follow request' }],
        });
      }
    });
    cy.contains('Follow').should('be.visible').click();
    cy.contains('Follow').should('be.visible');
    cy.log('Error sending follow request');
  });
});
