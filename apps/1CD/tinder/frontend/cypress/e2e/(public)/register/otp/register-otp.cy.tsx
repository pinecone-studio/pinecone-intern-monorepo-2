describe('verifying the otp', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('userEmail', 'tomorbatmonhtsatsral@gmail.com');
    });
    cy.visit('/register/otp');
  });

  it('1.should display the intro text and otp input', () => {
    cy.contains('Confirm email').should('be.visible');
    cy.contains('Send again (15)').should('exist');
  });
  it('2.should display the correct email and accept otp input', () => {
    cy.get('[data-cy="otp-instruction"]').contains('tomorbatmonhtsatsral@gmail.com');
    cy.get('[data-cy="otp-input"]').type('0000');
    cy.contains('Otp is verified').should('exist');
    cy.url().should('include', '/register/password');
  });
  it('3.should reject otp and show toast', () => {
    cy.get('[data-cy="otp-input"]').type('1345');
    cy.contains('Invalid OTP. Please try again.').should('be.visible');
  });
});
