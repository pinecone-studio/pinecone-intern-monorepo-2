describe('date-picker test', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('1. date picker modal is visible and click calendar have numbers button', () => {
    cy.get('[data-cy=Date-Picker-Modal]').should('be.visible');
    cy.get('[data-cy=Trigger-Test]').click();
    cy.get('[data-cy=Date-Picker-Calendar]').should('be.visible').as('calendar');
    cy.get('@calendar').contains('7').click();
    cy.get('@calendar').contains('10').click();
    cy.url().should('include', 'dateTo');
  });
});
