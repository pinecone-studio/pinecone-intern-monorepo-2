describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.visit('/resetPassword');
  });

  it('should allow navigating back to login', () => {
    cy.get('button').first().click();
    cy.url().should('include', '/login');
  });
});

//interseft data uusgechiheed butsaagaad ustgadag keydown
