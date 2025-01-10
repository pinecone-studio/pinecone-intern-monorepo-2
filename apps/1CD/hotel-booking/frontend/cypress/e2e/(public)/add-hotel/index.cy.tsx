describe('admin add-hotel page', () => {
  beforeEach(() => {
    cy.visit('/add-hotel');
    // cy.visit('/Hotel-General-Info-Page');
  });

  it('1. Should render add-hotel', () => {
    cy.get('[data-cy=Add-Hotel-Page]').should('be.visible');
  });

  it('6. if user should all room input filled and click save button', () => {
    cy.get('[data-cy=Add-Room-General-Info-Dialog]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=Room-Name-Input]').type('badral');
    cy.get('[data-cy=Select-Room-Type-Trigger]').click();
    cy.get('[data-cy=Selected-Type1]').click();
    cy.get('[data-cy=Selected-Room-Type-Value]').should('have.text', 'Deluxe');
    cy.get('input[placeholder="Select options..."]').focus();
    cy.contains('24-hour front desk').click();
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
