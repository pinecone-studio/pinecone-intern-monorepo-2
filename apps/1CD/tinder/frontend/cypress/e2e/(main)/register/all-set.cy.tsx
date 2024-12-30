describe('Image upload page', () => {
  beforeEach(() => {
    cy.visit('/register/all-set');
  });
  it('1. display the logo and header', () => {
    cy.contains('tinder').should('be.visible');
    cy.contains("You're all set!").should('be.visible');
    cy.contains("Your account is all set. You're ready to explore and connect!").should('be.visible');
  });
  it('2. should interact with the "Start Swiping!" button', () => {
    cy.get('[data-cy="swipe-button"]').should('be.visible').click();
    cy.url().should('include', '/recs');
  });
});
