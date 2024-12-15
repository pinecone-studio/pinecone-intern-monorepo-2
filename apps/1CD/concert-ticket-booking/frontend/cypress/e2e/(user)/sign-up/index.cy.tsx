describe('Sign-Up Page', () => {
  beforeEach(() => {
    cy.visit('/user/sign-up');
  });

  it('1. should render sign-up', () => {
    cy.get('[data-cy=Sign-Up-Page]').should('be.visible');
  });

  it('2. should show validation errors for invalid inputs', () => {
    cy.get('[data-cy="Sign-Up-Submit-Button"]').click();

    cy.get('[data-cy="form-message-email"]').should('contain', 'Email must be at least 2 characters.');

    cy.get('[data-cy="form-message-password"]').should('contain', 'Be at least 8 characters long');

    cy.get('[data-cy="form-message-repeatPassword"]').should('contain', 'Be at least 8 characters long');
  });

  it('3. should show "Passwords do not match" if repeatPassword doesn’t match password', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('P@ssword123');
    cy.get('input[name="repeatPassword"]').type('P@ssword456');
    cy.get('[data-cy="Sign-Up-Submit-Button"]').click();

    cy.get('[data-cy="form-message-repeatPassword"]').should('contain', 'Passwords do not match');
  });

  it('4. should show a success message and call the handleSignUp function on valid form submission', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('P@ssword123');
    cy.get('input[name="repeatPassword"]').type('P@ssword123');

    cy.get('[data-cy="Sign-Up-Submit-Button"]').should('be.visible').click();

    // cy.url().should('include', '/');
  });

  it('5. should navigate to the sign-in page when "Нэвтрэх" button is clicked', () => {
    cy.get('[data-cy="Sign-In-Link-Button"]').click();
    cy.url().should('include', '/sign-in');
  });
});
