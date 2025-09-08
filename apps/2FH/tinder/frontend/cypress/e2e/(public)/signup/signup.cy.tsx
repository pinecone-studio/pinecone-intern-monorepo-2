// cypress/e2e/signup-flow.cy.ts
describe('Signup Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/signup');

    // Mock GraphQL endpoints
    cy.intercept('POST', 'http://localhost:4200/api/graphql', (req) => {
      const { query, variables } = req.body;

      if (query.includes('SignupSendOtp')) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              signupSendOtp: {
                output: '1234',
              },
            },
          },
        });
      }

      if (query.includes('SignUpVerifyOtp')) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              signUpVerifyOtp: {
                input: variables.email,
                output: 'OTP verified successfully',
              },
            },
          },
        });
      }

      if (query.includes('CreateUser')) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createUser: 'SUCCESS',
            },
          },
        });
      }
    }).as('graphqlRequest');
  });

  describe('Step 1 - Email Input', () => {
    it('should display the signup form correctly', () => {
      cy.get('img[alt="logo"]').should('be.visible');
      cy.contains('Create an account').should('be.visible');
      cy.contains('Enter your email below to create your account').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Continue');
      cy.contains('Log in').should('be.visible');
    });

    it('should show validation error for empty email', () => {
      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('input[type="email"]').type('a').clear();
      cy.contains('Enter your email').should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.contains('Invalid email address').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should successfully submit valid email and proceed to OTP step', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').click();

      cy.wait('@graphqlRequest');
      cy.contains('Confirm your email').should('be.visible');
    });

    it('should handle already registered email error', () => {
      cy.intercept('POST', 'http://localhost:4200/api/graphql', {
        statusCode: 200,
        body: {
          data: null,
          errors: [
            {
              message: 'Email is already registered',
            },
          ],
        },
      }).as('registeredEmailRequest');

      cy.get('input[type="email"]').type('existing@example.com');
      cy.get('button[type="submit"]').click();

      cy.wait('@registeredEmailRequest');
      // Toast notification should appear (assuming you have a way to test it)
      cy.get('[data-sonner-toast]').should('contain', 'Email is already registered');
    });

    it('should navigate to signin page when clicking login link', () => {
      cy.get('a[href="/signin"]').click();
      cy.url().should('include', '/signin');
    });
  });

  describe('Step 2 - OTP Confirmation', () => {
    beforeEach(() => {
      // Navigate to OTP step
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      cy.wait('@graphqlRequest');
    });

    it('should display OTP confirmation form correctly', () => {
      cy.contains('Confirm your email').should('be.visible');
      cy.contains('test@example.com').should('be.visible');
      cy.get('input[type="text"]').should('have.length', 4);
      cy.get('button').contains('Verify').should('be.visible');
      cy.get('button').contains('Send again').should('be.visible');
    });

    it('should allow entering 4-digit OTP', () => {
      const otp = '1234';
      otp.split('').forEach((digit, index) => {
        cy.get('input[type="text"]').eq(index).type(digit);
      });

      cy.get('input[type="text"]').eq(0).should('have.value', '1');
      cy.get('input[type="text"]').eq(1).should('have.value', '2');
      cy.get('input[type="text"]').eq(2).should('have.value', '3');
      cy.get('input[type="text"]').eq(3).should('have.value', '4');
    });

    it('should auto-focus next input when typing', () => {
      cy.get('input[type="text"]').eq(0).type('1');
      cy.get('input[type="text"]').eq(1).should('be.focused');
    });

    it('should successfully verify OTP and proceed to password step', () => {
      const otp = '1234';
      otp.split('').forEach((digit, index) => {
        cy.get('input[type="text"]').eq(index).type(digit);
      });

      cy.get('button').contains('Verify').click();
      cy.wait('@graphqlRequest');
      cy.contains('Create password').should('be.visible');
    });

    it('should handle resend OTP functionality', () => {
      cy.get('button').contains('Send again').should('be.disabled');
      cy.wait(16000);
      cy.get('button').contains('Send again').should('not.be.disabled');
      cy.get('button').contains('Send again').click();
      cy.wait('@graphqlRequest');
    });
  });
});
