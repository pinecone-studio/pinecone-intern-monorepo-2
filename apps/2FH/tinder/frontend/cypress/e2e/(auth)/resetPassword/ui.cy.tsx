describe('Reset Password Page UI Tests', () => {
  beforeEach(() => {
    cy.visit('/resetPassword?email=test@example.com');
  });

  it('should toggle password visibility for new password', () => {
    cy.get('input[placeholder="New Password"]').should('have.attr', 'type', 'password');
    cy.get('[data-cy="toggle-new-password"]').click();
    cy.get('input[placeholder="New Password"]').should('have.attr', 'type', 'text');
    cy.get('[data-cy="toggle-new-password"]').click();
    cy.get('input[placeholder="New Password"]').should('have.attr', 'type', 'password');
  });
  
  it('should toggle password visibility for confirm password', () => {
    cy.get('input[placeholder="Confirm Password"]').should('have.attr', 'type', 'password');
    
    // Toggle to text
    cy.get('[data-cy="toggle-confirm-password"]').click();
    cy.get('input[placeholder="Confirm Password"]').should('have.attr', 'type', 'text');
    
    // Toggle back to password
    cy.get('[data-cy="toggle-confirm-password"]').click();
    cy.get('input[placeholder="Confirm Password"]').should('have.attr', 'type', 'password');
  });
  
  it('should disable submit button while loading', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('newpassword123');
  
    cy.intercept('POST', '/api/graphql', {
      delay: 1000,
      body: { data: { resetPassword: { status: 'SUCCESS', message: 'Password reset successfully' } } }
    }).as('resetPasswordDelay');
  
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').should('be.disabled');
    cy.wait('@resetPasswordDelay');
  });
}); 