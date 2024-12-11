describe('reset password page', () => {
  beforeEach(() => {
    cy.visit('/resetpassword?resetToken=${resetToken}');
  });

  it('1. should render reset password page', () => {
    cy.get('[data-cy="reset-password-page"]').should('be.visible');
  });

  it('2. should handle form and must save users new password then jump to home page', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'ResetPassword') {
        req.reply({ statusCode: 200, body: { data: { resetPassword: { success: true } } } });
      }
    }).as('resetPasswordMutatuion');
    cy.get('[data-cy="reset-newPassword-Input"]').type('1122334455');
    cy.get('[data-cy="reset-confrimPassword-Input"]').type('1122334455');

    cy.get('[data-cy="reset-password-button"]').click();
    cy.wait('@resetPasswordMutatuion');
  });

  it('3. should throw error toast when passwords not match', () => {
    // cy.intercept('POST', '/api/graphql', (req) => {
    //   if (req.body.operationName === 'ResetPassword') {
    //     req.reply({ statusCode: 200, body: { error: [{ message: 'Your typed passwords it not matched' }] } });
    //   }
    // });
    cy.get('[data-cy="reset-newPassword-Input"]').type('1122334455');
    cy.get('[data-cy="reset-confrimPassword-Input"]').type('1122334466');

    cy.get('[data-cy="reset-password-button"]').click();
    cy.contains('Your typed passwords it not matched');
  });
});
