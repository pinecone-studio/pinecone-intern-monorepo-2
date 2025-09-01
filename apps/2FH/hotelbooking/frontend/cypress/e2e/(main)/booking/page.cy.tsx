describe('Booking Page', () => {
  it('1. Should render Booking Page UI', async () => {
    cy.visit('/booking');
    cy.get('[data-cy=Payment-Component-Container]').should('be.visible');
  });
});
