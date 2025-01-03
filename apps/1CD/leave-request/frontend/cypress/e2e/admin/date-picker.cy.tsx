describe('DatePicker Component', () => {
  
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN_ADMIN'] as string
    cy.setCookie(
      'authtoken',
      token
    );
    cy.visit('/admin');
  });
  it('should navigate to previous month when clicking previous button', () => {
    cy.get('[aria-label="Previous month"]').should('exist');
    cy.get('[aria-label="Previous month"]').click();
    cy.get('[aria-label="Next month"]').should('exist');
    cy.get('[aria-label="Next month"]').click();
  });
});
