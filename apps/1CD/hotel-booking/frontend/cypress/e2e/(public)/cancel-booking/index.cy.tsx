/* eslint-disable */
describe('cancel-booking', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=Login-Email-Input]').type('badralbaigalmaa7@gmail.com');
    cy.get('[data-cy=Login-Password-Input]').type('badral1218');
    cy.get('[data-cy=Login-Submit-Button]').click();
    cy.url().should('not.include', '/login');
    cy.getAllLocalStorage();
    cy.visit('/cancel-booking/6783cba1d1f2090809af97a5');
    cy.get('[data-cy="Cancellation-rules"]').should('be.visible').should('have.text', 'Cancellation rules');
  });
  it('1. should be button ChevronLeft', () => {
    cy.get('[data-cy="ChevronLeft"]').should('exist');
  });
  it('2. should be text Cancel booking button', () => {
    cy.get('[data-cy="Open-Dialog-Button"]').should('exist');
    cy.should('have.text', 'Cancel Booking').click();
    cy.get('[data-cy=Open-Dialog]').should('exist');
    cy.get('[data-cy=Keep-booking-button]').click();
    cy.get('[data-cy=Open-Dialog]').should('not.exist');
  });

  it('3. should have text', () => {
    cy.get('[data-cy="Cancellation-rules"]').should('be.visible').should('have.text', 'Cancellation rules');
  });

  it('4. should click cancel booking button, and then should click confirm cancellation button', () => {
    cy.get('[data-cy=Open-Dialog-Button]').click();
    cy.get('[data-cy="Confirm-Button"]').click();
    cy.get('[data-cy=Open-Dialog]').should('not.exist');
  });
});
