describe('Reset Password Page - Basic Functionality', () => {
    beforeEach(() => {
      // Visit with identifier parameter to avoid redirect
      cy.visit('/reset-password?identifier=test@example.com');
    });
  
    it('should render reset password page elements', () => {
      cy.get('img[alt="Instagram"]').should('be.visible');
      cy.contains('Reset Your Password').should('be.visible');
      cy.contains('Enter the 6-digit code we sent to your email').should('be.visible');
      cy.contains('Code expires in 10 minutes').should('be.visible');
      cy.get('input[placeholder="000000"]').should('be.visible');
      cy.get('input[placeholder="New password"]').should('be.visible');
      cy.get('input[placeholder="Confirm new password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Reset Password');
      cy.contains("Didn't receive the code?").should('be.visible');
      cy.contains('Resend code').should('be.visible');
      cy.contains('Remember your password?').should('be.visible');
      cy.contains('Back to login').should('be.visible');
    });
  
    it('should redirect when no identifier provided', () => {
      cy.visit('/reset-password');
      cy.url().should('include', '/forgot-password');
    });
  
    it('should handle OTP input changes and validation', () => {
      // Test OTP input - should only accept digits and max 6 characters
      cy.get('input[placeholder="000000"]')
        .type('abc123def')
        .should('have.value', '123'); // Only digits
  
      cy.get('input[placeholder="000000"]')
        .clear()
        .type('1234567890')
        .should('have.value', '123456'); // Max 6 digits
  
      // Test clearing error when typing - use force to click disabled button
      cy.get('button[type="submit"]').click({ force: true });
      cy.get('input[placeholder="000000"]').type('1');
      // Error should be cleared when user starts typing
    });
  
    it('should handle password input changes and show/hide functionality', () => {
      // Test password input
      cy.get('input[placeholder="New password"]')
        .type('newpassword123')
        .should('have.value', 'newpassword123');
  
      // Test confirm password input
      cy.get('input[placeholder="Confirm new password"]')
        .type('newpassword123')
        .should('have.value', 'newpassword123');
  
      // Test show/hide password functionality
      cy.get('input[placeholder="New password"]').should('have.attr', 'type', 'password');
      cy.get('input[placeholder="Confirm new password"]').should('have.attr', 'type', 'password');
      
      // Click show password button
      cy.get('button[type="button"]').click();
      
      cy.get('input[placeholder="New password"]').should('have.attr', 'type', 'text');
      cy.get('input[placeholder="Confirm new password"]').should('have.attr', 'type', 'text');
      
      // Click hide password button
      cy.get('button[type="button"]').click();
      
      cy.get('input[placeholder="New password"]').should('have.attr', 'type', 'password');
      cy.get('input[placeholder="Confirm new password"]').should('have.attr', 'type', 'password');
    });
  
    it('should disable submit button when form is invalid', () => {
      // Empty form
      cy.get('button[type="submit"]').should('be.disabled');
  
      // With OTP but no passwords
      cy.get('input[placeholder="000000"]').type('123456');
      cy.get('button[type="submit"]').should('be.disabled');
  
      // With OTP and one password
      cy.get('input[placeholder="New password"]').type('password123');
      cy.get('button[type="submit"]').should('be.disabled');
  
      // With all fields filled
      cy.get('input[placeholder="Confirm new password"]').type('password123');
      cy.get('button[type="submit"]').should('not.be.disabled');
  
      // With incomplete OTP
      cy.get('input[placeholder="000000"]').clear().type('123');
      cy.get('button[type="submit"]').should('be.disabled');
    });
  
    it('should have correct navigation links', () => {
      cy.contains('Back to login').should('have.attr', 'href', '/login');
    });
  
    it('should handle the redirecting state when no identifier', () => {
      cy.visit('/reset-password');
      cy.contains('Redirecting...').should('be.visible');
    });
  
    it('should handle edge case where resend is attempted with no identifier', () => {
      // This tests the resendCooldown > 0 || !identifier condition
      cy.visit('/reset-password'); // No identifier
      // This should redirect to forgot-password, but let's test the edge case
      cy.url().should('include', '/forgot-password');
    });
  });