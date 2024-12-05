describe('Search Result Page', () => {
  beforeEach(() => {
    cy.visit('/');
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

  // it('5.Should increase adult quantity when increase button is clicked', () => {
  //   cy.get('[data-cy=Adult-Select-Modal-Button]').click();
  //   cy.get('[data-cy=Adult-Quantity-Increase-Button]').click();
  //   cy.get('[data-cy=Adult-Quantity]').should('contain.text', '2');
  // });
});
