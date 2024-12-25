describe('ViewProfile Page', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/graphql', (req) => {
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
      if (req.body.operationName === 'GetFollowStatus') {
        req.reply({
          data: {
            getFollowStatus: {
              status: 'FOLLOWING',
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

  it('should show the correct follow button state based on followData status', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetFollowStatus') {
        req.reply({
          data: {
            getFollowStatus: {
              status: 'APPROVED',
            },
          },
        });
      }
    }).as('getFollowStatus');
    cy.reload();
    cy.contains('Following').should('be.visible');
  });

  it('should handle public accounts correctly', () => {
    cy.get('[data-cy="public-user"]').should('exist');
  });

  it('should handle private accounts correctly', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
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

  it('should handle follow button state when clicked (PENDING)', () => {
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

  it('should handle follow button state when clicked (APPROVED)', () => {
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
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'SendFollowReq') {
        req.reply({
          errors: [{ message: 'Error sending follow request' }],
        });
      }
    }).as('sendFollowReqError');
    cy.contains('Follow').should('be.visible').click();
    cy.wait('@sendFollowReqError');
    cy.contains('Follow').should('be.visible');
    cy.log('Error sending follow request');
  });
  it('should handle follow status for different account visibility', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetFollowStatus') {
        req.reply({
          data: {
            getFollowStatus: {
              status: 'PENDING',
            },
          },
        });
      }
    }).as('getFollowStatusPending');
    cy.reload();
    cy.contains('Requested').should('be.visible');
  });
});
