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
    }).as('GetMyPosts');
    cy.visit('/home/erdek');
    cy.get('[data-cy="myPosts"]').should('be.visible');
  });

  it('4. Should display nopost components when have zero post', () => {
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'getMyPosts') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              MyPosts: [],
            },
          },
        });
      }
    }).as('GetMyPosts');
    cy.visit('/home/erdek');
    cy.get('[data-cy="zeroPost"]').should('be.visible');
  });

  it('5. Should display error statements when something wrong in get posts', () => {
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'getMyPosts') {
        req.reply({ statusCode: 400, body: { errors: { message: 'Something wrong' } } });
      }
    }).as('GetMyPosts');
    cy.visit('/home/erdek');
    // cy.wait('@getMyPosts');

    cy.get('[data-cy="postnumberError"]').contains('Something wrong').should('be.visible');
    cy.get('[data-cy="postsError"]').contains('Something wrong').should('be.visible');
  });
  it('6. Should handle image then upload and save data', () => {
    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/dka8klbhn/image/upload', (req) => {
      if (req.body.operationName === 'changeProfileImg') {
        req.reply({ statusCode: 200, body: { secureUrl: 'http://example.com/profileImage11.jpg' } });
      }
    }).as('changeProfileImg');

    cy.visit('/home/erdek');
  });
});
