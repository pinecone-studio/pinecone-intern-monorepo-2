describe('Create Employee', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN'] as string
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
