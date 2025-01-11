// import { interceptGraphql } from "cypress/utils/intercept-graphql";

// describe('ArtistPage', () => {
//   beforeEach(() => {
//     const mockToken = {
//       token: 'faketoken',
//     };
//     cy.window().then((window) => {
//       window.localStorage.setItem('token', JSON.stringify(mockToken));
//     });
//     interceptGraphql({
//       state: '',
//       operationName: 'getArtist',
//       data: {
//         data: {
//           getMe: {
//             email: 'example@gmail.com',
//             role: 'admin',
//             phoneNumber: '+976 95160812',
//             __typename: 'User',
//           },
//         },
//       },
//     });
//     cy.visit('/admin/artist');
//   });

//   it('should display the requests table when data is loaded', () => {
//     cy.get('[data-cy=loading-text]').should('be.visible');
//   });

describe('Artist Page', () => {
    beforeEach(() => {
        cy.visit('/user/sign-in');
        cy.get('input[name="email"]').type('adminDev@gmail.com');
        cy.get('input[name="password"]').type('@Pi88923');
        cy.get('[data-cy="Sign-In-Submit-Button"]').should('be.visible').click();
        cy.get('.toast').should('contain', 'Successfully login');
        cy.url().should('include', '/admin/home');
        cy.visit('/admin/artist');
      });
  
    it('should render the page with correct header and information', () => {
      cy.get('[data-cy="Artist-Components"]').should('exist');
      // Check for the artist page title and description
      cy.get('h3').should('have.text', 'Артист');
      cy.get('p').should('have.text', 'Бүх артистийн мэдээлэл');
  
    });

    it('should render the copyright text', () => {
        cy.get('[data-cy="Admin-Footer"]').should('be.visible');
        cy.get('[data-cy="Admin-Footer"]').should('contain.text', '©2024 Copyright');
      });
  
   
  });

  