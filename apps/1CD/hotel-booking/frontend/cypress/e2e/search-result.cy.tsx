describe('Search Result Page', () => {
  beforeEach(() => {
    cy.visit('/search-result');
    cy.get('[data-cy=Get-Rooms-Page]').should('be.visible');
    cy.get('[data-cy=room-card]').should('be.visible');
  });
  it('1. Should be visible', () => {
    cy.get('[data-cy=Adult-Select-Modal-Button]').should('be.visible');
  });
  it('2.Modal should be visible when button is clicked', () => {
    cy.get('[data-cy=Adult-Select-Modal-Button]').click();
    cy.get('[data-cy=Adult-Select-Modal]').should('be.visible');
    cy.get('[data-cy=Adult-Quantity]').should('be.visible');
    cy.get('[data-cy=Adult-Quantity-Increase-Button]').should('be.visible');
    cy.get('[data-cy=Adult-Quantity-Desc-Button]').should('be.visible');
    cy.get('[data-cy=Modal-Done-Button]').should('be.visible');
  });
  it('3.Modal should be invisible when done button is clicked', () => {
    cy.get('[data-cy=Adult-Select-Modal]').should('be.visible');
    cy.get('[data-cy=Adult-Select-Modal-Button]').click();
    cy.get('[data-cy=Modal-Done-Button]').click();
  });
  it('4. Should decrease adult quantity when desc button is clicked', () => {
    cy.get('[data-cy=Adult-Select-Modal-Button]').click();

    cy.get('[data-cy=Adult-Quantity-Increase-Button]').click();
    cy.get('[data-cy=Adult-Quantity]').should('contain.text', '2');
    cy.get('[data-cy=Adult-Quantity-Desc-Button]').click();
    cy.get('[data-cy=Adult-Quantity]').should('contain.text', '1');
    cy.get('[data-cy=Adult-Quantity-Desc-Button]').click();
  });
  it('5.Modal should be invisible when done button is clicked', () => {
    cy.get('[data-cy=Adult-Select-Modal]').should('be.visible');
    cy.get('[data-cy=Adult-Select-Modal-Button]').click();
    cy.get('[data-cy=Adult-Quantity-Increase-Button]').click();
    cy.get('[data-cy=Adult-Quantity]').should('contain.text', '2');
    cy.get('[data-cy=Modal-Done-Button]').click();
    cy.get('[data-cy=Adult-Select-Modal-Button]').click();
    cy.get('[data-cy=Modal-Cancel-Button]').click();
    cy.get('[data-cy=Sort-By-Price]').click();
    cy.contains('Price: Low to High').click();
    cy.get('[data-cy=Search-By-Property-Name]').type('flower');
  });
});
