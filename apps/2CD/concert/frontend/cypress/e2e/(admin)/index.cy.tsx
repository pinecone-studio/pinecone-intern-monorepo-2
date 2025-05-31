describe('Ticket Page', () => {
  beforeEach(() => {
    cy.visit('/ticket'); 
  });

  it('should render main elements', () => {
    cy.get('[data-cy="Concert-Page"]').should('exist');
    cy.get('[data-cy="Concert-Title"]').should('contain.text', 'Тасалбар');
    cy.get('[data-cy="Concert-Subtitle"]').should('contain.text', 'Идвэхтэй зарагдаж буй тасалбарууд');
    cy.get('[data-cy="Concert-Search-Bar"]').should('exist');
    cy.get('[data-cy="Concert-Search-Input"]').should('have.attr', 'placeholder', 'Тасалбар хайх');
    cy.get('[data-cy="Concert-Clear-Button"]').should('contain.text', 'Цэвэрлэх');
  });

  it('should allow typing in the search input and clearing it', () => {
    cy.get('[data-cy="Concert-Search-Input"]')
      .type('Rock concert')
      .should('have.value', 'Rock concert');

    cy.get('[data-cy="Concert-Clear-Button"]').click();

    cy.get('[data-cy="Concert-Search-Input"]').should('have.value', '');
  });
});
