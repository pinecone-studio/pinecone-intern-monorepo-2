describe('user profile page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetUser') {
        req.reply({
          statusCode: 200,
          body: {
            data: { user: { _id: 'number', userName: 'mockUserName', fullName: 'Mock User', followerNumber: '99', followingNumber: '199', profileImg: 'http://example.com/profileImage1.jpg' } },
          },
        });
      }
    }).as('GetUser');
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetMyPosts') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              MyPosts: [{ image: ['http://example.com/image11.jpg', 'http://example.com/image12.jpg'], description: 'zuragtai example post' }],
            },
          },
        });
      }
    }).as('GetMyPosts');
    cy.visit('/home/erdek');
  });

  it.only('1. Should render user profile page', () => {
    cy.get('[data-cy="user-profile-page"]').should('be.visible');
  });

  it.only('2. Should display user information', () => {
    cy.get('[data-cy="pro-image"]').should('be.visible', 'http://example.com/profileImage1.jpg');
    cy.get('[data-cy="username"]').should('contain', 'mockUserName');
    cy.get('[data-cy="followerNumber"]').should('contain', 99);
    cy.get('[data-cy="followingNumber"]').should('contain', 199);
    cy.get('[data-cy="fullname"]').should('contain.text', 'Mock User');
  });

  it('3. Should display posts when fetch post successfully', () => {
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

  it('5. Should handle image then upload and save data', () => {
    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/dka8klbhn/image/upload', (req) => {
      if (req.body.operationName === 'changeProfileImg') {
        req.reply({ statusCode: 200, body: { secure_url: 'http://example.com/profileImage11.jpg' } });
      }
    }).as('changeProfileImg');
    cy.get('[data-cy="image-upload-input"]').selectFile('/Users/24LP7729/Desktop/pinecone-intern-1CD-monorepo/apps/1CD/instagram/frontend/public/images/Logo.png');

    cy.visit('/home/erdek');
    // cy.wait('@changeProfileImg');
    // cy.get('[data-cy="pro-image"]').should('have.attr', 'src', 'http://example.com/profileImage11.jpg');
  });
});
