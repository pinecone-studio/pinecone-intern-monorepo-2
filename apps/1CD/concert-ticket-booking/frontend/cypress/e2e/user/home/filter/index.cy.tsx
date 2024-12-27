describe('Filter Page', () => {
  beforeEach(() => {
    cy.visit('user/home/filter');
  });
  it('1. Displays detail page top component', () => {
    cy.get('[data-cy="Filter-Page"]').should('be.visible');
    cy.get('[data-cy="Card-Component"]').should('be.visible');
    cy.get('[data-testid="Artist-Search-Input"]').should('exist').should('have.attr', 'placeholder', 'Уран бүтээлчээр хайх');
    const testInput = 'Test Artist';
    cy.get('[data-testid="Artist-Search-Input"]').type(testInput).should('have.value', testInput).clear().should('have.value', '');
    cy.get('[data-testid="Artist-Search-Input"]').type('Artist1').should('have.value', 'Artist1').type('{backspace}').should('have.value', 'Artist');
  });
});
