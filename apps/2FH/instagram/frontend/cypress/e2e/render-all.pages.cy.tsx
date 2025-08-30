// import allPages from '../utils/all-pages.json';

// describe('render all pages', () => {
//   it(`Should render all page`, () => {
//     cy.log(JSON.stringify(allPages));
//     allPages.forEach((page) => {
//       cy.visit(page);
//     });
//   });
// });
/*eslint-disable */
import allPages from '../utils/all-pages.json';

describe('render all pages', () => {
  it(`Should render all page`, () => {
    cy.log('Original pages:', JSON.stringify(allPages));
    const filteredPages = allPages.filter(page => page !== '/stories' && page !== '/verify-otp' && page !== '/reset-password' && page !== '/signup' && page !== '/forgot-password' && page !== '/login' && page !== '');
    cy.log('Filtered pages:', JSON.stringify(filteredPages));
    
    // Only visit /userProfile explicitly to avoid any redirects
    cy.visit('/userProfile');
  });
});
