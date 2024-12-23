describe('user profile page', () => {
  beforeEach(() => {
    // cy.intercept('POST', '/api/graphql', (req) => {
    //   if (req.body.operationName === 'GetMyPosts') {
    //     req.reply({
    //       statusCode: 200,
    //       body: {
    //         data: {
    //           getMyPosts: [
    //             { _id: '1', images: ['http://example.com/image1.jpg'] },
    //             { _id: '2', images: ['http://example.com/image2.jpg'] },
    //           ],
    //         },
    //       },
    //     });
    //   }
    // });
    // cy.intercept('POST', '/api/graphql', (req) => {
    //   if (req.body.operationName === 'GetUser') {
    //     req.reply({
    //       statusCode: 200,
    //       body: {
    //         data: {
    //           getUser: {
    //             userName: 'TestUser',
    //             fullName: 'Test User Full Name',
    //             followerCount: 150,
    //             followingCount: 200,
    //             bio: 'This is a sample bio.',
    //             profileImg: 'http://example.com/profile.jpg',
    //             _id: 'user123',
    //           },
    //         },
    //       },
    //     });
    //   }
    // });
    cy.visit('/home/erdek');
  });

  it('1. Should render user profile page', () => {
    cy.get('[data-cy="user-profile-page"]').should('be.visible');
  });

  it('2. Should display posts when fetch post successfully', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMyPosts') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getMyPosts: [
                {
                  _id: '1',
                  images: ['https://example.com/image.jpg'],
                },
              ],
            },
          },
        });
      }
    });

    cy.get('[data-cy="postNumberDone"]').should('have.text', 1);
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
