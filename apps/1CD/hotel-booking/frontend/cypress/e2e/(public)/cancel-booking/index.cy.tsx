describe('cancel-booking', () => {
  beforeEach(() => {
    cy.visit('cancel-booking');
    cy.get('[data-cy="Cancellation-rules"]').should('be.visible').should('have.text', 'Cancellation rules');
  });
  it('1. should be button ChevronLeft', () => {
    cy.get('[data-cy="ChevronLeft"]').should('exist');
  });
  it('2. should be text Cancel booking button', () => {
    cy.get('[data-cy="Open-Dialog-Button"]').should('exist');
    cy.should('have.text', 'Cancel Booking').click();
    cy.get('[data-cy="Cancel-booking-text"]').should('have.text', 'Cancel booking?');
    cy.get('[data-cy=Keep-booking-button]').should('exist').should('have.text', 'keep booking').click();
    cy.get('[data-cy="Cancel-booking-text"]').should('not.exist');
  });

  it('3. should have text', () => {
    cy.get('[data-cy="Cancellation-rules"]').should('be.visible').should('have.text', 'Cancellation rules');
  });
});
