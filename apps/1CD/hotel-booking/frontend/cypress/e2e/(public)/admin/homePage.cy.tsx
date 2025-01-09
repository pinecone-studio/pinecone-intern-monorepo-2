describe('homePage', () => {
  beforeEach(() => {
    cy.visit('/add-hotel/home-page');
  });
  it('1. should have Hotel text', () => {
    cy.get('[data-cy=Hotel-Text]').should('be.visible');
  });
  it('2. when user all input unfill', () => {
    cy.get('[data-cy="Add-Hotel-button"]').should('be.visible').click();
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Phonenumber-Error]').should('be.visible');
    cy.get('[data-cy=Hotel-Stars-Rating]').should('be.visible');
    cy.get('[data-cy=Review-Rating]').should('be.visible');
    cy.get('[data-cy=Hotel-Name-Error]').should('be.visible');
  });
  it('3. should have Add Hotel Button', () => {
    cy.get('[data-cy="Add-Hotel-button"]').should('be.visible').click();
    cy.get('[data-cy=Hotel-Name-Input]').type('hotel test');
    cy.get('[data-cy="Stars-Rating-Select-Value1"]').click();
    cy.get('[data-cy=Selected-Stars2]').click();
    cy.get('[data-cy="Stars-Rating-Select-Value"]').should('have.text', '2 ⭐ hotel');

    cy.get('[data-cy=PhoneNumber-Input]').type('80808080');
    cy.get('[data-cy=Review-Rating-Stars-Trigger]').click();
    cy.get('[data-cy=Review-Rating-Item1]').click();
    cy.get('[data-cy="Review-Rating-Stars"]').should('have.text', '1 ⭐');
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Hotel-General-Info-Page]').should('not.exist');
  });

  it('4. when user click cancel button ', () => {
    cy.get('[data-cy="Add-Hotel-button"]').should('be.visible').click();
    cy.get('[data-cy=Cancel-Button]').click();
  });

  it('6. should have location input', () => {
    cy.get('[data-cy="Filter-Location"]').should('be.visible');
    cy.get('[data-cy="Location-Trigger"]').click();
    cy.get('[data-cy="Select-UB"]').should('be.visible');
    cy.get('[data-cy="Select-UB"]').click();
    cy.get('[data-cy="hotel-info"]').should('exist');
    cy.get('[data-cy=Location-Trigger]').click();
    cy.get('[data-cy=All]').click();
    cy.get('[data-cy=Input-Element]').type('tokyo', { force: true });
  });
  it('7. should have rooms input', () => {
    cy.get('[data-cy="Status-Filter-Modal"]').should('be.visible');
    cy.get('[data-cy="Room-Trigger"]').click();
    cy.get('[data-cy="Select-All-Rooms"]').should('be.visible');
    cy.get('[data-cy="Select-standard"]').click();
    cy.get('[data-cy="Room-Trigger"]').click();
    cy.get('[data-cy="Select-All-Rooms"]').click();
  });
  it('8. should have star-rating input', () => {
    cy.get('[data-cy="Star-Rating-Input"]').should('be.visible');
    cy.get('[data-cy="Star-Trigger"]').click();
    cy.get('[data-cy="Select-All"]').should('be.visible');
    cy.get('[data-cy="Select-Five"]').click();
    cy.get('[data-cy="Star-Trigger"]').click();
    cy.get('[data-cy="Select-All"]').click();
  });
  it('9. should have user-rating input', () => {
    cy.get('[data-cy="User-Rating"]').should('be.visible');
    cy.get('[data-cy="User-Trigger"]').click();
    cy.get('[data-cy="Select-Modal-Content"]').should('be.visible');
    cy.get('[data-cy="Select-Nine"]').click();
    cy.get('[data-cy="User-Trigger"]').click();
    cy.get('[data-cy=Option-All]').click();
    cy.get('[data-cy=Selected-Value]').should('have.text', 'All');
  });
});
