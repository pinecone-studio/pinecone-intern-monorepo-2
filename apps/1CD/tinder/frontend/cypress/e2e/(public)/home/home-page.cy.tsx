describe('HomePage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the homepage layout', () => {
    cy.get('[data-cy="background-container"]').should('exist');
    cy.get('[data-cy="background-overlay"]').should('exist');

    cy.get('[data-cy="navbar"]').should('exist');
    cy.get('[data-cy="logo-text"]').should('contain.text', 'tinder');
    cy.get('[data-cy="create-account-link"]').should('contain.text', 'Create Account');
    cy.get('[data-cy="login-link"]').should('contain.text', 'Log in');

    cy.get('[data-cy="footer"]').should('exist');
    cy.get('[data-cy="footer-text"]').should('contain.text', '© Copyright 2024');
  });

  it('should navigate to login and register pages', () => {
    cy.get('[data-cy="create-account-link"]').click();
    cy.url().should('include', '/register/email');

    cy.visit('/');
    cy.get('[data-cy="login-link"]').click();
    cy.url().should('include', '/signIn');
  });

  it('should display the main content', () => {
    cy.get('[data-cy="main-heading"]').should('contain.text', 'Swipe Right®');

    cy.get('[data-cy="main-cta-button"]').should('contain.text', 'Create Account').click();
    cy.url().should('include', '/register/email');
  });
});
