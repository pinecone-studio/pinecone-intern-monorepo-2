// cypress/e2e/signup/signup-complete.errors.cy.tsx
describe('Signup Complete Flow Tests - Error Handling', () => {
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

  it('should handle network errors gracefully', () => {
    cy.intercept('POST', 'http://localhost:4200/api/graphql', {
      forceNetworkError: true,
    }).as('networkError');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait('@networkError');

    // Wait for toast to appear and check its content
    cy.wait(1000); // Give time for toast to render
    cy.get('body').should('contain', 'Something went wrong');
  });

  it('should handle server errors gracefully', () => {
    cy.intercept('POST', 'http://localhost:4200/api/graphql', {
      statusCode: 500,
      body: {
        data: null,
        errors: [{ message: 'Internal server error' }],
      },
    }).as('serverError');

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait('@serverError');

    // Wait for toast to appear and check its content
    cy.wait(1000); // Give time for toast to render
    cy.get('body').should('contain', 'Internal server error');
  });
});
