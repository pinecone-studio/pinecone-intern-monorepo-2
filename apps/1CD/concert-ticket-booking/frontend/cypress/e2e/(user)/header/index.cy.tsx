describe('Header Component', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should navigate to home page when logo is clicked', () => {
    cy.get('img[alt="HeaderLogo"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/home');
  });

  it('should show search input and allow text entry', () => {
    cy.get('input[placeholder="Хайлт"]').should('be.visible');
    cy.get('input[placeholder="Хайлт"]').type('Киоск');
    cy.get('input[placeholder="Хайлт"]').should('have.value', 'Киоск');
  });

  it('should navigate to the cart page when basket icon is clicked', () => {
    cy.get('a[href="/order"]').click();
    cy.url().should('include', '/order');
  });

  context('When user is not logged in', () => {
    it('should display sign up and sign in buttons', () => {
      cy.get('button').contains('Бүртгүүлэх').should('be.visible');
      cy.get('button').contains('Нэвтрэх').should('be.visible');
    });
  });
});
