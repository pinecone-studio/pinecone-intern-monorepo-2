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
      win.localStorage.setItem('user', JSON.stringify({ _id: 'currentUserId', userName: 'currentuser' }));
      win.localStorage.setItem('token', 'test-token');
    });
  };

  const setupIntercept = (alias: string, response: any) => {
    cy.intercept('POST', 'https://backend-dev-xi.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername') {
        req.reply(response);
      }
    }).as(alias);
  };

  it('should show loading state', () => {
    setupIntercept('getUserByUsernameDelayed', {
      delay: 2000,
      data: { getUserByUsername: mockUserData() },
    });
    cy.visit(`/${userName}`);
    cy.contains('Loading...').should('exist');
    cy.wait('@getUserByUsernameDelayed');
    cy.contains('Test User').should('exist');
  });

  it('should show error state', () => {
    setupIntercept('getUserByUsernameError', { errors: [{ message: 'Something went wrong' }] });
    cy.visit(`/${userName}`);
    cy.wait('@getUserByUsernameError');
    cy.contains('Error: Something went wrong').should('exist');
  });

  it('should show user not found', () => {
    setupIntercept('getUserByUsernameNotFound', { data: { getUserByUsername: null } });
    cy.visit(`/${userName}`);
    cy.wait('@getUserByUsernameNotFound');
    cy.contains('User not found').should('exist');
  });

  it('should render user profile when data exists', () => {
    setupIntercept('getUserByUsername', { data: { getUserByUsername: mockUserData() } });
    cy.visit(`/${userName}`);
    cy.wait('@getUserByUsername');
    cy.contains('Test User').should('exist');
    cy.contains('POSTS').should('exist');
  });
  it('should show private account message when user is private', () => {
    setupIntercept('getPrivateUser', {
      data: { getUserByUsername: mockUserData({ isPrivate: true, posts: [] }) },
    });
    cy.visit(`/${userName}`);
    cy.wait('@getPrivateUser');
    cy.contains('This account is private').should('exist');
  });
  it('should handle following state correctly', () => {
    setupAuth();
    setupIntercept('getFollowedUser', {
      data: {
        getUserByUsername: mockUserData({
          fullName: 'Followed User',
          bio: 'This user is being followed',
          followers: [{ _id: 'currentUserId', userName: 'currentuser', profileImage: null }],
          posts: [{ _id: 'p1' }],
        }),
      },
    });
    cy.visit(`/${userName}`);
    cy.wait('@getFollowedUser');
    cy.contains('Followed User').should('exist');
    cy.contains('POSTS').should('exist');
  });

  it('should render UserProfile when visiting own profile', () => {
    setupAuth();
    setupIntercept('getOwnUser', {
      data: {
        getUserByUsername: mockUserData({
          _id: 'currentUserId',
          fullName: 'Current User',
        }),
      },
    });
    cy.visit(`/${userName}`);
    cy.wait('@getOwnUser');
    cy.contains(/edit profile/i).should('exist');
  });

  it('should show posts for private user when current user is following', () => {
    setupAuth();
    setupIntercept('getPrivateFollowedUser', {
      data: {
        getUserByUsername: mockUserData({
          fullName: 'Private Followed User',
          bio: 'This private user is being followed',
          isPrivate: true,
          followers: [{ _id: 'currentUserId', userName: 'currentuser', profileImage: null }],
        }),
      },
    });
    cy.visit(`/${userName}`);
    cy.wait('@getPrivateFollowedUser');
    cy.contains('Private Followed User').should('exist');
    cy.contains('POSTS').should('exist');
    cy.contains('This account is private').should('not.exist');
  });

  it('should display profile image when user has one', () => {
    setupIntercept('getUserWithImage', {
      data: {
        getUserByUsername: mockUserData({
          fullName: 'User With Image',
          bio: 'This user has a profile image',
          profileImage: 'https://example.com/profile.jpg',
        }),
      },
    });
    cy.visit(`/${userName}`);
    cy.wait('@getUserWithImage');
    cy.contains('User With Image').should('exist');
    cy.contains('POSTS').should('exist');
    cy.get('img[alt="testuser profile picture"]').should('exist');
  });

  it('should fall back to demo image when profile image is invalid', () => {
    setupIntercept('getUserWithInvalidImage', {
      data: {
        getUserByUsername: mockUserData({
          fullName: 'User With Invalid Image',
          bio: 'This user has an invalid profile image',
          profileImage: 'invalid-image-path',
        }),
      },
    });
    cy.visit(`/${userName}`);
    cy.wait('@getUserWithInvalidImage');
    cy.contains('User With Invalid Image').should('exist');
    cy.contains('POSTS').should('exist');
    cy.get('img[alt="testuser profile picture"]').should('exist');
  });
});
