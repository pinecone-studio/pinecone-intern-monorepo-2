// apps/frontend-e2e/src/e2e/user-profile.cy.ts

describe('User Profile Page', () => {
  beforeEach(() => {
    // TODO: Fix when backend is properly configured
    // Currently causes 500 error
    cy.visit('/userProfile');
  });

  it('should display username and profile info', () => {
    // TODO: Fix when backend is properly configured
    cy.contains('travel.explorer').should('be.visible');
    cy.contains('Alex Chen').should('be.visible');
    cy.contains('Content Creator').should('be.visible');
    cy.contains('📸 Travel Photographer').should('be.visible');
  });

  it('should show profile picture', () => {
    // TODO: Fix when backend is properly configured
    cy.get("img[alt='travel.explorer profile picture']").should('be.visible');
  });

  it('should display stats (posts, followers, following)', () => {
    // TODO: Fix when backend is properly configured
    cy.contains('284 posts').should('be.visible');
    cy.contains('15.6K followers').should('be.visible');
    cy.contains('432 following').should('be.visible');
  });

  it('should have Edit Profile and Ad tools buttons', () => {
    // TODO: Fix when backend is properly configured
    cy.contains('Edit Profile').should('be.visible');
    cy.contains('Ad tools').should('be.visible');
  });

  it('should have website link clickable', () => {
    // TODO: Fix when backend is properly configured
    cy.get('a').contains('alexchen-photography.com').should('have.attr', 'href').and('include', 'https://alexchen-photography.com');
  });

  it('should switch between POSTS and SAVED tabs', () => {
    // TODO: Fix when backend is properly configured
    cy.contains('POSTS').click().should('have.class', 'font-semibold');
    cy.contains('SAVED').click().should('have.text', 'SAVED');
  });
});
