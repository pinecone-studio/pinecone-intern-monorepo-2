/// <reference types="cypress" />

describe('SearchFromAllUsers Component', () => {
  const mockUsers = [
    { _id: '1', userName: 'johndoe', fullName: 'John Doe' },
    { _id: '2', userName: 'janedoe', fullName: 'Jane Doe' },
  ];

  beforeEach(() => {
    // Intercept the GraphQL query and mock its response
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'SearchUsers') {
        req.reply({
          statusCode: 200,
          body: { data: { searchUsers: mockUsers } },
        });
      }
    }).as('searchUsersQuery');

    // Visit the page where the component is rendered
    cy.visit('/home'); // Replace with the correct route
  });

  it('should render the search input and default UI', () => {
    // Check if the component renders properly
    cy.get('[data-testid="search-users-component"]').should('exist');
    cy.get('input[placeholder="Search"]').should('be.visible');
  });

  // it('should display loading state when searching', () => {
  //   cy.get('input[placeholder="Search"]').type('john');

  //   // Debugging: Print the component DOM state
  //   cy.log('Checking if Loading text appears');
  //   cy.contains('Loading').should('exist');

  //   cy.wait('@searchUsersQuery').then(() => {
  //     cy.log('GraphQL Query finished');
  //   });
  // });

  it('should display search results after querying', () => {
    // Type a search term
    cy.get('input[placeholder="Search"]').type('john');

    // Wait for the GraphQL query to complete
    cy.wait('@searchUsersQuery');

    // Check if search results are displayed
    cy.contains('johndoe').should('exist');
    cy.contains('John Doe').should('exist');
    cy.contains('janedoe').should('exist');
    cy.contains('Jane Doe').should('exist');
  });

  it('should call refresh (refetch) when input changes', () => {
    // Spy on the GraphQL query
    cy.intercept('POST', '/api/graphql').as('refetchQuery');

    // Type a valid search term
    cy.get('input[placeholder="Search"]').type('john');

    // Wait for the first query
    cy.wait('@refetchQuery');

    // Clear the input and type again
    cy.get('input[placeholder="Search"]').clear().type('jane');

    // Wait for the second query
    cy.wait('@refetchQuery');
  });
});
