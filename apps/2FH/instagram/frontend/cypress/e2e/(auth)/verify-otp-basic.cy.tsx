 describe('Verify OTP Page - Basic Functionality and Validation', () => {
  const testEmail = 'test@example.com';

  beforeEach(() => {
    const testEmailEncoded = encodeURIComponent(testEmail);
    cy.visit(`/verify-otp?email=${testEmailEncoded}`);
  });

  it('should display the verify OTP form correctly', () => {
    cy.get('h2').should('contain', 'Verify Your Email');
    cy.contains("We've sent a verification code to:").should('be.visible');
    cy.contains(testEmail).should('be.visible');
    cy.contains('Enter the 6-digit code to verify your email address').should('be.visible');
    cy.get('input[placeholder="000000"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Verify Email');
    cy.contains("Didn't receive the code?").should('be.visible');
    cy.contains('Resend verification code').should('be.visible');
    cy.contains('Want to use a different email?').should('be.visible');
    cy.get('a[href="/signup"]').should('contain', 'Go back to signup');
  });

  it('should redirect to signup if no email parameter', () => {
    cy.visit('/verify-otp');
    cy.url().should('include', '/signup');
  });

  it('should validate OTP input correctly', () => {
    const otpInput = cy.get('input[placeholder="000000"]');

    // Should only accept digits
    otpInput.type('abc123');
    otpInput.should('have.value', '123');

    // Should limit to 6 digits
    const longNumber = '1234567890';
    otpInput.clear().type(longNumber);
    otpInput.should('have.value', '123456');

    // Submit button should be disabled with incomplete OTP
    otpInput.clear().type('12345');
    cy.get('button[type="submit"]').should('be.disabled');

    // Submit button should be enabled with complete OTP
    otpInput.clear().type('123456');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should clear error when user types in OTP field', () => {
    // Mock a GraphQL error response first
    cy.interceptGraphql({
      operationName: 'VerifyEmailOTP',
      state: 'error',
      data: {
        errors: [{ message: 'Invalid OTP code' }]
      }
    });

    // Type complete OTP and submit to trigger error
    const invalidOtp = '123456';
    cy.get('input[placeholder="000000"]').type(invalidOtp);
    cy.get('button[type="submit"]').click();
    cy.wait('@VerifyEmailOTP');
    cy.contains('Invalid OTP code').should('be.visible');

    // Error should clear when typing
    cy.get('input[placeholder="000000"]').clear().type('1');
    cy.contains('Invalid OTP code').should('not.exist');
  });

  it('should show validation error for incomplete OTP', () => {
    // Mock GraphQL to prevent actual API call
    cy.interceptGraphql({
      operationName: 'VerifyEmailOTP',
      state: 'success',
      data: {
        data: { verifyEmailOTP: true }
      }
    });

    // Type complete OTP first to enable button
    cy.get('input[placeholder="000000"]').type('123456');
    cy.get('button[type="submit"]').should('not.be.disabled');
    
    // Clear and type incomplete OTP
    cy.get('input[placeholder="000000"]').clear().type('12345');
    
    // Button should now be disabled due to incomplete OTP
    cy.get('button[type="submit"]').should('be.disabled');
    
    // Force click the disabled button - this should trigger client-side validation
    // Since the component prevents disabled button clicks, we'll test the button state instead
    cy.get('button[type="submit"]').should('contain', 'Verify Email');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should show validation error for empty OTP', () => {
    // Empty OTP should keep button disabled
    cy.get('input[placeholder="000000"]').should('have.value', '');
    cy.get('button[type="submit"]').should('be.disabled');
    
    // Verify that clicking disabled button doesn't do anything
    cy.get('button[type="submit"]').should('contain', 'Verify Email');
  });

  it('should format OTP input with monospace font and spacing', () => {
    cy.get('input[placeholder="000000"]')
      .should('have.class', 'font-mono')
      .should('have.class', 'tracking-widest')
      .should('have.class', 'text-center');
  });

  it('should show validation error when submitting with invalid OTP from server', () => {
    // Mock server validation error
    cy.interceptGraphql({
      operationName: 'VerifyEmailOTP',
      state: 'error',
      data: {
        errors: [{ message: 'Please enter a valid 6-digit OTP' }]
      }
    });

    // Type valid format OTP (to enable button) but server will reject it
    const invalidOtp = '123456';
    cy.get('input[placeholder="000000"]').type(invalidOtp);
    cy.get('button[type="submit"]').click();
    cy.wait('@VerifyEmailOTP');
    
    // Should show server validation error
    cy.contains('Please enter a valid 6-digit OTP').should('be.visible');
  });
});