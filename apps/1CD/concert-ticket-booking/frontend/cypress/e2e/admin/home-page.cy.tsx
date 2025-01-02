describe('Admin Page ', () => {
  beforeEach(() => {
    cy.visit('/admin/home');
  });
  it('should render the copyright text', () => {
    cy.get('[data-cy="Admin-Footer"]').should('be.visible');
    cy.get('[data-cy="Admin-Footer"]').should('contain.text', '©2024 Copyright');
    cy.get('[data-cy="AdminHeader-Logo-Text"]').should('contain.text', 'TICKET BOOKING');
    cy.get('[data-cy="Admin-Header-Exit-Account"]').click()
  });
  it('should render cansel request page', () => {
    cy.visit('/admin/cancel-request');
    cy.get('[data-cy="Cancel-Request-Text"]').should('be.visible');
    cy.get('[data-cy="Cancel-Request-Text"]').should('contain.text', 'Hello Cancel request page');
  });
  it('should render adminDashboard page', () => {
    cy.get('[data-cy="table-header"]').should('be.visible');
    cy.get('[data-cy="table-header"]').should('contain.text', 'Онцлох');
    cy.get('div').should('have.class', 'container');
    cy.get('[data-testid="Admin-Dash"]').should('exist');
    cy.get('[data-testid="Admin-Dash"]').find('h3').should('contain.text', 'Тасалбар');
    cy.get('[data-testid="Admin-Dash"]').find('p').should('contain.text', 'Идэвхитэй зарагдаж буй тасалбарууд');
    cy.get('[data-cy="submit-button"]').click().should('contain', 'success');
    
  });
});
