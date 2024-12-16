describe('user profile page', () => {
  beforeEach(() => {
    cy.visit('/erdek');
  });

  it('1. Should render user profile page', () => {
    cy.get('[data-cy="user-profile-page"]').should('be.visible');
    // cy.get('[data-cy="username"]').should('contain', 'mockUserName');
    // cy.get('[data-cy="postnumber"]').should('contain', '0');
    // cy.get('[data-cy="followerNumber"]').should('contain', '99');
    // cy.get('[data-cy="followingNumber"]').should('contain', '199');
    // cy.get('[data-cy="fullname"]').should('contain', 'Mock User');
    // cy.get('[data-cy="posts"]').should('contain', 'MyPosts');
  });

  // it.only('2. Should display nothiing if unauthorzi user infromation', () => {
  //   cy.intercept('GET', 'api/graphql', (req) => {
  //     if (req.body.operationName === 'GetUser') {
  //       req.reply({ statusCode: 400, body: { errors: { message: 'Error in fetch user information' } } });
  //     }
  //   }).as('GetUser');
  //   cy.visit('/');
  //   cy.contains('Error in fetch user information');

  //   // cy.get('[data-cy="proImage"]').should('have.attr', 'http://example.com/profileImage1.jpg');
  //   // cy.get('[data-cy="username"]').should('contain.text', 'mockUserName');
  //   // cy.get('[data-cy="fullname"]').should('contain', 'Mock User');
  //   // cy.get('[data-cy="followerNumber"]').should('contain', '99');
  //   // cy.get('[data-cy="followingNumber"]').should('contain', '199');
  //   // cy.get('[data-cy="postnumber"]').should('contain', '0');
  // });
  // it('2. Should render upload profile image modal', () => {
  //   cy.get('[data-cy="proImage"]').click();
  //   cy.contains('[data-cy="user-profile-upload-image"]');
  // });

  it('2. Should display user information', () => {
    cy.intercept('GET', 'api/gra[hql', (req) => {
      if (req.body.operationName === 'GetUser') {
        req.reply({
          statusCode: 200,
          body: { data: { User: { userName: 'mockUserName', fullName: 'Mock User', followerNumber: '99', followingNumber: '199', profileImg: 'http://example.com/profileImage1.jpg' } } },
        });
      }
    }).as('GetUser');
    cy.visit('/erdek');
    // cy.wait('@getUser');
    // cy.get('[data-cy="username"]').should('contain', 'mockUserName');
    // cy.get('[data-cy="proImage"]').should('have.attr', 'http://example.com/profileImage1.jpg');
    // cy.get('[data-cy="followerNumber"]').should('contain', '99');
    // cy.get('[data-cy="followingNumber"]').should('contain', '199');
    // cy.get('[data-cy="fullname"]').should('contain', 'Mock User');
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
    cy.visit('/erdek');
    // cy.wait('@getMyPosts').then(() => {
    //   cy.get('[data-cy="PostNumberDone"]').should('contain', '0');
    //   cy.get('[data-cy="postNoData"]').should('contain', 'MyPosts');
    // });
    // cy.get('[data-cy="PostNumberDone"]').should('contain', '0');
    // cy.get('[data-cy="postNoData"]').should('contain', 'MyPosts');
  });

  it('4. Should display no posts infos when something wrong', () => {
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'getMyPosts') {
        req.reply({ statusCode: 400, body: { errors: { message: 'Something wrong' } } });
      }
    }).as('GetMyPostsQuery');
    cy.visit('/erdek');
    // cy.wait('@getMyPosts');

    cy.get('[data-cy="postnumberError"]').contains('Something wrong').should('be.visible');
    cy.get('[data-cy="postsError"]').contains('Something wrong').should('be.visible');
  });
});
