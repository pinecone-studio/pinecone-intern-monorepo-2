describe('Create Employee', () => {
  it('should display the create employee modal', () => {
    cy.visit('/admin');
    cy.get('button').contains('Шинэ ажилтан бүртгэх').click();
  });
});
