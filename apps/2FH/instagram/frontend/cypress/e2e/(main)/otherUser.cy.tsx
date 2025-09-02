describe('OtherUser Page', () => {
  const userName = 'testuser';
  const mockUserData = (overrides = {}) => ({
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
    ...overrides,
  });
  const setupAuth = () => {
    cy.window().then((win) => {
      win.localStorage.setItem('user', JSON.stringify({ _id: 'currentUserId' }));
      win.localStorage.setItem('token', 'test-token');
    });
  };
  beforeEach(() => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        if (req.alias === 'error') req.reply({ errors: [{ message: 'Something went wrong' }] });
        else if (req.alias === 'notFound') req.reply({ data: { getUserByUsername: null } });
        else req.reply({ data: { getUserByUsername: mockUserData() } });
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
    cy.contains('Test User').should('exist');
    cy.contains('POSTS').should('exist');
  });
  it('should show private account message when user is private', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({ data: { getUserByUsername: mockUserData({ isPrivate: true, posts: [] }) } });
      }
    }).as('getPrivateUser');
    cy.visit(`/${userName}`);
    cy.contains('This account is private').should('exist');
  });
  it('should handle following state correctly', () => {
    setupAuth();
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({
          data: {
            getUserByUsername: mockUserData({
              fullName: 'Followed User',
              bio: 'This user is being followed',
              followers: [{ _id: 'currentUserId', userName: 'currentuser', profileImage: null }],
              posts: [{ _id: 'p1' }],
            }),
          },
        });
      }
    }).as('getFollowedUser');
    cy.visit(`/${userName}`);
    cy.wait('@getFollowedUser');
    cy.contains('Followed User').should('exist');
    cy.contains('POSTS').should('exist');
  });
  it('should show posts for private user when current user is following', () => {
    setupAuth();
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({
          data: {
            getUserByUsername: mockUserData({
              fullName: 'Private Followed User',
              bio: 'This private user is being followed',
              isPrivate: true,
              followers: [{ _id: 'currentUserId', userName: 'currentuser', profileImage: null }],
            }),
          },
        });
      }
    }).as('getPrivateFollowedUser');
    cy.visit(`/${userName}`);
    cy.wait('@getPrivateFollowedUser');
    cy.contains('Private Followed User').should('exist');
    cy.wait(1000);
    cy.contains('POSTS').should('exist');
    cy.contains('This account is private').should('not.exist');
  });
  it('should display profile image when user has one', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({
          data: {
            getUserByUsername: mockUserData({
              fullName: 'User With Image',
              bio: 'This user has a profile image',
              profileImage: 'https://example.com/profile.jpg',
            }),
          },
        });
      }
    }).as('getUserWithImage');
    cy.visit(`/${userName}`);
    cy.wait('@getUserWithImage');
    cy.contains('User With Image').should('exist');
    cy.contains('POSTS').should('exist');
    cy.get('img[alt="testuser profile picture"]').should('exist');
  });
  it('should fall back to demo image when profile image is invalid', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply({
          data: {
            getUserByUsername: mockUserData({
              fullName: 'User With Invalid Image',
              bio: 'This user has an invalid profile image',
              profileImage: 'invalid-image-path',
            }),
          },
        });
      }
    }).as('getUserWithInvalidImage');
    cy.visit(`/${userName}`);
    cy.wait('@getUserWithInvalidImage');
    cy.contains('User With Invalid Image').should('exist');
    cy.contains('POSTS').should('exist');
    cy.get('img[alt="testuser profile picture"]').should('exist');
  });
});
