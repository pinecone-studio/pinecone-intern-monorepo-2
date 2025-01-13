/* eslint-disable */

describe('HotelDetail', () => {
  it('1. should render', () => {
    cy.visit('/hotel-detail/67839526ebbbeb70f8be2978');
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName == 'GetHotel') {
        req.reply({
          data: {
            getHotel: {
              images: ['https://res.cloudinary.com/dwf0svulc/image/upload/v1735648227/gdwlt9szuwnqmzwwd415.avif'],
            },
          },
        });
      }
    });
    cy.get('[data-cy="Hotel-Detail-Page"]').should('be.visible');
    // cy.get('[data-cy="Hotel-Detail-Room-Image"]').should('exist');
  });
  it('2. should render', () => {
    cy.visit('/hotel-detail/67839526ebbbeb70f8be2978');

    cy.get('[data-cy="Hotel-Rooms"]').should('be.visible');
    cy.get('[data-cy="Room-Card"]').should('be.visible');
  });
  it('3. should render', () => {
    cy.visit('/hotel-detail/67839526ebbbeb70f8be2978');

    cy.get('[data-cy="Show-More"]').first().click();
    cy.get('[data-cy="Hotel-Room-Detail"]').should('exist');

    // cy.get('[data-cy="Price-Detail"]').first().click();
    // cy.get('[data-cy="Price-Detail"]').should('be.visible');
  });
  it('4. should render with mockdata', () => {
    cy.visit('/hotel-detail/67839526ebbbeb70f8be2978');

    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName == 'GetHotel') {
        req.reply({
          data: {
            getHotel: {},
          },
        });
      }
    });
    cy.get('[data-cy="Hotel-Rooms"]').should('be.visible');
  });
});
