/* eslint-disable max-lines */

describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.visit('/forgot-password');
  });

  it('should render forgot password page elements', () => {
    cy.get('img[alt="Instagram"]').should('be.visible');
    cy.contains('Trouble with logging in?').should('be.visible');
    cy.contains("Enter your email address or username and we'll send you a link").should('be.visible');
    cy.get('input[placeholder="Email address or username"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Send Reset Code');
    cy.contains('OR').should('be.visible');
    cy.contains('Create new account').should('be.visible');
    cy.contains('Back to login').should('be.visible');
  });

  it('should handle form input changes and clear errors', () => {
    // Type valid identifier
    cy.get('input[placeholder="Email address or username"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com');
    
    // Clear input
    cy.get('input[placeholder="Email address or username"]').clear();
    
    // Type username
    cy.get('input[placeholder="Email address or username"]')
      .type('testuser')
      .should('have.value', 'testuser');
  });

  it('should validate form submission and show validation errors', () => {
    // Type a value first to enable the button, then clear to trigger validation
    cy.get('input[placeholder="Email address or username"]').type('test');
    cy.get('button[type="submit"]').should('not.be.disabled');
    
    // Clear the input to make it empty
    cy.get('input[placeholder="Email address or username"]').clear();
    
    // Now submit the form (button will be disabled but we can force click or submit form)
    cy.get('form').submit();
    cy.contains('Please enter your email or username').should('be.visible');
    
    // Test with only whitespace
    cy.get('input[placeholder="Email address or username"]').type('   ');
    cy.get('form').submit();
    cy.contains('Please enter your email or username').should('be.visible');
  });

  it('should clear error when user starts typing', () => {
    // First type something to enable the button, then clear to trigger validation
    cy.get('input[placeholder="Email address or username"]').type('test');
    cy.get('input[placeholder="Email address or username"]').clear();
    
    // Submit the form to trigger validation error
    cy.get('form').submit();
    cy.contains('Please enter your email or username').should('be.visible');
    
    // Start typing to clear error
    cy.get('input[placeholder="Email address or username"]').type('t');
    cy.contains('Please enter your email or username').should('not.exist');
  });

  it('should handle successful forgot password submission', () => {
    cy.interceptGraphql({
      operationName: 'ForgotPassword',
      state: 'success',
      data: {
        data: {
          forgotPassword: true
        }
      }
    });

    cy.get('input[placeholder="Email address or username"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@ForgotPassword');
    
    // Should show success state
    cy.contains('Check Your Email').should('be.visible');
    cy.contains("We've sent a password reset code to your email address").should('be.visible');
    cy.contains('The code will expire in 10 minutes').should('be.visible');
    cy.get('button').should('contain', 'Enter Reset Code');
    cy.contains('Remember your password?').should('be.visible');
    cy.contains('Back to login').should('be.visible');
  });

  it('should handle forgot password submission errors', () => {
    cy.interceptGraphql({
      operationName: 'ForgotPassword',
      state: 'error',
      data: {
        errors: [{
          message: 'User not found',
          extensions: { code: 'USER_NOT_FOUND' }
        }]
      }
    });

    cy.get('input[placeholder="Email address or username"]').type('nonexistent@example.com');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@ForgotPassword');
    cy.contains('User not found').should('be.visible');
  });

  it('should handle forgot password generic errors', () => {
    cy.interceptGraphql({
      operationName: 'ForgotPassword',
      state: 'error',
      data: {
        errors: [{
          message: 'Network error occurred'
        }]
      }
    });

    cy.get('input[placeholder="Email address or username"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@ForgotPassword');
    cy.contains('Network error occurred').should('be.visible');
  });

  it('should show loading state during submission', () => {
    // Use cy.intercept directly with delay
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'ForgotPassword') {
        req.reply({
          delay: 1000, // This is crucial - gives time to see loading state
          statusCode: 200,
          body: {
            errors: [{ message: 'Network timeout' }]
          }
        });
      }
    }).as('ForgotPassword');
  
    cy.get('input[placeholder="Email address or username"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    
    // Now the loading state should be visible
    cy.get('button[type="submit"]').should('contain', 'Sending...');
    cy.get('button[type="submit"]').should('be.disabled');
    
    cy.wait('@ForgotPassword');
    cy.contains('Network timeout').should('be.visible');
  });
  
  // Alternative approach using standard cy.intercept if the helper still doesn't work
  it('should show loading state during submission - alternative', () => {
    // Use cy.intercept directly with proper delay
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'ForgotPassword') {
        req.reply({
          delay: 1500, // Critical: This delay allows the loading state to be visible
          statusCode: 200,
          body: {
            errors: [{
              message: 'Network timeout'
            }]
          }
        });
      }
    }).as('ForgotPassword');
  
    cy.get('input[placeholder="Email address or username"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    
    // Should see loading state
    cy.get('button[type="submit"]').should('contain', 'Sending...');
    cy.get('button[type="submit"]').should('be.disabled');
    
    cy.wait('@ForgotPassword');
    cy.contains('Network timeout').should('be.visible');
  });

  it('should handle proceed to reset functionality', () => {
    // First get to success state
    cy.interceptGraphql({
      operationName: 'ForgotPassword',
      state: 'success',
      data: {
        data: {
          forgotPassword: true
        }
      }
    });

    cy.get('input[placeholder="Email address or username"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@ForgotPassword');
    
    // Click proceed to reset
    cy.get('button').contains('Enter Reset Code').click();
    
    // Should navigate to reset password page with email parameter
    cy.url().should('include', '/reset-password');
    cy.url().should('include', 'identifier=test%40example.com');
    cy.url().should('include', 'email=test%40example.com');
  });

  it('should handle proceed to reset with username', () => {
    // Test with username (no @ symbol)
    cy.interceptGraphql({
      operationName: 'ForgotPassword',
      state: 'success',
      data: {
        data: {
          forgotPassword: true
        }
      }
    });

    cy.get('input[placeholder="Email address or username"]').type('testuser');
    cy.get('button[type="submit"]').click();
    cy.wait('@ForgotPassword');
    
    // Click proceed to reset
    cy.get('button').contains('Enter Reset Code').click();
    
    // Should navigate to reset password page with username and empty email
    cy.url().should('include', '/reset-password');
    cy.url().should('include', 'identifier=testuser');
    cy.url().should('include', 'email=');
  });

  it('should have correct navigation links', () => {
    cy.contains('Create new account').should('have.attr', 'href', '/signup');
    cy.contains('Back to login').should('have.attr', 'href', '/login');
    
    // Test in success state too
    cy.interceptGraphql({
      operationName: 'ForgotPassword',
      state: 'success',
      data: {
        data: {
          forgotPassword: true
        }
      }
    });

    cy.get('input[placeholder="Email address or username"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@ForgotPassword');
    
    cy.contains('Back to login').should('have.attr', 'href', '/login');
  });

  it('should disable submit button when input is empty or loading', () => {
    // Empty input
    cy.get('button[type="submit"]').should('be.disabled');
    
    // With spaces only
    cy.get('input[placeholder="Email address or username"]').type('   ');
    cy.get('button[type="submit"]').should('be.disabled');
    
    // With valid input
    cy.get('input[placeholder="Email address or username"]').clear().type('test@example.com');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
