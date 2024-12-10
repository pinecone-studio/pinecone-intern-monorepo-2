describe('admin add-hotel page', () => {
  beforeEach(() => {
    cy.visit('/add-hotel');
    // cy.visit('/Hotel-General-Info-Page');
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

  it('4. when user all input unfill', () => {
    cy.get('[data-cy=Open-Dialog-Button]').click();
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Phonenumber-Error]').should('be.visible');
    cy.get('[data-cy=Hotel-Stars-Rating]').should('be.visible');
    cy.get('[data-cy=Review-Rating]').should('be.visible');
    cy.get('[data-cy=Hotel-Name-Error]').should('be.visible');
  });
  it('5. when user click cancel button ', () => {
    cy.get('[data-cy=Open-Dialog-Button]').click();
    cy.get('[data-cy=Cancel-Button]').click();
  });
});
