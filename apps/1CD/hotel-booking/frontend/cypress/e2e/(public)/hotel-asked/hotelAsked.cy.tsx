describe('HotelDetail', () => {
  beforeEach(() => {
    cy.visit('/hotel-detail/674bfbd6a111c70660b55541');
  });
  it('1. should render', () => {
      cy.scrollTo('bottom').should('exist', '[data-cy="Hotel-Asked"]');
      cy.get('[data-cy="Hotel-Asked"]').should('be.visible');
  });
  it('2. should render', ()=>{
      cy.get('[data-cy="hotel-ask-trigger"]').first().click();
      cy.get('[data-cy="hotel-ask-question"]').should('exist');
  })
});