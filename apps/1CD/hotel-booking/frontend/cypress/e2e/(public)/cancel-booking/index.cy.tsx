describe('cancel-booking', () => {
  beforeEach(() => {
    cy.visit('cancel-booking');
    // it('1. should show cancel-booking-pag', () => {
    cy.get('[data-cy="get-cancel-booking-page"]').should('be.visible');
    cy.get('[data-cy="Cancellation-rules"]').should('have.text', 'Cancellation rules');
    cy.get('[data-cy="ChevronLeft"]').should('exist');
    cy.get('[data-cy="Open-Dialog-Button"]').should('exist');
    // });
  });
  //   it('2. should be text Cancel booking', () => {
  //   });
  //   it('3. should be button ChevronLeft', () => {
  //   });
  //   it('4. should be cancel booking button', () => {
  //   });
  //   it('5. when we click the button it shows dialoge', () => {
  //     cy.get('[data-cy="Open-Dialog-Button"]').click();
  //   });
  //   it('6. it should open dialog', () => {
  //     cy.get('[data-cy="open-dialog"]').should('be.visible');
  //   });
  //   it('7. should be text of cancel booking? question', () => {
  //     cy.get('[data-cy="Cancel booking text"]').should('have.text', 'Cancel booking?');
  //   });

  //   it('8. should be keep-booking-button', () => {
  //     cy.get('[data-cy="Keep-booking-button"]').should('exist');
  //   });
  //   it('9. should be Confirm cancellation button', () => {
  //     cy.get('data-cy=confirm-button').should('exist');
  //   });
  //   it('10. when we click keep-booking button, it should close Dialog', () => {
  //     cy.get('[data-cy="Keep-booking-button"]').click();
  //     // cy.get('[data-cy=Keep-booking-button]').should('not.exist');
  //   });
  //   it('11. should not be visible', () => {});
});
