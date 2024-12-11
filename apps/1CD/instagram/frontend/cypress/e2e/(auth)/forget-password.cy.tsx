describe('forget password page', () => {
  beforeEach(() => {
    cy.visit('/forget-password');
  });

  it('1. should render forget password page', () => {
    cy.get('[data-cy="forget-password-page"]').should('be.visible');
  });

  it('2. should handle form and must send recovery password link then jump to login page', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'ForgetPassword') {
        req.reply({ statusCode: 200 });
      }
    }).as('forgetPasswordMutation');
    cy.get('[data-cy="forget-password-emailInput"]').type('forgetpassword@test.com');

    cy.get('[data-cy="forget-password-sendlink-button"]').click();
    cy.wait('@forgetPasswordMutation');
    cy.url().should('eq', Cypress.config().baseUrl + '/forget-password');
  });
  it('3. should error toast when email not found', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'ForgetPassword') {
        req.reply({ statusCode: 200, body: { error: { message: 'Can not find this email address' } } });
      }
    }).as('forgetPasswordMutation');
    cy.get('[data-cy="forget-password-emailInput"]').type('testtest@test.com');

    cy.get('[data-cy="forget-password-sendlink-button"]').click();
    cy.wait('@forgetPasswordMutation');
  });
  it('4. should jump into login page when click back to login', () => {
    cy.get('[data-cy="forget-password-jump-login"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
