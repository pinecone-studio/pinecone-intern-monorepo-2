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
});
