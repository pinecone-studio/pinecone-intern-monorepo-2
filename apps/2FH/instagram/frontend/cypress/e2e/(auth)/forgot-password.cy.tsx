describe('Forgot Password Page - Basic Functionality', () => {
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
});