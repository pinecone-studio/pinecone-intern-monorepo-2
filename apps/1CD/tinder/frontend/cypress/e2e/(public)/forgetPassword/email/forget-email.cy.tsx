describe('forgetpassword with email page', () => {
    beforeEach(() => {
      cy.visit('/forgetPassword/email');
    });
  
    it('1. should render the forget password page correctly', () => {
      cy.get('[data-cy="forgetpassword-email-header"]').should('be.visible');
      cy.contains('tinder').should('be.visible');
      cy.contains('Forget password').should('be.visible');
      cy.contains('Enter your email account to reset password').should('be.visible');
    });
  
    it('2. should display the email input field and accept user input', () => {
      cy.get('[data-cy="forgetpassword-email-input"]').should('be.visible').and('have.attr', 'placeholder', 'name@example.com');
      cy.get('[data-cy="forgetpassword-email-input"]').type('test@gmail.com').should('have.value', 'test@gmail.com');
    });
  
    it('3. should display the continue button and interact with it', () => {
      cy.get('[data-cy="forgetpassword-continue-button"]').should('be.visible').and('contain.text', 'Continue');
      cy.get('[data-cy="forgetpassword-email-input"]').type('test@example.com');
      cy.get('[data-cy="forgetpassword-continue-button"]').should('be.enabled');
    });
  
    it('4. should show a toast notification when no email is provided', () => {
      cy.get('[data-cy="forgetpassword-continue-button"]').click();
      cy.contains('Email not found').should('be.visible');
    });
  
    it('5. should redirect to otp page', () => {
      const mockEmail = 'cypress@gmail.com';
      cy.get('[data-cy="forgetpassword-email-input"]').type(mockEmail);
      cy.get('[data-cy="forgetpassword-continue-button"]').click();
  
      cy.window().then((window) => {
        expect(window.localStorage.setItem('userEmail', mockEmail));
        expect(window.localStorage.getItem('userEmail')).to.equal(mockEmail);
      });
  
      cy.url().should('include', '/forgetPassword/otp');
    });
  });