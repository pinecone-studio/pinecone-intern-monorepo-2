// cypress/e2e/signup/signup-complete.form.cy.tsx
describe('Signup Complete Flow Tests - Password Creation', () => {
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

    // Navigate through previous steps
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@graphqlRequest');

    const otp = '1234';
    otp.split('').forEach((digit, index) => {
      cy.get('input[type="text"]').eq(index).type(digit);
    });
    cy.get('button').contains('Verify').click();
    cy.wait('@graphqlRequest');
  });

  it('should display password creation form correctly', () => {
    cy.contains('Create password').should('be.visible');
    cy.contains('Use a minimum of 10 characters').should('be.visible');
    cy.get('input[placeholder="Enter your password"]').should('be.visible');
    cy.get('input[placeholder="Confirm your password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Continue');
  });

  it('should toggle password visibility', () => {
    cy.get('input[placeholder="Enter your password"]').should('have.attr', 'type', 'password');
    cy.get('img[alt="eye"]').first().click();
    cy.get('input[placeholder="Enter your password"]').should('have.attr', 'type', 'text');
  });

  it('should show validation errors for weak password', () => {
    cy.get('input[placeholder="Enter your password"]').type('weak');
    cy.contains('Password must be at least 10 characters').should('be.visible');

    cy.get('input[placeholder="Enter your password"]').clear().type('weakpassword');
    cy.contains('Password must include uppercase, lowercase, and number').should('be.visible');
  });

  it('should show error for mismatched passwords', () => {
    cy.get('input[placeholder="Enter your password"]').type('StrongPass123');
    cy.get('input[placeholder="Confirm your password"]').type('DifferentPass123');
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should successfully create account with valid passwords', () => {
    cy.get('input[placeholder="Enter your password"]').type('StrongPass123');
    cy.get('input[placeholder="Confirm your password"]').type('StrongPass123');
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();

    cy.wait('@graphqlRequest');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
