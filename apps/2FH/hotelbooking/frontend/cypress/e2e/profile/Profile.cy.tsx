// cypress/e2e/profile/Profile.cy.ts
describe('User Profile Page E2E', () => {
  const fakeToken = 'fake-jwt-token';

  it('renders loading state', () => {
    // Clear token so UserAuthProvider starts loading
    window.localStorage.removeItem('token');

    // Intercept GraphQL to delay response
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMe') {
        req.reply({
          delay: 2000,
          data: { getMe: null },
        });
      }
    }).as('getMe');

    cy.visit('/user-profile');

    // Loading message should appear
    cy.get('[data-cy=loading-profile]').should('contain.text', 'Loading profile...');
  });

  it('redirects to login if no user', () => {
    window.localStorage.setItem('token', fakeToken);

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMe') {
        req.reply({ data: { getMe: null } });
      }
    }).as('getMe');

    cy.visit('/user-profile');

    cy.wait('@getMe');

    // Should redirect to login
    cy.url().should('include', '/login');
  });

  it('renders profile form with pre-filled values', () => {
    window.localStorage.setItem('token', fakeToken);

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMe') {
        req.reply({
          data: {
            getMe: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              role: 'user',
              dateOfBirth: '1990-01-01',
            },
          },
        });
      }
    }).as('getMe');

    cy.visit('/user-profile');

    cy.wait('@getMe');

    cy.get('[data-cy=profile-page]').should('exist');
    cy.get('[data-cy=input-firstName]').should('have.value', 'John');
    cy.get('[data-cy=input-lastName]').should('have.value', 'Doe');
    cy.get('[data-cy=input-email]').should('have.value', 'john@example.com');
    cy.get('[data-cy=input-dob]').should('have.value', '1990-01-01');
  });

  it('updates profile and shows Sonner toast', () => {
    window.localStorage.setItem('token', fakeToken);

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMe') {
        req.reply({
          data: {
            getMe: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              role: 'user',
              dateOfBirth: '1990-01-01',
            },
          },
        });
      }
    }).as('getMe');

    cy.visit('/user-profile');

    cy.wait('@getMe');

    cy.get('[data-cy=input-firstName]').clear().type('Jane');
    cy.get('[data-cy=btn-updateProfile]').click();

    cy.get('[data-sonner-toast]').should('contain.text', 'Profile updated!');
  });
});
