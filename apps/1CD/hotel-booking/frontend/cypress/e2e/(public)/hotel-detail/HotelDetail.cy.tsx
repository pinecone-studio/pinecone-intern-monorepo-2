describe('HotelDetail', () => {
  it('1. should render', () => {
    cy.visit('/hotel-detail/67734d4aa494d000fe224b6d');

    cy.get('[data-cy="Hotel-Detail-Page"]').should('be.visible');
    cy.get('[data-cy="Hotel-Detail-Room-Image"]').should('exist');
  });
  it('2. should render', () => {
    cy.visit('/hotel-detail/67734d4aa494d000fe224b6d');

    cy.get('[data-cy="Hotel-Rooms"]').should('be.visible');
    cy.get('[data-cy="Room-Card"]').should('be.visible');
  });
  it('3. should render', () => {
    cy.visit('/hotel-detail/67734d4aa494d000fe224b6d');

    cy.get('[data-cy="Show-More"]').first().click();
    cy.get('[data-cy="Hotel-Room-Detail"]').should('exist');

    // cy.get('[data-cy="Price-Detail"]').first().click();
    // cy.get('[data-cy="Price-Detail"]').should('be.visible');
  });
  // it('4. should render with mockdata', () => {
  //   cy.intercept('POST', '/api/graphql', (req) => {
  //     if (req.body.operationName == 'GetHotel') {
  //       req.reply({
  //         data: {
  //           getHotel: {
  //             images: [],
  //           },
  //         },
  //       });
  //     }
  //   });
  //   cy.visit('/hotel-detail/67734d4aa494d000fe224b6d');

  //   cy.get('[data-cy="Hotel-Room-Detail"]').should('not.exist');
  //   // cy.get('[data-cy="Price-Detail"]').first().click();
  //   // cy.get('[data-cy="Price-Detail"]').should('be.visible');
  // });
});
