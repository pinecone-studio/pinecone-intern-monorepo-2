describe('Guests page in admin', () => {
  beforeEach(() => {
    cy.visit('/guests');
    cy.get('[Get-Bookings-Page]').should('be visible');
  });
  it('1. Should render this page', () => {
    cy.get('[data-cy=Bookings-Data-Table]').should('be visible');
    cy.get('[data-cy=Bookings-Data').should('be visible');
  });
  it('2.Should be visible', () => {
    cy.get('[data-cy=Bookings-Filters]').should('be visible');
    cy.get('[data-cy=Status-Filter-Modal').click();
    cy.get('[data-cy=Status-Filter-Modal]').should('be visible');
  });
});
