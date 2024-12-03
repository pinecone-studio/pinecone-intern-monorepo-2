describe('Calendar Form', () => {
  beforeEach(() => {
    cy.visit('/register/birthday');
  });

  it('should display the form and handle date selection', () => {
    cy.get('p').contains('How old are you?').should('be.visible');
    cy.get('p').contains('Please enter your age to continue').should('be.visible');

    cy.get('button').contains('Pick a date').should('be.visible');

    cy.get('button').contains('Pick a date').click();

    cy.get('.react-calendar__tile').contains('1').click();

    cy.get('button').contains('January 1, 2000').should('be.visible');

    cy.get('button').contains('Next').click();

    cy.contains('Date of birth submitted successfully!').should('be.visible');
  });

  it('should show an error if no date is selected and Next is clicked', () => {
    cy.get('button').contains('Next').click();

    cy.contains('Please select a date!').should('be.visible');
  });

  it('should navigate back when clicking the Back button', () => {
    cy.get('button').contains('Back').click();
    cy.url().should('eq', 'http://localhost:4200/');
  });
});
