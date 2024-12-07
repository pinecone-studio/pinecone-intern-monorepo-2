describe('DatePicker Component', () => {
  beforeEach(() => {
    cy.visit('/myRequest');
  });
  it('should navigate to previous month when clicking previous button', () => {
    cy.get('[aria-label="Previous month"]').should('exist');
    cy.get('[aria-label="Previous month"]').click();
    cy.get('[aria-label="Next month"]').should('exist');
    cy.get('[aria-label="Next month"]').click();
  });
});
