describe('UpdateEventPriority', () => {
  beforeEach(() => {
    cy.visit('/admin/home');
  });

  it('1. should render success', () => {
    cy.get('[data-cy="priority-toggle-button-0"]').click();
    cy.get('[data-testid="yes-button"]').click();
    cy.get('[data-cy="submit-button"]').click();
    cy.contains('success');
  });

  it.only('2. should render error', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'UpdateEventPriority') {
        req.reply({
          error: true,
        });
      }
    });

    cy.get('[data-cy="priority-toggle-button-0"]').click();
    cy.get('[data-testid="yes-button"]').click();
    cy.get('[data-cy="submit-button"]').click();

    // Assert that the error message appears (assuming it's in a toast or alert)
    cy.contains('failed to save').should('be.visible');
  });

  it('3. should close modal', () => {
    cy.get('[data-cy="priority-toggle-button-0"]').click();
    cy.get('[data-testid="exit"]').click();
  });

  it('4. should cover low priority', () => {
    cy.get('[data-cy="priority-toggle-button-0"]').click();
    cy.get('[data-testid="no-button"]').click();
    cy.get('[data-cy="submit-button"]').click();
    cy.contains('success');
  });
});
