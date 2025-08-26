describe('Sign up', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'VerifyOtp') {
        req.reply({
          data: {
            verifyOtp: {
              message: 'success',
            },
          },
        });
      }
    });
    cy.visit('/signup');
    cy.get('[data-cy=Sign-Up-Container]').should('be.visible');
    cy.get('[data-cy=Child-Container]').should('be.visible');
  });
  it('1. Has render sign up page', () => {
    cy.get('[data-cy=Logo-Container]').should('be.visible');
  });
  it('2. Should throw error when input wrong email', () => {
    cy.get('[data-cy=Enter-Email-Component-Container]').should('be.visible');
    cy.get('[data-cy=Enter-Email-Input]').should('be.visible');
    cy.get('[data-cy=Enter-Email-Input]').type('example');
    cy.get('[data-cy=Create-User-Email-Btn]').click();
    cy.get('[data-cy=Error-Input-Value]').should('have.text', 'Enter email error');
  });
  it('3. Should Successfully create user email', () => {
    cy.get('[data-cy=Enter-Email-Component-Container]').should('be.visible');
    cy.get('[data-cy=Enter-Email-Input]').should('be.visible');
    cy.get('[data-cy=Enter-Email-Input]').type('example@gmail.com');
    cy.get('[data-cy=Create-User-Email-Btn]').click();
    cy.get('[data-cy=Email-Validate-Container]').should('be.visible');
  });
  it('4. Should successfully verify OTP and jump to enter password component', () => {
    cy.get('[data-cy=Enter-Email-Component-Container]').should('be.visible');
    cy.get('[data-cy=Enter-Email-Input]').should('be.visible');
    cy.get('[data-cy=Enter-Email-Input]').type('example@gmail.com');
    cy.get('[data-cy=Create-User-Email-Btn]').click();
    cy.get('[data-cy=Email-Validate-Container]').should('be.visible');
    cy.get('[data-cy=Otp-Inputs]').should('be.visible').type('1234');
    cy.get('[data-cy=Enter-Password-Component]').should('be.visible');
  });
});
