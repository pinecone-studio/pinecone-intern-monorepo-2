import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('VerifyEmail Component', () => {
  beforeEach(() => {
    cy.visit('/user/verify-email');
  });
  it('should show success toast and loader when email is verified successfully', () => {
    interceptGraphql({
      state: '',
      operationName: 'VerifyUserEmail',
      data: {
        data: {
          verifyUserEmail: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    interceptGraphql({
      state: '',
      operationName: 'VerifyOtp',
      data: {
        data: {
          verifyOtp: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.get('[data-cy="input-email"]').type('test@gmail.com').should('have.value', 'test@gmail.com');
    cy.get('[data-cy="Verify-Email-Submit-Button"]').should('be.visible').should('be.enabled').click();
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'Successfully sent otp to email');

    cy.get('[data-cy="otp-input-0"]').should('be.visible');
    cy.get('[data-cy="otp-input-1"]').should('be.visible');
    cy.get('[data-cy="otp-input-2"]').should('be.visible');
    cy.get('[data-cy="otp-input-3"]').should('be.visible');
    cy.get('[data-cy="otp-input"]').type('1234');
  });

  it('should show error toast when email verification fails', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'VerifyUserEmail',
      data: {
        errors: [
          {
            message: 'User not found',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy="input-email"]').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('[data-cy="Verify-Email-Submit-Button"]').should('be.visible').should('be.enabled').click();
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'User not found');
  });
  it('should show error toast when OTP verification fails (incorrect or expired)', () => {
    interceptGraphql({
      state: '',
      operationName: 'VerifyUserEmail',
      data: {
        data: {
          verifyUserEmail: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.get('[data-cy="input-email"]').type('test@gmail.com').should('have.value', 'test@gmail.com');
    cy.get('[data-cy="Verify-Email-Submit-Button"]').should('be.visible').should('be.enabled').click();
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'Successfully sent otp to email');
    interceptGraphql({
      state: 'error',
      operationName: 'VerifyUserEmail',
      data: {
        errors: [
          {
            message: 'Oops! The OTP is incorrect or has expired. Please try again.',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy="otp-input-0"]').should('be.visible');
    cy.get('[data-cy="otp-input-1"]').should('be.visible');
    cy.get('[data-cy="otp-input-2"]').should('be.visible');
    cy.get('[data-cy="otp-input-3"]').should('be.visible');
    cy.get('[data-cy="otp-input"]').type('1234');
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'Oops! The OTP is incorrect or has expired. Please try again.');
    cy.get('[data-cy="input-email"]').should('be.visible');
  });
  it('should show error toast when email verification fails', () => {
    interceptGraphql({
      state: '',
      operationName: 'VerifyUserEmail',
      data: {
        data: {
          verifyUserEmail: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.get('[data-cy="input-email"]').type('test@gmail.com').should('have.value', 'test@gmail.com');
    cy.get('[data-cy="Verify-Email-Submit-Button"]').should('be.visible').should('be.enabled').click();
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'Successfully sent otp to email');
    cy.clock();
    interceptGraphql({
      state: '',
      operationName: 'VerifyUserEmail',
      data: {
        data: {
          verifyUserEmail: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.get('[data-cy="resend-otp-button"]').click();
    cy.get('[data-cy="resend-otp-button"]').should('contain.text', 'Дахин илгээх (60)');
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'Successfully sent otp to email');
  });
  it('should start countdown when OTP is requested and decrease every second', () => {
    interceptGraphql({
      state: '',
      operationName: 'VerifyUserEmail',
      data: {
        data: {
          verifyUserEmail: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.get('[data-cy="input-email"]').type('test@gmail.com').should('have.value', 'test@gmail.com');
    cy.get('[data-cy="Verify-Email-Submit-Button"]').click();
    cy.get('.toast', { timeout: 10000 }).should('contain.text', 'Successfully sent otp to email');
    cy.clock(); // Start controlling time
    cy.get('[data-cy="resend-otp-button"]').should('contain.text', 'Дахин илгээх (90)');
    cy.tick(1000); // 1 second tick
    cy.get('[data-cy="resend-otp-button"]').should('contain.text', 'Дахин илгээх (89)');
    cy.tick(89000); // 89 seconds tick
    cy.get('[data-cy="resend-otp-button"]').should('contain.text', 'Дахин илгээх (0)');
    cy.get('[data-cy="resend-otp-button"]').should('contain.text', 'Дахин илгээх');
  });
});
