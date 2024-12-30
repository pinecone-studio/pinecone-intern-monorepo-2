describe('HotelDetail', () => {
    beforeEach(() => {
      cy.visit('/hotel-detail/674bfbd6a111c70660b55541');
    });
    it('1. should render', () => {
        cy.scrollTo('bottom').should('exist', '[data-cy="hotel-about"]');
        cy.get('[data-cy="hotel-about"]').should('be.visible');
    });
  });