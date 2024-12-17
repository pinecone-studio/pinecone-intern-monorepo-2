describe('Signup page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('1. should render signup page with all elements', () => {
    cy.get('[data-cy="signup-page"]').should('be.visible');
    cy.get('img[alt="Instagram Logo"]').should('be.visible');
    cy.get('[data-cy="signup-input-email"]').should('be.visible');
    cy.get('[data-cy="signup-input-fullName"]').should('be.visible');
    cy.get('[data-cy="signup-input-userName"]').should('be.visible');
    cy.get('[data-cy="signup-input-password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Sign up');
  });

  it('2. should show validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="signup-input-error-email"]').should('be.visible').and('have.text', 'Email must be at least 2 characters.');

    cy.get('[data-cy="signup-input-error-fullName"]').should('be.visible').and('have.text', 'First name must be at least 2 characters.');

    cy.get('[data-cy="signup-input-error-userName"]').should('be.visible').and('have.text', 'Last name must be at least 2 characters.');

    cy.get('[data-cy="signup-input-error-password"]').should('be.visible').and('have.text', 'Password must be at least 6 characters.');
  });

  it('3. should handle successful signup', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'Signup') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              signup: {
                token: 'fake-token',
                user: {
                  id: '1',
                  email: 'test@example.com',
                  fullName: 'Test User',
                  userName: 'testuser',
                },
              },
            },
          },
        });
      }
    }).as('signupMutation');

    cy.get('[data-cy="signup-input-email"]').type('test@example.com');
    cy.get('[data-cy="signup-input-fullName"]').type('Test User');
    cy.get('[data-cy="signup-input-userName"]').type('testuser');
    cy.get('[data-cy="signup-input-password"]').type('password123');

    cy.get('button[type="submit"]').click();
    cy.wait('@signupMutation');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('4. should show toast error when user already exists', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'Signup') {
        req.reply({
          statusCode: 200,
          body: {
            errors: [
              {
                message: 'User already exists',
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
              },
            ],
          },
        });
      }
    }).as('signupMutation');

    cy.get('[data-cy="signup-input-email"]').type('existing@example.com');
    cy.get('[data-cy="signup-input-fullName"]').type('Test User');
    cy.get('[data-cy="signup-input-userName"]').type('testuser');
    cy.get('[data-cy="signup-input-password"]').type('password123');

    cy.get('button[type="submit"]').click();
    cy.wait('@signupMutation');

    cy.get('[role="status"]').should('be.visible').first().should('contain.text', 'Error').and('contain.text', 'User already exists');
  });
});
