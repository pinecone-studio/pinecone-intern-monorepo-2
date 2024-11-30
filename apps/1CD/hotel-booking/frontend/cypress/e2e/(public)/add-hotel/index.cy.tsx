describe('admin add-hotel page', () => {
  beforeEach(() => {
    cy.visit('/add-hotel');
  });

  it('1. Should render add-hotel', () => {
    cy.get('[data-cy=Add-Hotel-Page]').should('be.visible');
  });

  it('2. when user click open dialog button', () => {
    cy.get('[data-cy=Open-Dialog-Button]').click();
    cy.get('[data-cy=Add-Hotel-General-Info-Dialog]').should('be.ok');
  });
  it('3. when user all input fill', () => {
    cy.get('[data-cy=Open-Dialog-Button]').click();
    cy.get('[data-cy=Hotel-Name-Input]').type('hotel test');
    cy.get('[data-cy=Stars-Rating-Input]').type('5');
    cy.get('[data-cy=PhoneNumber-Input]').type('80808080');
    cy.get('[data-cy=Review-Rating-Input]').type('10');
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Add-Hotel-General-Info-Dialog]').should('not.be.visible');
  });
});
