('');
describe('Login Page E2E', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=login-container]').should('be.visible');
  });

  it('1. should display login page correctly', () => {
    cy.get('img[alt="Logo"]').should('be.visible');
  });

  it('2. should login successfully with valid credentials', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({
          data: {
            login: {
              token: 'fake-jwt-token',
              user: { firstName: 'Test', email: 'test@example.com' },
            },
          },
        });
      }
    }).as('graphqlLogin');

    cy.get('[data-cy=login-email]').type('test@example.com');
    cy.get('[data-cy=login-password]').type('Password123');
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@graphqlLogin');

    // Assert token exists in localStorage
    cy.window().its('localStorage.token').should('exist');

    // Assert redirect
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('3. should show error on invalid login', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'Login') {
        req.reply({
          errors: [{ message: 'Invalid credentials' }],
        });
      }
    }).as('graphqlLoginFail');

    cy.get('[data-cy=login-email]').type('wrong@example.com');
    cy.get('[data-cy=login-password]').type('wrongpassword');
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@graphqlLoginFail');

    // Check if toast exists, but with longer wait
    cy.get('[data-cy=login-failed-toast]', { timeout: 10000 }).should('be.visible').and('contain.text', 'Invalid credentials');
  });
});
