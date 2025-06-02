describe('Concert Page', () => {
  beforeEach(() => {
    cy.visit('/ticket');
  });

  it('renders the Concert page correctly', () => {
    cy.get('[data-cy="Concert-Page"]').should('exist');

    cy.get('[data-cy="Concert-Title"]')
      .should('exist')
      .and('contain.text', 'Тасалбар');

    cy.get('[data-cy="Concert-Subtitle"]')
      .should('exist')
      .and('contain.text', 'Идвэхтэй зарагдаж буй тасалбарууд');
  });
});