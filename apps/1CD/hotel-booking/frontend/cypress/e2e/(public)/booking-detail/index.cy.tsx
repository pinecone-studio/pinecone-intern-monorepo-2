describe('bookind detail page e2e test', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=Login-Email-Input]').type('badralbaigalmaa7@gmail.com');
    cy.get('[data-cy=Login-Password-Input]').type('badral1218');
    cy.get('[data-cy=Login-Submit-Button]').click();
    cy.url().should('not.include', '/login');
    cy.getAllLocalStorage();
    cy.visit('/booking-detail/6757dfb4687cb83ca69ff3cb');
  });
  it('1. ', () => {
    cy.get('[data-cy=Booking-Detail-Home-Page]').should('be.visible');
  });
});
