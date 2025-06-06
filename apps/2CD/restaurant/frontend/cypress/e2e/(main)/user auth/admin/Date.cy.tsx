describe('DatePage', () => {
    beforeEach(() => {
        cy.visit('/date');
    });
    it('should display the date picker', () => {
        cy.get('button').contains('Өнөөдөр').should('exist');
    });
    it('should open the calendar when the date picker is clicked', () => {
        cy.get('button').contains('Өнөөдөр').click();
        cy.get('.rdp-day').should('exist');
    });
});