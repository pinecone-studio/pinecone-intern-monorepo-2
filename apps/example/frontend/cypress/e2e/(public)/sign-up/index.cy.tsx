describe('Sign-Up Page', () => {
  beforeEach(() => {
    cy.visit('/sign-up');
  });

  it('1. Should render sign-up', () => {
    cy.get('[data-cy=Sign-Up-Page]').should('be.visible');
  });

  it('2. When user does not enter username, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Username-Input]').type('12');
    cy.get('[data-cy=Sign-Up-Username-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Username-Input-Error-Message]').should('have.text', 'Username must be at least 3 characters');
  });

  it('3. When user does not enter email, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Submit-Button]').click();
    cy.get('[data-cy=Sign-Up-Email-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Email-Input-Error-Message]').should('have.text', 'Email is required');
  });

  it('4. When user enters invalid email, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Email-Input]').type('12');
    cy.get('[data-cy=Sign-Up-Email-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Email-Input-Error-Message]').should('have.text', 'Invalid email address');
  });

  it('5. When user does not enter password, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Submit-Button]').click();
    cy.get('[data-cy=Sign-Up-Password-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Password-Input-Error-Message]').should('have.text', 'Password is required');
  });

  it('6. When user enters less than 8 characters on password input, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Password-Input]').type('122');
    cy.get('[data-cy=Sign-Up-Password-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Password-Input-Error-Message]').should('have.text', 'Password must be at least 8 characters');
  });

  it('7. When user does not enter password, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Submit-Button]').click();
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input-Error-Message]').should('have.text', 'Confirm Password is required');
  });

  it('8. Password and Confirm password must match', () => {
    cy.get('[data-cy=Sign-Up-Password-Input]').type('12345678');
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input]').type('1234567');
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input-Error-Message]').should('have.text', 'Passwords must match');
  });

  it('8. when user enters all values, it should navigate to login page', () => {
    cy.get('[data-cy=Sign-Up-Username-Input]').type('Test');
    cy.get('[data-cy=Sign-Up-Email-Input]').type('test@gmail.com');
    cy.get('[data-cy=Sign-Up-Password-Input]').type('12345678');
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input]').type('12345678');
    cy.get('[data-cy=Sign-Up-Submit-Button]').click();
    cy.url().should('include', 'login');
  });
});
