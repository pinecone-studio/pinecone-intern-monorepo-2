// /// <reference types="cypress" />

// describe('Date of Birth Page', () => {
//   beforeEach(() => {
//     cy.visit('/date-of-birth');
//   });

//   it('should load the page correctly', () => {
//     cy.get('h2').should('contain.text', 'How old are you');
//     cy.get('p').should('contain.text', 'Please enter your age to continue');
//     cy.get('button').should('have.length', 2);
//   });

//   it('should show an alert when the "Next" button is clicked without selecting a date', () => {
//     cy.window().then((win) => {
//       cy.stub(win, 'alert').as('alert');
//     });

//     cy.get('button').contains('Next').click();
//     cy.get('@alert').should('be.calledWith', 'Please select a date!');
//   });

//   it('should navigate to the next page when a date is selected and "Next" is clicked', () => {
//     cy.window().then((win) => {
//       cy.stub(win.history, 'push').as('push');
//     });

//     cy.get('button').contains('Pick a date').click();
//     cy.contains('1').click();

//     cy.get('button').contains('Next').click();

//     cy.get('@push').should('have.been.calledWith', '/');
//   });

//   it('should navigate back when the "Back" button is clicked', () => {
//     cy.window().then((win) => {
//       cy.stub(win.history, 'push').as('push');
//     });

//     cy.get('button').contains('Back').click();

//     cy.get('@push').should('have.been.calledWith', '/');
//   });

//   it('should update the calendar date when a date is selected', () => {
//     cy.get('button').contains('Pick a date').click();
//     cy.contains('15').click();

//     cy.get('button').contains('Pick a date').should('contain.text', '15');
//   });
// });
