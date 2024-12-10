describe('verifying the otp', () => {
    beforeEach(() => {
      cy.visit('/register/otp');
    });
  

    it('1.should display the intro text and otp input', () => {
      cy.contains('Confirm email').should('be.visible');
      cy.contains('Send again').should('exist');
    });
    it('2.should display the correct email and accept otp input', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('userEmail', 'cypress@gmail.com');
      });
      cy.window().then((win) => {
        win.localStorage.getItem('userEmail');
      });
      cy.get('[data-cy="otp-instruction"]').contains('cypress@gmail.com');
      cy.get('[data-cy="otp-input"]').type('0000');
      cy.url().should('include', '/register/password');
    });
    it('3.should reject otp and show toast', () => {
      cy.get('[data-cy="otp-input"]').type('1345');
      cy.contains('Failed to verify OTP. Please try again later.').should('exist');
    });
    it('4.should reject otp and show toast', () => {
      cy.get('[data-cy="otp-input"]').type('1345');
      cy.contains('Failed to verify OTP. Please try again later.').should('exist');
    });
    it('5.should resend otp and start countdown',()=>{
      cy.window().then((win) => {
        win.localStorage.setItem('userEmail', 'cypress@gmail.com');
      });
      cy.window().then((win) => {
        win.localStorage.getItem('userEmail');
      });
      cy.contains('Send again').should('be.visible').click();
      cy.contains('Send again (15)').should('be.visible');
      cy.wait(5000);
      cy.contains('New OTP sent to your email. Please check your email!').should('exist');
      cy.contains('Send again (10').should('be.visible');
      cy.wait(10000);
      cy.contains('Send again').should('be.visible');
    });
    it('6.should click on resend otp when canresend otp is false',()=>{
      cy.contains('Send again').should('be.visible').click();
      cy.contains('Send again (15)').should('be.visible');
      cy.contains('Send again').should('be.visible').click();
    });
    it('7.should be empty in stored email',()=>{
      cy.window().then((win) => {
        win.localStorage.setItem('userEmail', '');
      });
      cy.window().then((win) => {
        win.localStorage.getItem('userEmail');
      });
    });
    
  });



