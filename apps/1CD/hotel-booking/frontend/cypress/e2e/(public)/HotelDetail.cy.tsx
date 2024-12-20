describe('HotelDetail', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    it('1. should render', () => {
        cy.get('[data-cy="Hotel-Detail-Page"]').should('be.visible');
        cy.get('[data-cy="Hotel-Detail-Room-Image"]').should('exist')
    });
    it('2. should render', () => {
        cy.get('[data-cy="Hotel-Rooms"]').should('be.visible');
        cy.get('[data-cy="Room-Card"]').should('be.visible')
    });
})
