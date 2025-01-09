describe('Guest page in admin folder', () => {
  beforeEach(() => {
    cy.visit('/guests');
  });

  it('1.Should render the get bookings page', () => {
    cy.get('[data-cy=Get-Bookings-Page]').should('be.visible');
    cy.get('[data-cy=Bookings-Data-Table]').should('be.visible');
    cy.get('[data-cy=Bookings-Filters]').should('be.visible');
  });

  it('2.Should render the status search modal', () => {
    cy.get('[data-cy=Bookings-Filters]').should('exist');
    cy.get('[data-cy=Status-Filter-Modal]').should('be.visible').click();
    cy.get('[data-cy=Bookings-Data-Table-Component]').should('exist');
  });

  it('3.Should render the search input and status filter', () => {
    cy.get('[data-cy="Bookings-Filters"]').should('exist');
    cy.get('[data-cy=Bookings-Search-Input]').type('213213');
    cy.get('[placeholder="Search"]').should('exist');
    cy.get('[data-cy="Status-Filter-Modal"]').should('exist');
  });
  it('4.Should filter by status', () => {
    cy.get('[data-cy=Status-Filter-Modal]').should('be.visible').click();
    cy.get('[data-cy=Select-Modal-Content]').should('be.visible');
    cy.get('[data-cy=Select-All]').should('exist').click();
    cy.get('[data-cy=Select-Modal-Content]').should('not.exist');
    cy.get('[data-cy=Status-Filter-Modal]').should('be.visible').click();
    cy.get('[data-cy=Select-Modal-Content]').should('exist');

    cy.get('[data-cy=Select-Booked]').should('exist').click();
    cy.get('[data-cy=Select-Modal-Content]').should('not.exist');
    cy.get('[data-cy=Status-Filter-Modal]').should('be.visible').click();
    cy.get('[data-cy=Select-Completed').should('exist').click();
    cy.get('[data-cy=Select-Modal-Content]').should('not.exist');
    cy.get('[data-cy=Status-Filter-Modal]').should('be.visible').click();
    cy.get('[data-cy=Select-Cancelled]').should('be.visible').click();
  });
});
