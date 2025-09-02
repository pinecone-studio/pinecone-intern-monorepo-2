describe('Reset Password Page - Line 92 Coverage', () => {
    it('should hit line 92 early return when identifier is missing', () => {
      // Visit reset-password without identifier parameter
      cy.visit('/reset-password');
      
      // Should redirect to forgot-password due to missing identifier
      cy.url().should('include', '/forgot-password');
    });
  
    it('should hit line 92 early return during cooldown', () => {
      const testIdentifier = 'test@example.com';
      const encodedIdentifier = encodeURIComponent(testIdentifier);
      cy.visit(`/reset-password?identifier=${encodedIdentifier}`);
  
      // Mock successful forgot password for resend
      cy.interceptGraphql({
        operationName: 'ForgotPassword',
        state: 'success',
        data: {
          data: { forgotPassword: true }
        }
      });
  
      // First resend should work
      cy.contains('Resend code').click();
      cy.wait('@ForgotPassword');
      
      // Should show cooldown
      cy.contains(/Resend in \d+s/).should('be.visible');
      
      // Try to click resend again during cooldown - hits line 92 (resendCooldown > 0)
      cy.contains(/Resend in \d+s/).click({ force: true });
      
      // Should not make another request
      cy.get('@ForgotPassword.all').should('have.length', 1);
    });
  
    it('should handle resend attempt with empty identifier', () => {
      // Visit with empty identifier to test !identifier condition on line 92
      cy.visit('/reset-password?identifier=');
      
      // Should redirect due to empty identifier in useEffect
      cy.url().should('include', '/forgot-password');
    });
  });
  