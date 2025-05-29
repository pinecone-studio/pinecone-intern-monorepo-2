describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('navigates to reset password page when clicked', () => {
    cy.contains('Нууц үг мартсан?').click();
    cy.url().should('include', '/resetPassword');
  });

  it('navigates to sign up page when clicked', () => {
    cy.contains('Бүртгүүлэх').click();
    cy.url().should('include', '/signUp');
  });
});
