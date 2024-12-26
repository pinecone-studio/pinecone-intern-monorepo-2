describe('DatePicker Component', () => {
  it('should open the calendar and select a date', () => {
    cy.visit('/user/home/filter');
    cy.get('button').contains('Өдөр сонгох').should('be.visible');
    cy.get('[data-cy="button"]').click();
    cy.get('[data-cy="calendar"]').should('be.visible');
    cy.get('.rdp-button_reset').contains(25).click();
    cy.get('button').should('contain', 'December 25th, 2024');
    cy.get('.rdp-button_reset').contains(25).click();
  });
});
