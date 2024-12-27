describe('Admin Page', () => {
  beforeEach(() => {
    cy.visit('/admin/home');
  });

  it('should render the copyright text', () => {
    cy.get('[data-cy="Admin-Footer"]').should('be.visible');
    cy.get('[data-cy="Admin-Footer"]').should('contain.text', '©2024 Copyright');
  });

  it('should render cancel request page', () => {
    cy.visit('/admin/cancel-request');
    cy.get('[data-cy="Cancel-Request-Text"]').should('be.visible');
    cy.get('[data-cy="Cancel-Request-Text"]').should('contain.text', 'Hello Cancel request page');
  });

  it('should render header', () => {
    cy.get('[data-cy="AdminHeader-Logo-Text"]').should('contain.text', 'TICKET BOOKING');
    cy.get('[data-cy="AdminHeader-MenuBar-Button"]').click();
    cy.get('[data-cy="AdminHeader-MenuBar-Button"]').should('be.visible');
    cy.get('[data-cy="AdminHeader-MenuBar-Content-Button-One"]').click();
    cy.get('[data-cy="AdminHeader-MenuBar-Content-Button-Two"]').click();
  });
});
