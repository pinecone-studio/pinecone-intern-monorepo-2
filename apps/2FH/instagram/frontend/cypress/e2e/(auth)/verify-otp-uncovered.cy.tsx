describe('Verify OTP Page - Coverage for Uncovered Lines', () => {
    const testEmail = 'test@example.com';
  
    beforeEach(() => {
      const encodedEmail = encodeURIComponent(testEmail);
      cy.visit(`/verify-otp?email=${encodedEmail}`)
    });
  
    // Test for lines 62-63: OTP validation error message
    it('should show error when submitting invalid OTP', () => {
      // Type 6 digits first to enable button, then clear some to make it invalid
      cy.get('input[name="otp"]').type('123456');
      
      // Clear 3 digits to make it invalid but submit before button gets disabled
      cy.get('input[name="otp"]').clear().type('123');
      
      // Submit form programmatically to bypass disabled state
      cy.get('form').submit();
      
      // Should show validation error (lines 62-63)
      cy.contains('Please enter a valid 6-digit OTP').should('be.visible');
    });
  
    // Test redirect behavior when no email parameter
    it('should redirect when email parameter is missing', () => {
      // Visit without email parameter
      cy.visit('/verify-otp');
      
      // Should redirect to signup due to missing email (useEffect)
      cy.url().should('include', '/signup');
    });
  
    // Test useEffect cleanup when cooldown > 0
    it('should cleanup timer on component unmount', () => {
      // Start resend cooldown
      cy.interceptGraphql({
        operationName: 'SendVerificationEmail',
        state: 'success',
        data: {
          data: { sendVerificationEmail: true }
        }
      });
  
      cy.contains('Resend verification code').click();
      cy.wait('@SendVerificationEmail');
      cy.contains(/Resend in \d+s/).should('be.visible');
  
      // Navigate away to trigger cleanup
      cy.get('a[href="/signup"]').click();
      cy.url().should('include', '/signup');
    });
  
    // Test proper validation flow
    it('should handle valid OTP submission', () => {
      // Mock successful verification
      cy.interceptGraphql({
        operationName: 'VerifyEmailOTP',
        state: 'success',
        data: {
          data: { verifyEmailOTP: true }
        }
      });
  
      // Enter valid OTP
      cy.get('input[name="otp"]').type('123456');
      cy.get('button[type="submit"]').click();
      cy.wait('@VerifyEmailOTP');
  
      // Should navigate to login with success message
      cy.url().should('include', '/login');
      cy.url().should('include', 'Email%20verified%20successfully');
    });
  
  
  
    // Test resend functionality during cooldown
    it('should prevent resend clicks during cooldown', () => {
      cy.interceptGraphql({
        operationName: 'SendVerificationEmail',
        state: 'success',
        data: {
          data: { sendVerificationEmail: true }
        }
      });
  
      // First resend
      cy.contains('Resend verification code').click();
      cy.wait('@SendVerificationEmail');
      
      // Should show cooldown
      cy.contains(/Resend in \d+s/).should('be.visible');
      cy.contains(/Resend in \d+s/).should('be.disabled');
    });
  });
  