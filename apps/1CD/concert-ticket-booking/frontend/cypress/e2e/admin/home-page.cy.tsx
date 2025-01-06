describe('Admin Page ', () => {
  beforeEach(() => {
    cy.visit('/admin/home');
  });
  it('should render the copyright text', () => {
    cy.get('[data-cy="Admin-Footer"]').should('be.visible');
    cy.get('[data-cy="Admin-Footer"]').should('contain.text', '©2024 Copyright');
    cy.get('[data-cy="AdminHeader-Logo-Text"]').should('contain.text', 'TICKET BOOKING');
    cy.get('[data-cy="Admin-Header-Exit-Account"]').click();
  });

  it('should render adminDashboard page', () => {
    cy.get('[data-cy="table-header"]').should('be.visible');
    cy.get('[data-cy="table-header"]').should('contain.text', 'Онцлох');
    cy.get('div').should('have.class', 'container');
    cy.get('[data-testid="Admin-Dash"]').should('exist');
    cy.get('[data-testid="Admin-Dash"]').find('h3').should('contain.text', 'Тасалбар');
    cy.get('[data-testid="Admin-Dash"]').find('p').should('contain.text', 'Идэвхитэй зарагдаж буй тасалбарууд');
  });
});
