describe('Create Employee', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN_ADMIN'] as string
    cy.setCookie(
      'authtoken',
      token
    );
  });
  it('should display the create employee modal', () => {
    cy.visit('/admin');
    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();
  });
});
