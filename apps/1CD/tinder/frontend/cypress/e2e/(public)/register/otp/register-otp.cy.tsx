


describe('verifying the otp', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('userEmail', 'tomorbatmonhtsatsral@gmail.com');
      });
      // localStorage.setItem('userEmail', 'test@example.com');
      cy.visit('/register/otp');
    });
  
    it('1.should display the intro text and otp input', () => {
      cy.contains('Confirm email').should('be.visible');
      cy.contains('Send again').should('exist');
    });
    it('2.should display the correct email and accept otp input', () => {
      cy.get('[data-cy="otp-instruction"]').contains('tomorbatmonhtsatsral@gmail.com');
      cy.get('[data-cy="otp-input"]').type('9686');
      cy.contains('OTP verified successfully!').should('be.visible');
      cy.url().should('include', '/register/password');
    });
    it('3.should reject otp and show toast', () => {
      cy.get('[data-cy="otp-input"]').type('1345');
      cy.contains('Failed to verify OTP. Please try again later.').should('be.visible');
    });
    it('4.should reject otp and show toast', () => {
      cy.get('[data-cy="otp-input"]').type('1345');
      cy.contains('Failed to verify OTP. Please try again later.').should('be.visible');
    });
    it('5.should resend otp and start countdown',()=>{
      cy.contains('Send again').should('be.visible').click();
      cy.contains('Send again (15)').should('be.visible');
      cy.wait(5000);
      cy.contains('Send again (10').should('be.visible');
      cy.wait(10000);
      cy.contains('Send again').should('be.visible');
    })
  });
  
  
  
  