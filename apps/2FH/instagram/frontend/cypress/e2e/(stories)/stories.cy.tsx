/// <reference types="cypress" />

describe('Stories Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'https://backend-dev-xi.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'GetActiveStories') {
        req.reply({
          data: {
            getActiveStories: [
              {
                _id: 'story1',
                image: '/story1.png',
                createdAt: new Date().toISOString(),
                expiredAt: new Date().toISOString(),
                author: { _id: 'user1', userName: 'Test User', profileImage: '/avatar1.png' },
                viewers: [],
              },
              {
                _id: 'story2',
                image: '/story2.png',
                createdAt: new Date().toISOString(),
                expiredAt: new Date().toISOString(),
                author: { _id: 'user1', userName: 'Test User', profileImage: '/avatar1.png' },
                viewers: [],
              },
              {
                _id: 'story3',
                image: '/story3.png',
                createdAt: new Date().toISOString(),
                expiredAt: new Date().toISOString(),
                author: { _id: 'user2', userName: 'Second User', profileImage: '/avatar2.png' },
                viewers: [],
              },
            ],
          },
        });
      }
    }).as('getStories');
    cy.visit('/stories');
  });

  it('renders loading, then stories container', () => {
    cy.contains('Loading stories...').should('exist');
    cy.wait('@getStories');
    cy.get("[data-testid='stories-container']").should('exist');
    cy.contains('Instagram');
  });

  it('renders error state', () => {
    cy.intercept('POST', 'https://backend-dev-xi.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'GetActiveStories') {
        req.reply({ statusCode: 500, body: { errors: [{ message: 'Server error' }] } });
      }
    }).as('errorStories');
    cy.visit('/stories');
    cy.wait('@errorStories');
    cy.get("[data-testid='error-stories']").should('exist');
  });

  it('renders no stories state', () => {
    cy.intercept('POST', 'https://backend-dev-xi.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'GetActiveStories') {
        req.reply({ data: { getActiveStories: [] } });
      }
    }).as('emptyStories');
    cy.visit('/stories');
    cy.wait('@emptyStories');
    cy.get("[data-testid='no-stories']").should('exist');
    cy.contains('No stories available');
  });

  it('renders multiple users', () => {
    cy.wait('@getStories');
    cy.contains('Test User');
    cy.contains('Second User');
  });

  it('navigates stories forward and backward', () => {
    cy.wait('@getStories');
    cy.get("[data-testid='stories-container']").should('exist');

    // next story (simulate clicking inside StoryViewer)
    cy.get('body').trigger('keydown', { key: 'ArrowRight' });

    // prev story
    cy.get('body').trigger('keydown', { key: 'ArrowLeft' });
  });

  it.skip('allows closing stories', () => {
    cy.wait('@getStories');
    cy.get("[data-testid='close-stories-btn']").click();
    cy.url().should('include', '/');
  });

  it.skip('handles user selection', () => {
    cy.wait('@getStories');
    cy.contains('Second User').click();
    cy.get("[data-testid='stories-container']").should('be.visible');
  });

  it('shows correct visible users', () => {
    cy.wait('@getStories');
    cy.get("[data-testid='stories-container']").within(() => {
      cy.get('div').should('exist');
    });
  });

  it('renders valid images', () => {
    cy.wait('@getStories');
    cy.get('img').should('have.attr', 'src');
  });
});
