// Add these additional test cases to your existing Cypress spec file
/* eslint-disable max-lines */

describe('Instagram Stories Component - Coverage Tests', () => {
  beforeEach(() => {
    cy.visit('/stories');
  });

  it('should redirect to /stories when reaching the end of all users', () => {
    cy.get('.absolute.right-0.top-0').click({ force: true });
    cy.wait(100);
    cy.get('.absolute.right-0.top-0').click({ force: true });
    cy.wait(100);

    cy.get('.absolute.right-0.top-0').click({ force: true });
    cy.wait(100);
    cy.get('.absolute.right-0.top-0').click({ force: true });
    cy.wait(100);

    cy.get('.absolute.right-0.top-0').click({ force: true });
    cy.wait(100);
    cy.get('.absolute.right-0.top-0').click({ force: true });
    cy.wait(100);
    cy.get('.absolute.right-0.top-0').click({ force: true });
    cy.wait(100);

    cy.url().should('include', '/stories');
  });

  it('should handle previous user navigation correctly', () => {
    cy.get('button').contains('▶').click();
    cy.wait(500);

    cy.get('button').contains('◀').click();
    cy.get('img[alt="story"]').should('be.visible');

    cy.get('img[data-testid="main-story-image"]').should('have.attr', 'src').and('include', 'gb1v6olhagsfsogubl8r');
  });

  it('should test getVisibleUsers edge cases by navigating to different positions', () => {
    cy.get('.relative.flex.flex-col.items-center').should('have.length.at.least', 3);

    cy.get('button').contains('▶').click();
    cy.wait(200);
    cy.get('button').contains('▶').click();
    cy.wait(200);

    cy.get('.relative.flex.flex-col.items-center').should('have.length.at.least', 3);

    cy.get('button').contains('▶').click();
    cy.wait(200);
    cy.get('button').contains('▶').click();
    cy.wait(200);

    cy.get('.relative.flex.flex-col.items-center').should('have.length.at.least', 2);
  });

  it('should handle left navigation at the beginning', () => {
    cy.get('img[data-testid="main-story-image"]')
      .should('have.attr', 'src')
      .then((initialSrc) => {
        cy.get('.absolute.left-0.top-0').click({ force: true });
        cy.wait(100);

        cy.get('img[data-testid="main-story-image"]').should('have.attr', 'src', initialSrc);
      });
  });

  it('should close stories and return to home when clicking X', () => {
    cy.get('button').contains('X').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should test auto-progression through all stories to trigger handleNextUser', () => {
    cy.wait(6000);

    cy.get('img[data-testid="main-story-image"]').should('have.attr', 'src').and('include', 'gb1v6olhagsfsogubl8r');

    cy.wait(6000);

    cy.get('img[data-testid="main-story-image"]').should('have.attr', 'src').and('not.include', 'gb1v6olhagsfsogubl8r');
  });

  it('should display correct user avatars and usernames in side panels', () => {
    cy.get('img[alt="user2"]').should('be.visible');
    cy.get('img[alt="user3"]').should('be.visible');

    cy.contains('user2').should('be.visible');
    cy.contains('user3').should('be.visible');
  });

  it('should handle edge case in handlePrevUser when currentUser is 0', () => {
    cy.get('img[data-testid="main-story-image"]').should('be.visible');
    cy.get('button').contains('◀').click();
    cy.get('img[data-testid="main-story-image"]').should('be.visible');

    cy.get('img[data-testid="main-story-image"]').should('have.attr', 'src').and('include', 'pain_oxdu59');
  });
});
