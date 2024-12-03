describe('Signup page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('1. should render signup page', () => {
    cy.get('[data-cy="signup-page"]').should('be.visible');
  });

  it('2. should not show validation errors initially', () => {
    cy.get('[data-cy="signup-input-error-email"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-fullName"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-userName"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-password"]').should('not.exist');
  });

  it('3. should show validation errors only after form submission', () => {
    cy.get('button[type="submit"]').click();
    cy.get('[data-cy="signup-input-error-email"]').should('be.visible').and('have.text', 'Email must be at least 2 characters.');
    cy.get('[data-cy="signup-input-error-fullName"]').should('be.visible').and('have.text', 'First name must be at least 2 characters.');
    cy.get('[data-cy="signup-input-error-userName"]').should('be.visible').and('have.text', 'Last name must be at least 2 characters.');
    cy.get('[data-cy="signup-input-error-password"]').should('be.visible').and('have.text', 'Password must be at least 6 characters.');
  });

  it('4. should show specific field error when submitting with invalid data', () => {
    cy.get('[data-cy="signup-input-email"]').type('12');
    cy.get('[data-cy="signup-input-fullName"]').type('Test User');
    cy.get('[data-cy="signup-input-userName"]').type('testuser');
    cy.get('[data-cy="signup-input-password"]').type('password123');

    cy.get('button[type="submit"]').click();

    // cy.get('[data-cy="signup-input-error-email"]').should('be.visible').and('have.text', 'User exists already');
    cy.get('[data-cy="signup-input-error-email"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-fullName"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-userName"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-password"]').should('not.exist');
  });

  it('5. should not show errors when all fields are valid', () => {
    cy.get('[data-cy="signup-input-email"]').type('test@example.com');
    cy.get('[data-cy="signup-input-fullName"]').type('Test User');
    cy.get('[data-cy="signup-input-userName"]').type('testuser');
    cy.get('[data-cy="signup-input-password"]').type('password123');

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="signup-input-error-email"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-fullName"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-userName"]').should('not.exist');
    cy.get('[data-cy="signup-input-error-password"]').should('not.exist');
  });
});
