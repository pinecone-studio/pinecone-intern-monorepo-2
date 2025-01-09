describe('Filter Page', () => {
  beforeEach(() => {
    cy.visit('/user/home/filter');
  });
  it('1. Displays detail page top component', () => {
    cy.get('[data-cy="Filter-Page"]').should('be.visible');
    cy.get('[data-cy="Card-Component"]').should('be.visible');
    cy.get('[data-testid="Artist-Search-Input"]').should('exist').should('have.attr', 'placeholder', 'Уран бүтээлчээр хайх');
    const testInput = 'Test Artist';
    cy.get('[data-testid="Artist-Search-Input"]').type(testInput).should('have.value', testInput).clear().should('have.value', '');
    cy.get('[data-testid="Artist-Search-Input"]').type('Artist1').should('have.value', 'Artist1').type('{backspace}').should('have.value', 'Artist');
  });
  it('should open the calendar and select a date', () => {
    cy.get('button').contains('Өдөр сонгох').should('be.visible');
    cy.get('[data-cy="date-picker-button"]').click();
    cy.get('.rdp-button_reset').contains(25).click();
    cy.get('button').should('contain', 'January 25th, 2025');
    cy.get('.rdp-button_reset').contains(25).click();
  });
  it('Should show "Илэрц олдсонгүй" message if no results', () => {
    cy.get('[data-testid="Artist-Search-Input"]').type('NonExistentArtist');
    cy.get('[data-cy="Filter-Page"]').should('contain', 'Илэрц олдсонгүй');
  });
});
