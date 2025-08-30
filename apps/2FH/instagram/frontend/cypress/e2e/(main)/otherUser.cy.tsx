describe('OtherUser Page', () => {
  interface UserData {
    userName: string;
    fullName: string;
    bio?: string;
    profileImage?: string;
    isVerified?: boolean;
    isPrivate?: boolean;
    followers?: Array<{ userName: string }>;
    followings?: Array<{ userName: string }>;
  }
  const createMockUser = (userData: UserData) => {
    const defaults = {
      _id: '123',
      bio: 'Test bio',
      profileImage: '/demo.png',
      isVerified: false,
      isPrivate: false,
      followers: [],
      followings: [],
    };
    return { ...defaults, ...userData };
  };
  const interceptUserQuery = (userData: UserData | null) => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername' || req.body.query.includes('getUserByUsername')) {
        req.reply({ body: { data: { getUserByUsername: userData } } });
      }
    }).as('getUserQuery');
  };
  beforeEach(() => {
    window.localStorage.setItem('user', JSON.stringify({ _id: 'current-user-id', userName: 'me' }));
  });
  it('renders loading state', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername' || req.body.query.includes('getUserByUsername')) {
        req.reply({ delay: 1000, body: { data: { getUserByUsername: null } } });
      }
    }).as('getUserQuery');
    cy.visit('/someUser');
    cy.contains('Loading...', { timeout: 2000 });
  });
  it('renders user not found', () => {
    interceptUserQuery(null);
    cy.visit('/someUser');
    cy.contains('User not found', { timeout: 10000 });
  });
  it('renders public user profile', () => {
    interceptUserQuery(
      createMockUser({
        userName: 'otherUser',
        fullName: 'Other User',
        bio: 'Hello, this is bio',
        isVerified: true,
      })
    );
    cy.visit('/otherUser');
    cy.contains('otherUser', { timeout: 10000 });
    cy.contains('Other User');
    cy.contains('Hello, this is bio');
    cy.contains('posts');
    cy.contains('following');
    cy.get('button').contains('Follow');
  });
  it('renders private user (not following)', () => {
    interceptUserQuery(
      createMockUser({
        userName: 'privateUser',
        fullName: 'Private User',
        bio: 'Secret',
        isPrivate: true,
      })
    );
    cy.visit('/privateUser');
    cy.contains('This account is private', { timeout: 10000 });
    cy.contains('Follow to see their photos and videos');
  });
  it('renders user profile without waiting for specific requests', () => {
    interceptUserQuery(
      createMockUser({
        userName: 'testUser',
        fullName: 'Test User',
      })
    );
    cy.visit('/testUser');
    cy.contains('testUser', { timeout: 15000 }).should('be.visible');
    cy.contains('Test User').should('be.visible');
    cy.contains('posts').should('be.visible');
  });
  it('renders error state', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetUserByUsername' || req.body.query.includes('getUserByUsername')) {
        req.reply({ forceNetworkError: true });
      }
    }).as('getUserQuery');
    cy.visit('/errorUser');
    cy.contains('Error:', { timeout: 10000 });
  });
  it('renders user with followers and following', () => {
    interceptUserQuery(
      createMockUser({
        userName: 'popularUser',
        fullName: 'Popular User',
        bio: 'I have followers',
        isVerified: true,
        followers: [{ userName: 'me' }, { userName: 'other1' }, { userName: 'other2' }],
        followings: [{ userName: 'friend1' }, { userName: 'friend2' }],
      })
    );
    cy.visit('/popularUser');
    cy.contains('3').should('be.visible');
    cy.contains('2').should('be.visible');
    cy.contains('posts').should('be.visible');
  });
  it('renders user without current user in localStorage', () => {
    cy.clearLocalStorage();
    interceptUserQuery(
      createMockUser({
        userName: 'noCurrentUser',
        fullName: 'No Current User',
      })
    );
    cy.visit('/noCurrentUser');
    cy.contains('noCurrentUser', { timeout: 10000 }).should('be.visible');
    cy.contains('No Current User').should('be.visible');
  });
  it('renders private user that current user is following', () => {
    interceptUserQuery(
      createMockUser({
        userName: 'privateFollowingUser',
        fullName: 'Private Following User',
        bio: 'Private but followed',
        isPrivate: true,
        followers: [{ userName: 'me' }],
      })
    );
    cy.visit('/privateFollowingUser');
    cy.contains('POSTS', { timeout: 10000 }).should('be.visible');
    cy.contains('privateFollowingUser').should('be.visible');
  });
  it('renders user with non-http profile image', () => {
    interceptUserQuery(
      createMockUser({
        userName: 'invalidImageUser',
        fullName: 'Invalid Image User',
        profileImage: 'invalid-image-url',
      })
    );
    cy.visit('/invalidImageUser');
    cy.contains('invalidImageUser', { timeout: 10000 }).should('be.visible');
    cy.contains('Invalid Image User').should('be.visible');
  });
});
