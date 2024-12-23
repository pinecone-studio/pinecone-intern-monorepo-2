describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/user/home');
  });
  it('1.Displays home page with events', () => {
    cy.get('[data-cy="Home-Page"]').should('be.visible');
    cy.get('[data-cy="Card-Component"]').should('be.visible');
  });

  // it('should render carousel items correctly', () => {
  //   // Verify that the carousel container is visible
  //   cy.get('[data-cy="events"]').should('be.visible');

  //   // Verify that the first event is displayed
  //   cy.get('[data-cy="eventId"]').within(() => {
  //     cy.contains('Event 1').should('be.visible');
  //   });
  // });

  it('should navigate to the next item on clicking the next button', () => {
    // Click the next button
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="prev-button"]').click();
  });

  
});
