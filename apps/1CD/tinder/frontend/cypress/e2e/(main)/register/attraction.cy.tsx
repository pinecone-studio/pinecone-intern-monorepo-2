describe('Attraction Form Navigation', () => {
  beforeEach(() => {
    cy.visit('/register/attraction');
  });
  it('1. should display the logo and header', () => {
    cy.contains('tinder').should('be.visible');
    cy.contains('Who are you interested in?').should('be.visible');
    cy.contains('Pick the one that feels right for you!').should('be.visible');
  });
  it('2. should select any gender and display it in the input', () => {
    cy.get('[data-cy="select-button"]').should('be.visible').click();
    cy.get('[data-cy="male-select-content"]').should('exist');
    cy.get('[data-cy="male-select-content-male"]').should('exist').click();
    cy.get('[data-cy="next-button"]').should('be.visible').click();
    cy.url().should('include', '/register/birthday');
  });
  it('3. should show error when user didnot select the attraction', () => {
    cy.get('[data-cy="next-button"]').should('be.visible').click();
    cy.get('[data-cy="error-message"]').should('exist');
  });
});
