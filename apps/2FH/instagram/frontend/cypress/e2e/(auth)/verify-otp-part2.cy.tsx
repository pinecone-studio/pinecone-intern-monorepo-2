describe('Verify OTP Page - Resend, Error, and Lifecycle', () => {
    const testEmail = 'test@example.com';
  
    beforeEach(() => {
      // Mock GraphQL responses to prevent actual API calls
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'VerifyEmailOTP') {
          req.reply({ data: { verifyEmailOTP: true } });
        } else if (req.body.operationName === 'SendVerificationEmail') {
          req.reply({ data: { sendVerificationEmail: true } });
        }
      }).as('graphqlRequest');
    });
  
    // Test resend functionality to cover those code paths
    it('should test resend functionality and cooldown', () => {
      const encodedEmail = encodeURIComponent(testEmail);
      cy.visit(`/verify-otp?email=${encodedEmail}`);
      
      // Test resend OTP
      cy.contains('Resend verification code').click();
      cy.wait('@graphqlRequest');
      
      // Should show cooldown
      cy.contains(/Resend in \d+s/).should('be.visible');
      
      // Button should be disabled during cooldown
      cy.get('button:contains("Resend in")').should('be.disabled');
    });
  
    // Test error handling to cover error state lines
    it('should handle GraphQL errors', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'VerifyEmailOTP') {
          req.reply({
            body: {
              errors: [{ message: 'Invalid OTP code', extensions: { code: 'INVALID_OTP' } }]
            }
          });
        }
      }).as('graphqlError');
  
      const encodedEmail = encodeURIComponent(testEmail);
      cy.visit(`/verify-otp?email=${encodedEmail}`);
      
      cy.get('input[name="otp"]').type('123456');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@graphqlError');
      cy.contains('Invalid OTP code').should('be.visible');
    });
  
    // Test the useEffect cleanup and timer functionality
    it('should handle component lifecycle and timers', () => {
      const encodedEmail = encodeURIComponent(testEmail);
      cy.visit(`/verify-otp?email=${encodedEmail}`);
      
      // Start resend cooldown
      cy.contains('Resend verification code').click();
      cy.wait('@graphqlRequest');
      
      // Verify cooldown is active
      cy.contains(/Resend in \d+s/).should('be.visible');
      
      // Navigate away to test cleanup
      cy.get('a[href="/signup"]').click();
      cy.url().should('include', '/signup');
    });
  
    // Test loading states
    it('should show loading states during API calls', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'VerifyEmailOTP') {
          req.reply({
            delay: 1000,
            body: { data: { verifyEmailOTP: true } }
          });
        }
      }).as('slowGraphql');
  
      const encodedEmail = encodeURIComponent(testEmail);
      cy.visit(`/verify-otp?email=${encodedEmail}`);
      
      cy.get('input[name="otp"]').type('123456');
      cy.get('button[type="submit"]').click();
      
      // Should show loading state
      cy.contains('Verifying...').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');
      
      cy.wait('@slowGraphql');
    });
  
    // Test form interaction and input validation
    it('should handle input changes and validation', () => {
      const encodedEmail = encodeURIComponent(testEmail);
      cy.visit(`/verify-otp?email=${encodedEmail}`);
      
      const otpInput = cy.get('input[name="otp"]');
      
      // Test input filtering (only digits)
      otpInput.type('a1b2c3d4e5f6g7');
      otpInput.should('have.value', '123456');
      
      // Test length limitation
      otpInput.clear().type('1234567890');
      otpInput.should('have.value', '123456');
      
      // Test error clearing when typing
      cy.intercept('POST', '**/graphql', {
        body: { errors: [{ message: 'Test error' }] }
      }).as('errorResponse');
      
      otpInput.clear().type('123456');
      cy.get('button[type="submit"]').click();
      cy.wait('@errorResponse');
      cy.contains('Test error').should('be.visible');
      
      // Error should clear when typing
      otpInput.clear().type('1');
      cy.contains('Test error').should('not.exist');
    });
  });