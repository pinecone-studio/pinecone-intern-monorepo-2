describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.visit('/resetPassword?email=test@example.com');
  });

  it('should display reset password form elements', () => {
    cy.get('h1').should('contain.text', 'Set new Password');
    cy.get('form').should('exist');
    cy.get('input[type="password"]').should('have.length', 2);
    cy.get('button[type="submit"]').should('contain.text', 'Continue');
  });

  it('should show validation errors when fields are empty', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Password is required').should('be.visible');
    cy.contains('Confirm Password is required').should('be.visible');
  });

  it('should show error when passwords do not match', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('differentpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should handle successful password reset', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('newpassword123');
    
    cy.intercept('POST', '/api/graphql', {
      body: {
        data: {
          resetPassword: {
            status: 'SUCCESS',
            message: 'Password reset successfully'
          }
        }
      }
    }).as('resetPasswordSuccess');

    cy.get('button[type="submit"]').click();
    cy.wait('@resetPasswordSuccess');

    cy.url().should('eq', Cypress.config().baseUrl + '/signin');
  });

  it('should handle failed password reset', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('newpassword123');
    
    cy.intercept('POST', '/api/graphql', {
      body: {
        data: {
          resetPassword: {
            status: 'ERROR',
            message: 'Invalid token'
          }
        }
      }
    }).as('resetPasswordError');

    cy.get('button[type="submit"]').click();
    cy.wait('@resetPasswordError');
    
    cy.contains('Invalid token').should('be.visible');
  });

  it('should handle failed password reset with null message', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('newpassword123');
    
    cy.intercept('POST', '/api/graphql', {
      body: {
        data: {
          resetPassword: {
            status: 'ERROR',
            message: null
          }
        }
      }
    }).as('resetPasswordErrorNull');

    cy.get('button[type="submit"]').click();
    cy.wait('@resetPasswordErrorNull');
    
    cy.contains('Failed to reset password').should('be.visible');
  });

  it('should handle Apollo error', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('newpassword123');
    
    cy.intercept('POST', '/api/graphql', {
      statusCode: 500,
      body: { errors: [{ message: 'Internal server error' }] }
    }).as('apolloError');

    cy.get('button[type="submit"]').click();
    cy.wait('@apolloError');
    
    cy.contains('Something went wrong').should('be.visible');
  });

  it('should show loading state during submission', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('newpassword123');
    
    cy.intercept('POST', '/api/graphql', {
      delay: 1000,
      body: {
        data: {
          resetPassword: {
            status: 'SUCCESS',
            message: 'Password reset successfully'
          }
        }
      }
    }).as('resetPasswordDelay');

    cy.get('button[type="submit"]').click();
    cy.contains('Resetting...').should('be.visible');
    cy.wait('@resetPasswordDelay');
  });

  it('should accept valid password input', () => {
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').first().should('have.value', 'newpassword123');
    
    cy.get('input[type="password"]').eq(1).type('newpassword123');
    cy.get('input[type="password"]').eq(1).should('have.value', 'newpassword123');
  });

  it('should handle missing email parameter', () => {
    cy.visit('/resetPassword');
    cy.get('input[type="password"]').first().type('newpassword123');
    cy.get('input[type="password"]').eq(1).type('newpassword123');
    
    cy.intercept('POST', '/api/graphql', {
      body: {
        data: {
          resetPassword: {
            status: 'SUCCESS',
            message: 'Password reset successfully'
          }
        }
      }
    }).as('resetPasswordSuccess');

    cy.get('button[type="submit"]').click();
    cy.wait('@resetPasswordSuccess');
    cy.url().should('eq', Cypress.config().baseUrl + '/signin');
  });
}); 