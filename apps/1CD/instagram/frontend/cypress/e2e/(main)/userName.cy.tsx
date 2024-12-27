describe('user profile page', () => {
  beforeEach(() => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzUyODE5NDR9.Y7gyHVFOxBNF4RvCDa5Efj8hxOf-uOB3e3z7m428Bw0';
    const location = 'http://localhost:4201/home';
    cy.loginWithFakeToken(location, token);
    cy.visit('/home/mery');
  });

  it('1. Should render user profile page', () => {
    // cy.get('[data-cy="user-profile-page"]').should('be.visible');
    cy.get('[data-cy="username"]').should('contain.text', 'mery');
    cy.get('[data-cy="fullname"]').should('contain.text', 'mery');
    cy.get('[data-cy="postNumberDone"]').should('contain.text', '');
    cy.get('[data-cy="followerNum"]').should('contain.text', '0');
    // cy.get('[data-cy="myPosts"] section').should('have.length', 2);
  });

  it('2. Should display posts when fetch post successfully', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMyPosts') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getMyPosts: [],
            },
          },
        });
      }
    });

    cy.get('[data-cy="postNumberDone"]').should('have.text', '0');
    cy.get('[data-cy="myPosts"]').should('be.visible');
    cy.get('[data-cy="myPost"]').should('have.length', 1);
    cy.get('[data-cy="myPost"]').each(($post, index) => {
      const images = ['https://example.com/image.jpg'];
      cy.wrap($post).find('img').should('have.attr', 'src').and('include', encodeURIComponent(images[index]));
    });
  });

  it('3. Should display nopost components when have zero post', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetMyPosts') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getMyPosts: [],
            },
          },
        });
      }
    });

    cy.get('[data-cy="zeroPost"]').should('exist').and('be.visible');
  });

  it('4. Should display error statements when something wrong in get posts', () => {
    cy.intercept('GET', 'api/graphql', (req) => {
      if (req.body.operationName === 'getMyPosts') {
        req.reply({ statusCode: 400, body: { errors: [{ message: 'Something wrong' }] } });
      }
    });
    // cy.wait('@getMyPosts');

    cy.get('[data-cy="postnumberError"]').contains('Something wrong').should('be.visible');
    cy.get('[data-cy="postsError"]').contains('Something wrong').should('be.visible');
  });
  it('5. Should handle image then upload and save data', () => {
    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/dka8klbhn/image/upload', (req) => {
      if (req.body.operationName === 'changeProfileImg') {
        req.reply({ statusCode: 200, body: { secureUrl: 'http://example.com/profileImage11.jpg' } });
      }
    }).as('changeProfileImg');
  });
});
