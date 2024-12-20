describe('VerifyEmail Component', () => {
  beforeEach(() => {
    cy.visit('/user/verify-email');
  });
  it('should show success toast and loader when email is verified successfully', () => {
    cy.get('[data-cy="input-email"]').type('abilay1208@gmail.com').should('have.value', 'abilay1208@gmail.com');
    cy.get('[data-cy="Verify-Email-Submit-Button"]').should('be.visible').should('be.enabled').click();
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'Successfully sent otp to email');
  });
  it('should render the Verify Email form correctly', () => {
    cy.visit('/user/verify-email');
    cy.get('[data-cy="Verify-Email-Page"]', { timeout: 10000 }).should('exist');
    cy.get('[data-cy="sign-in-form"]', { timeout: 10000 }).should('exist');
    cy.get('[data-cy="form-item-email"]', { timeout: 10000 }).should('exist');
    cy.get('[data-cy="input-email"]', { timeout: 10000 }).should('exist');
    cy.get('[data-cy="Verify-Email-Submit-Button"]', { timeout: 10000 }).should('exist');
  });
  it('should show error toast when email verification fails', () => {
    cy.get('[data-cy="input-email"]').type('baihguiemail@example.com').should('have.value', 'baihguiemail@example.com');
    cy.get('[data-cy="Verify-Email-Submit-Button"]').should('be.visible').should('be.enabled').click();
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'User not found');
  });
});
