describe('HotelDetail', () => {
    beforeEach(() => {
        cy.visit('/hotel-detail');
    });
    it('1. should render', () => {
        cy.get('[data-cy="Hotel-Detail-Page"]').should('be.visible');
        cy.get('[data-cy="Hotel-Detail-Room-Image"]').should('exist')
    });
    it('2. should render', () => {
        cy.get('[data-cy="Hotel-Rooms"]').should('be.visible');
        cy.get('[data-cy="Room-Card"]').should('be.visible')
    });
    it('3. should render', () => {
        cy.get('[data-cy="Show-More"]').first().click();
        cy.get('[data-cy="Hotel-Room-Detail"]').should('exist');
    });

})
