// cypress/e2e/otherUser.cy.ts

describe('OtherUser Page', () => {
  const userName = 'testuser';

  beforeEach(() => {
    // Intercept GraphQL requests
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        // 👇 Custom mock өгч болно
        if (req.alias === 'error') {
          req.reply({ errors: [{ message: 'Something went wrong' }] });
        } else if (req.alias === 'notFound') {
          req.reply({ data: { getUserByUsername: null } });
        } else {
          req.reply({
            data: {
              getUserByUsername: {
                __typename: 'User',
                _id: '123',
                userName,
                fullName: 'Test User',
                bio: 'This is a test bio',
                profileImage: null,
                isPrivate: false,
                isVerified: false,
                followers: [],
                followings: [],
                posts: [{ _id: 'p1' }, { _id: 'p2' }],
              },
            },
          });
        }
      }
    }).as('getUserByUsername');
  });

  it('should show loading state', () => {
    cy.visit(`/${userName}`);
    cy.contains('Loading...').should('exist');
  });

  it('should show error state', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({ errors: [{ message: 'Something went wrong' }] });
      }
    }).as('getUserByUsernameError');

    cy.visit(`/${userName}`);
    cy.contains('Error: Something went wrong').should('exist');
  });

  it('should show user not found', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({ data: { getUserByUsername: null } });
      }
    }).as('getUserByUsernameNotFound');

    cy.visit(`/${userName}`);
    cy.contains('User not found').should('exist');
  });

  it('should render user profile when data exists', () => {
    cy.visit(`/${userName}`);

    cy.wait('@getUserByUsername');
    cy.contains('Test User').should('exist'); // fullName
    cy.contains('POSTS').should('exist');
  });

  it('should show private account message when user is private', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({
          data: {
            getUserByUsername: {
              __typename: 'User',
              _id: '123',
              userName,
              fullName: 'Private User',
              bio: '',
              profileImage: null,
              isPrivate: true,
              isVerified: false,
              followers: [],
              followings: [],
              posts: [],
            },
          },
        });
      }
    }).as('getPrivateUser');

    cy.visit(`/${userName}`);
    cy.contains('This account is private').should('exist');
  });
});
