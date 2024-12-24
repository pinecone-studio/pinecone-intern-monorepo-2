describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Should render login page', () => {
    cy.get('[data-cy="Login-Page"]').should('be.visible');
  });
  it('1. When user enters less than 8 characters on email input, it should display error message', () => {
    cy.get('[data-cy=Login-Password-Input]').type('12');
    cy.get('[data-cy=Login-Submit-Button]').click({ multiple: true });
    cy.get('[data-cy=Login-Email-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Login-Email-Input-Error-Message]').should('have.text', 'Email must be at least 2 characters.');
  });
  it('2. When user enters less than 8 characters on password input, it should display error message', () => {
    cy.get('[data-cy=Login-Password-Input]').type('12');
    cy.get('[data-cy=Login-Submit-Button]').click({ multiple: true });
    cy.get('[data-cy=Login-Password-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Login-Password-Input-Error-Message]').should('have.text', 'Password must be at least 6 characters.');
  });
  it('4. When user clicks on forget password button, it should render change password page', () => {
    cy.get('[data-cy=Login-Forget-Password-Button]').click();
    cy.visit('/change-password');
  });
  it('5. When user clicks on create an account button, it should render change password page', () => {
    cy.get('[data-cy=Login-Create-Account-Button]').click();
    cy.visit('/signup');
  });
});
