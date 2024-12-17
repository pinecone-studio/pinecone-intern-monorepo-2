describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('1. should render login page with all elements', () => {
    cy.get('[data-cy="login-logo"]').should('be.visible');
    cy.get('[data-cy="login-input-email"]').should('be.visible');
    cy.get('[data-cy="login-input-password"]').should('be.visible');
    cy.get('[data-cy="login-submit"]').should('be.visible').and('contain', 'Log in');
    cy.get('[data-cy="login-forgot-password"]').should('be.visible');
    cy.get('[data-cy="login-signup-link"]').should('be.visible');
  });

  it('2. should show validation errors when submitting an empty form', () => {
    cy.get('[data-cy="login-submit"]').click();

    cy.get('[data-cy="login-input-error-email"]').should('be.visible').and('have.text', 'Invalid email address.');
    cy.get('[data-cy="login-input-error-password"]').should('be.visible').and('have.text', 'Password must be at least 8 characters.');
  });

  it('3. should handle successful login', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              login: {
                token: 'fake-token',
                user: {
                  id: '1',
                  email: 'test@example.com',
                },
              },
            },
          },
        });
      }
    }).as('loginMutation');

    cy.get('[data-cy="login-input-email"]').type('test@example.com');
    cy.get('[data-cy="login-input-password"]').type('password123');
    cy.get('[data-cy="login-submit"]').click();

    cy.wait('@loginMutation');
    cy.url().should('eq', Cypress.config().baseUrl + '/home');
  });

  it('4. should show toast error when login fails', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({
          statusCode: 400,
          body: {
            errors: [
              {
                message: 'Invalid credentials',
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                },
              },
            ],
          },
        });
      }
    }).as('loginMutation');

    cy.get('[data-cy="login-input-email"]').type('invalid@example.com');
    cy.get('[data-cy="login-input-password"]').type('wrongpassword');
    cy.get('[data-cy="login-submit"]').click();
    cy.wait('@loginMutation');

    cy.get('[role="status"]').should('be.visible').first().should('contain.text', 'Error').and('contain.text', 'User not found');
  });
});
