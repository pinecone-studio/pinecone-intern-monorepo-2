
beforeEach(() => {
  cy.request('POST', '/api/seed-matches');
});


describe('Message Page', () => {
  it('renders UI with seeded data', () => {
    cy.visit('/message');

    cy.get('[data-testid="match-list"]').should('exist');
    cy.get('input[placeholder="Write a message..."]').should('exist');
    cy.contains('Send').should('exist');
  });
});

