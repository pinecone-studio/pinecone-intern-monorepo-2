describe('Verify OTP Page - Resend Functionality and Edge Cases', () => {
  const testEmail = 'test@example.com';
  
  beforeEach(() => {
    const testEmailEncoded = encodeURIComponent(testEmail);
    cy.visit(`/verify-otp?email=${testEmailEncoded}`);
  });

  it('should handle successful resend verification email', () => {
    cy.interceptGraphql({
      operationName: 'SendVerificationEmail',
      state: 'success',
      data: {
        data: {
          sendVerificationEmail: true
        }
      }
    });

    cy.contains('Resend verification code').click();
    
    cy.wait('@SendVerificationEmail');
    cy.contains('Resend in 60s').should('be.visible');
  });

  it('should handle resend email errors', () => {
    cy.interceptGraphql({
      operationName: 'SendVerificationEmail',
      state: 'error',
      data: {
        errors: [{
          message: 'Too many requests. Please try again later.',
          extensions: { code: 'RATE_LIMIT_EXCEEDED' }
        }]
      }
    });

    cy.contains('Resend verification code').click();
    
    cy.wait('@SendVerificationEmail');
    cy.contains('Too many requests. Please try again later.').should('be.visible');
  });

  it('should show loading state during resend', () => {
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'SendVerificationEmail') {
        req.reply({
          delay: 1000,
          statusCode: 200,
          body: {
            data: { sendVerificationEmail: true }
          }
        });
      }
    }).as('SendVerificationEmail');

    cy.contains('Resend verification code').click();
    cy.contains('Sending...').should('be.visible');
    
    cy.wait('@SendVerificationEmail');
    cy.contains('Resend in 60s').should('be.visible');
  });

  it('should handle cooldown timer correctly', () => {
    cy.interceptGraphql({
      operationName: 'SendVerificationEmail',
      state: 'success',
      data: {
        data: {
          sendVerificationEmail: true
        }
      }
    });

    cy.contains('Resend verification code').click();
    cy.wait('@SendVerificationEmail');
    
    // Should show countdown
    cy.contains('Resend in 60s').should('be.visible');
    
    // Wait a second and check countdown decreases
    cy.wait(1100);
    cy.contains('Resend in 59s').should('be.visible');
    
    // Button should be disabled during cooldown
    cy.get('button').contains('Resend in').should('be.disabled');
  });

  it('should clear error on successful resend', () => {
    // First cause an error
    cy.interceptGraphql({
      operationName: 'VerifyEmailOTP',
      state: 'error',
      data: {
        errors: [{ message: 'Invalid OTP' }]
      }
    });

    const testOtp = '123456';
    cy.get('input[placeholder="000000"]').type(testOtp);
    cy.get('button[type="submit"]').click();
    cy.wait('@VerifyEmailOTP');
    cy.contains('Invalid OTP').should('be.visible');

    // Then successful resend should clear error
    cy.interceptGraphql({
      operationName: 'SendVerificationEmail',
      state: 'success',
      data: {
        data: {
          sendVerificationEmail: true
        }
      }
    });

    cy.contains('Resend verification code').click();
    cy.wait('@SendVerificationEmail');
    cy.contains('Invalid OTP').should('not.exist');
  });
});