describe('user profile page', () => {
  beforeEach(() => {
    cy.visit('/home/erdek');
  });

  it('1. Should render user profile page', () => {
    cy.get('[data-cy="user-profile-page"]').should('be.visible');
  });

  it('2. Should display user information', () => {
    cy.intercept('GET', 'api/gra[hql', (req) => {
      if (req.body.operationName === 'GetUser') {
        req.reply({
          statusCode: 200,
          body: { data: { User: { userName: 'mockUserName', fullName: 'Mock User', followerNumber: '99', followingNumber: '199', profileImg: 'http://example.com/profileImage1.jpg' } } },
        });
      }
    }).as('GetUser');
    cy.visit('/home/erdek');
  });

  it('3. Should display posts when fetch post successfully', () => {
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'getMyPosts') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              MyPosts: [{ image: ['http://example.com/image11.jpg', 'http://example.com/image12.jpg'], description: 'zuragtai example post' }],
            },
          },
        });
      }
    }).as('GetMyPostsQuery');
    cy.visit('/home/erdek');
  });

  it('4. Should display no posts infos when something wrong', () => {
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'getMyPosts') {
        req.reply({ statusCode: 400, body: { errors: { message: 'Something wrong' } } });
      }
    }).as('GetMyPostsQuery');
    cy.visit('/home/erdek');
    // cy.wait('@getMyPosts');

    cy.get('[data-cy="postnumberError"]').contains('Something wrong').should('be.visible');
    cy.get('[data-cy="postsError"]').contains('Something wrong').should('be.visible');
  });
});
