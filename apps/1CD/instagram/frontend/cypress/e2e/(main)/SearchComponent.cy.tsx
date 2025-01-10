// /// <reference types="cypress" />

// describe('SearchFromAllUsers Component', () => {
//   const mockUsers = [
//     { _id: '1', userName: 'johndoe', fullName: 'John Doe' },
//     { _id: '2', userName: 'janedoe', fullName: 'Jane Doe' },
//   ];

//   beforeEach(() => {
//     cy.intercept('POST', '/api/graphql', (req) => {
//       if (req.body.operationName === 'SearchUsers') {
//         req.reply({
//           statusCode: 200,
//           body: { data: { searchUsers: mockUsers } },
//         });
//       }
//     }).as('searchUsersQuery');

//     cy.visit('/home');
//   });

//   it('should render the search input and default UI after clicking the search button', () => {
//     cy.get('[data-testid="searchBtn"]').click();

//     cy.get('[data-testid="search-users-component"]').should('exist');

//     cy.get('input[placeholder="Search"]').should('be.visible');
//   });

//   it('should display search results after querying', () => {
//     cy.get('[data-testid="searchBtn"]').click();

//     cy.get('input[placeholder="Search"]').type('john');

//     cy.wait('@searchUsersQuery');

//     cy.contains('johndoe').should('exist');
//     cy.contains('John Doe').should('exist');
//     cy.contains('janedoe').should('exist');
//     cy.contains('Jane Doe').should('exist');
//   });

//   it('should call refresh (refetch) when input changes', () => {
//     cy.get('[data-testid="searchBtn"]').click();

//     cy.intercept('POST', '/api/graphql').as('refetchQuery');

//     cy.get('input[placeholder="Search"]').type('john');
//     cy.wait('@refetchQuery');

//     cy.get('input[placeholder="Search"]').clear().type('jane');
//     cy.wait('@refetchQuery');
//   });
// });
