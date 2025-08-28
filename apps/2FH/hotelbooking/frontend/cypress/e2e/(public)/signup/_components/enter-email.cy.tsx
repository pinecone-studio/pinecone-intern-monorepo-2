describe('Sign up', () => {
  it('1. Has render sign up page', () => {
    cy.visit('/signup');
    cy.get('[data-cy=Enter-Email-Component-Container]').should('be.visible');
  });
});
