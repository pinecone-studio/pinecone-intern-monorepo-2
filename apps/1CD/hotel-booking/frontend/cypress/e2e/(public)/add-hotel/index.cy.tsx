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
  it('6. if user should all room input filled and click save button', () => {
    cy.get('[data-cy=Add-Room-General-Info-Dialog]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=Room-Name-Input]').type('badral');
    cy.get('[data-cy=Select-Room-Type-Trigger]').click();
    cy.get('[data-cy=Selected-Type1]').click();
    cy.get('[data-cy=Selected-Room-Type-Value]').should('have.text', 'Deluxe');
    cy.get('[data-cy=Price-Per-Night-Input]').type('5000');
    cy.get('[data-cy=Room-Save-Button]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('not.exist');
  });

  it('7. if user input not filled and click save button', () => {
    cy.get('[data-cy=Add-Room-General-Info-Dialog]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=Room-Save-Button]').click();
    cy.get('[data-cy=Price-Per-Night-Error]').should('be.visible');
    cy.get('[data-cy=Room-Type-Error]').should('be.visible');

    cy.get('[data-cy=Room-Name-Error]').should('be.visible');
  });
  it('8. if user cancel button', () => {
    cy.get('[data-cy=Add-Room-General-Info-Dialog]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=Room-Cancel-Button]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('not.exist');
  });
});
