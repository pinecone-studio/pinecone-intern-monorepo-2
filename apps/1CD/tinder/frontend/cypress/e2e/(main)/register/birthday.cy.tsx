describe('Birthday Form Navigation', () => {
  beforeEach(() => {
    cy.visit('/register/birthday');
  });
  it('1. should display the logo and header', () => {
    cy.get('[data-cy="logo-container"]').should('be.visible');
    cy.contains('tinder').should('be.visible');
    cy.contains('How old are you?').should('be.visible');
    cy.contains('Please enter your age to continue').should('be.visible');
  });
  it('2. should select December 1st, 2024 and display it in the input', () => {
    cy.get('[data-cy="dob-picker-button"]').should('be.visible').click();
    cy.get('[data-cy="calendar-popover"]').should('be.visible');
    cy.get('.rdp-button_reset').contains('1').click();
    cy.get('[data-cy="next-button"]').should('be.visible').click();
    cy.url().should('include', '/');
  });

  it('3. should interact with the next button', () => {
    cy.get('[data-cy="dob-picker-button"]').click();
    cy.get('[data-cy="next-button"]').should('be.visible').click();
    cy.url().should('include', '/');
  });

  it('4. should show an error if no date is selected', () => {
    cy.visit('/register/birthday');
    cy.get('[data-cy="next-button"]').click();
    cy.url().should('include', '/');
  });
  it('5. should go back to the home page when clicking "Back"', () => {
    cy.visit('/register/birthday');
    cy.get('[data-cy="back-button"]').click();
    cy.url().should('include', '/');
  });
});
