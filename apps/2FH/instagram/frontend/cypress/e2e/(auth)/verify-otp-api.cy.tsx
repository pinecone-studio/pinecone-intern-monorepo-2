describe('Verify OTP Page - Navigation and UI Interactions', () => {
    const testEmail = 'test@example.com';
    
    beforeEach(() => {
      const testEmailEncoded = encodeURIComponent(testEmail);
      cy.visit(`/verify-otp?email=${testEmailEncoded}`);
    });
  
    it('should navigate back to signup page', () => {
      cy.get('a[href="/signup"]').click();
      cy.url().should('include', '/signup');
    });
  
    it('should display Instagram logo correctly', () => {
      cy.get('img[alt="Instagram"]')
        .should('be.visible')
        .should('have.attr', 'src', '/Instagram_logo.svg');
    });
  
    it('should have proper form structure and accessibility', () => {
      cy.get('form').should('exist');
      cy.get('input[id="otp"]').should('have.attr', 'name', 'otp');
      cy.get('input[id="otp"]').should('have.attr', 'required');
      cy.get('input[id="otp"]').should('have.attr', 'type', 'text');
      cy.get('input[id="otp"]').should('have.attr', 'maxLength', '6');
    });
  
    it('should handle form submission with Enter key', () => {
      cy.interceptGraphql({
        operationName: 'VerifyEmailOTP',
        state: 'success',
        data: {
          data: {
            verifyEmailOTP: true
          }
        }
      });
  
      const testOtp = '123456';
      cy.get('input[placeholder="000000"]').type(testOtp);
      cy.get('input[placeholder="000000"]').type('{enter}');
      
      cy.wait('@VerifyEmailOTP');
      cy.url().should('include', '/login');
    });
  
    it('should maintain focus and styling states', () => {
      const otpInput = cy.get('input[placeholder="000000"]');
      
      // Focus state
      otpInput.focus();
      otpInput.should('have.class', 'focus:border-gray-400');
      otpInput.should('have.class', 'focus:bg-white');
      
      // Check disabled state styling
      cy.get('button[type="submit"]').should('have.class', 'disabled:bg-blue-300');
      cy.get('button[type="submit"]').should('have.class', 'disabled:cursor-not-allowed');
    });
  
    it('should handle different email formats correctly', () => {
      const longEmail = 'verylongemailaddress@example.com';
      const longEmailEncoded = encodeURIComponent(longEmail);
      cy.visit(`/verify-otp?email=${longEmailEncoded}`);
      cy.contains(longEmail).should('be.visible');
      
      const specialEmail = 'user+test@sub.domain.com';
      const specialEmailEncoded = encodeURIComponent(specialEmail);
      cy.visit(`/verify-otp?email=${specialEmailEncoded}`);
      cy.contains(specialEmail).should('be.visible');
    });
  
    it('should handle malformed email parameter gracefully', () => {
      cy.visit('/verify-otp?email=invalid-email');
      cy.contains('invalid-email').should('be.visible');
      cy.get('input[placeholder="000000"]').should('be.visible');
    });
  
    it('should handle missing email parameter by redirecting', () => {
      cy.visit('/verify-otp?email=');
      cy.url().should('include', '/signup');
    });
  
    it('should maintain responsive design', () => {
      // Test mobile viewport
      cy.viewport(375, 667);
      cy.get('input[placeholder="000000"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
      
      // Test desktop viewport
      cy.viewport(1280, 720);
      cy.get('input[placeholder="000000"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
});