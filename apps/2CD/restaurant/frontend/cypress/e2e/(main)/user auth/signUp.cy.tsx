describe('SignUp Page Navigation', () => {
  beforeEach(() => {
    cy.visit('/signUp');
  });

  it('navigates to login page when Нэвтрэх button is clicked', () => {
    cy.contains('Нэвтрэх').click();
    cy.url().should('include', '/login');
  });
});
