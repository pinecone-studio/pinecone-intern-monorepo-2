// cypress/e2e/signup/signup-complete.flow.cy.tsx
describe('Signup Complete Flow Tests - Full Integration', () => {
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

  it('should complete entire signup flow successfully', () => {
    // Step 1: Email
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@graphqlRequest');

    // Step 2: OTP
    const otp = '1234';
    otp.split('').forEach((digit, index) => {
      cy.get('input[type="text"]').eq(index).type(digit);
    });
    cy.get('button').contains('Verify').click();
    cy.wait('@graphqlRequest');

    // Step 3: Password
    cy.get('input[placeholder="Enter your password"]').type('MyPassword123');
    cy.get('input[placeholder="Confirm your password"]').type('MyPassword123');
    cy.get('button[type="submit"]').click();
    cy.wait('@graphqlRequest');

    // Should be redirected to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    // Wait for success toast to appear
    cy.wait(1000);
    cy.get('body').should('contain', 'User created successfully');
  });
});
