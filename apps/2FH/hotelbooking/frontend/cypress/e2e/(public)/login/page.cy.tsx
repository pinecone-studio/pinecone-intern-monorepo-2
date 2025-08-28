describe('LogIn structure', () => {
  it('Has container div with Login page inside', () => {
    cy.visit('/login');
    cy.get('[data-cy=Login-container]').should('be.visible');
    cy.get('[data-cy=Login-container]').should('have.text', 'login step one');
  });
});
