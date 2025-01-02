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

    // it('2. should render error', () => {
    //     cy.intercept('POST', '**/graphql', (req) => {
    //         if (req.body.operationName === 'updateEventPriorityMutation') {
    //           req.reply({
    //             error: true,
    //           });
    //         }
    //       }).as('updateEventPriorityMutation');
      
    //     // Trigger the user actions that lead to the mutation
    //     cy.get('[data-cy="priority-toggle-button-0"]').click();
    //     cy.get('[data-testid="yes-button"]').click();
    //     cy.get('[data-cy="submit-button"]').click();
      
    //     // Wait for the mutation request to complete
    //     cy.wait('@updateEventPriorityMutation');
      
    //     // Assert that the error message appears (assuming it's in a toast or alert)
    //     cy.contains('failed to save').should('be.visible');
    // });

    it('3. should close modal', () => {
        cy.get('[data-cy="priority-toggle-button-0"]').click();
        cy.get('[data-testid="exit"]').click();
    })

    it('4. should cover low priority', () => {
        cy.get('[data-cy="priority-toggle-button-0"]').click();
      cy.get('[data-testid="no-button"]').click();
      cy.get('[data-cy="submit-button"]').click();
      cy.contains('success');
    })
})

  