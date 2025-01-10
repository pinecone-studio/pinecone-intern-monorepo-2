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

//   it('should render artis page', () => {
//     cy.get('[data-cy="table-header"]').should('be.visible');
//     cy.get('[data-cy="Artist-Components"]').find('h3').should('contain.text', 'Артист');
//     cy.get('[data-cy="Artist-Components"]').find('p').should('contain.text', 'Бүх артистийн мэдээлэл');
//   });
// });
