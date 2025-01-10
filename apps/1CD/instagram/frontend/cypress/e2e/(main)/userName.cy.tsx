/* eslint-disable no-secrets/no-secrets */
describe('user profile page', () => {
  const mockApiFollowersRes = {
    seeFollowers: [
      { followerId: { _id: 'followerNum1', userName: 'Follower1', fullName: 'Mock Follower', profileImg: 'https://res.cloudinary.com/dka8klbhn/image/upload/v1734946251/dv4cj1pzsfb04tngsvq7.jpg' } },
      { followerId: { _id: 'followerNum2', userName: 'Follower2', fullName: 'Mock2 Follower', profileImg: 'https://res.cloudinary.com/dka8klbhn/image/upload/v1735788813/nguro3w6bkvs9zlad0d7.jpg' } },
      { followerId: { _id: 'followerNum3', userName: 'Follower3', fullName: 'Mock3 Follower', profileImg: '' } },
    ],
  };
  const mockApiFollowingsRes = {
    seeFollowings: [
      {
        followingId: { _id: 'followingNum1', userName: 'Following1', fullName: 'Mock Following', profileImg: 'https://res.cloudinary.com/dka8klbhn/image/upload/v1734946251/dv4cj1pzsfb04tngsvq7.jpg' },
      },
      {
        followingId: {
          _id: 'followingNum2',
          userName: 'Following2',
          fullName: 'Mock2 Following',
          profileImg: '',
        },
      },
    ],
  };

  it('1. Should render user profile page with posts and followers', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home/mery';
    cy.loginWithFakeToken(location, token);

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMyPosts') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              getMyPosts: [
                {
                  _id: 'postNumber1',
                  images: ['https://example.com/image1.jpg'],
                },
              ],
            },
          },
        });
      }
    });
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetFollowers') {
        req.reply({ statusCode: 200, body: { data: mockApiFollowersRes } });
      }
    });
    cy.visit('/home/mery');
    cy.get('[data-cy="username"]').should('contain.text', 'mery');
    cy.get('[data-cy="fullname"]').should('contain.text', 'mery');
    cy.get('[data-cy="postNumberDone"]').should('contain.text', '1');
    cy.get('[data-cy="followerNum"]').should('contain.text', '3');
    cy.get('[data-cy="myPosts"]').should('be.visible');
    cy.get('[data-cy="myPost"]').should('have.length', 1);
    cy.get('[data-cy="myPost"]').each(($post, index) => {
      const images = ['https://example.com/image1.jpg'];
      cy.wrap($post).find('img').should('have.attr', 'src').and('include', encodeURIComponent(images[index]));
    });
  });

  it('2. Should display nopost components when have zero post', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home/mery';
    cy.loginWithFakeToken(location, token);
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
    cy.visit('/home/mery');
    cy.get('[data-cy="postNumberDone"]').should('contain', 0);
    cy.get('[data-cy="zeroPost"]').should('exist').and('be.visible');
  });

  it('3. Should handle image then upload and save data', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home/mery';
    cy.loginWithFakeToken(location, token);
    cy.visit('/home/mery');
    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/dka8klbhn/image/upload', (req) => {
      if (req.body.operationName === 'changeProfileImg') {
        req.reply({ statusCode: 200, body: { secureUrl: 'http://example.com/profileImage11.jpg' } });
      }
    }).as('changeProfileImg');
  });

  it('4. Should open followers dialog when click on followers then click close button should unvisible', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home/mery';
    cy.loginWithFakeToken(location, token);
    cy.get('[data-cy="followerNum"]').click();
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetFollowers') {
        req.reply({ statusCode: 200, body: { data: mockApiFollowersRes } });
      }
    });
    // cy.visit('http://localhost:4201/home/mery');
    cy.get('[data-cy="dialogFollower"]').should('be.visible');
    cy.get('[data-cy="followerCard"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="followerCardImg"]').should('have.attr', 'src').and('include', encodeURIComponent('https://res.cloudinary.com/dka8klbhn/image/upload/v1734946251/dv4cj1pzsfb04tngsvq7.jpg'));
      });
    cy.get('[data-cy="followerCard"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="followerCardImg"]').should('have.attr', 'src').and('include', encodeURIComponent('https://res.cloudinary.com/dka8klbhn/image/upload/v1735788813/nguro3w6bkvs9zlad0d7.jpg'));
      });
    cy.get('[data-cy="followerCard"]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy="followerCardImg"]').should('have.attr', 'src').and('include', encodeURIComponent('/images/profileImg.webp'));
      });
    // cy.get('[data-cy="buttonClose"]').click();
    cy.get('button:has(svg.lucide-x)').click();
    // cy.get('[data-cy="dialogFollower"]').should('not.be.visible');
  });
  it('5. Should open followings dialog when click on followings then click close button should unvisible', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZiYmYzZTQwNTJiMTdhODA5YWFhNTUiLCJpYXQiOjE3MzU1MjQ0NjJ9.PVgtM4UPy8pR3U9fyhRhSHfzxlO2EHTmXm_UUmwFWYQ';
    const location = '/home/mery';
    cy.loginWithFakeToken(location, token);
    cy.get('[data-cy="followingNum"]').click();
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetFollowings') {
        req.reply({ statusCode: 200, body: { data: mockApiFollowingsRes } });
      }
    });
    // cy.visit('http://localhost:4201/home/mery');
    cy.get('[data-cy="dialogFollowing"]').should('be.visible');
    cy.get('[data-cy="followingCard"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="followingCardImg"]').should('have.attr', 'src').and('include', encodeURIComponent('https://res.cloudinary.com/dka8klbhn/image/upload/v1734946251/dv4cj1pzsfb04tngsvq7.jpg'));
      });
    cy.get('[data-cy="followingCard"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="followingCardImg"]').should('have.attr', 'src').and('include', encodeURIComponent('/images/profileImg.webp'));
      });
    // cy.get('[data-cy="buttonCloseFollowing"]').click();
    cy.get('button:has(svg.lucide-x)').click();
    // cy.get('[data-cy="dialogFollower"]').should('not.be.visible');
  });
});
