describe('HotelDetail', () => {
    beforeEach(() => {
      cy.visit('/hotel-detail');
    });
    it('1. should render', () => {
        cy.scrollTo('bottom').should('exist', '[data-cy="hotel-about"]');
        cy.get('[data-cy="hotel-about"]').should('be.visible');
    });
  });