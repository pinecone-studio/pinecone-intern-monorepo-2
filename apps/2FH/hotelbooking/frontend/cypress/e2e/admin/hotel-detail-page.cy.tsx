describe('Hotel Detail Page', () => {
  beforeEach(() => {
    cy.mockGraphQL();
    cy.visit('/admin/hotel/1');
  });
  it('should load the hotel detail page', () => {
    cy.get('[data-cy="HotelDetail-Page"]').should('exist');
  });
  it('should display hotel information correctly', () => {
    cy.get('[data-cy="HotelDetail-Title"]').should('contain', 'Test Hotel');
    cy.get('[data-cy="HotelDetail-Location"]').should('contain', 'Test City, Test Country');
  });
  it('should have proper header structure', () => {
    cy.get('[data-cy="HotelDetail-Header"]').should('exist');
    cy.get('[data-cy="HotelDetail-BackButton"]').should('contain', 'Back');
    cy.get('[data-cy="HotelDetail-Title"]').should('exist');
  });
  it('should display all hotel cards', () => {
    cy.contains('General Information').should('exist');
    cy.contains('Hotel Details').should('exist');
    cy.contains('Amenities').should('exist');
    cy.contains('Policies').should('exist');
    cy.contains('Frequently Asked Questions').should('exist');
    cy.contains('Location').should('exist');
    cy.contains('Hotel Images').should('exist');
  });
  it('should handle back button navigation', () => {
    cy.get('[data-cy="HotelDetail-BackButton"]').click();
    cy.url().should('not.include', '/admin/hotel/1');
  });
  it('should handle different hotel IDs', () => {
    cy.visit('/admin/hotel/2');
    cy.get('[data-cy="HotelDetail-Page"]').should('exist');
    cy.contains('General Information').should('exist');
    cy.get('[data-cy="HotelDetail-Title"]').should('exist');
  });
  it('should handle loading state gracefully', () => {
    cy.visit('/admin/hotel/999');
    cy.get('[data-cy="HotelDetail-Page"]').should('exist');
  });
  it('should handle error state gracefully', () => {
    cy.visit('/admin/hotel/error');
    cy.get('[data-cy="HotelDetail-Page"]').should('exist');
  });
  it('should display error message when GraphQL query fails', () => {
    cy.intercept('POST', 'https://hotelbooking-2fh-backend-developmen.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'Hotel') {
        req.reply({
          statusCode: 500,
          body: {
            errors: [
              {
                message: 'GraphQL query failed',
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
              },
            ],
          },
        });
      }
    }).as('graphqlError');
    cy.visit('/admin/hotel/graphql-error');
    cy.wait('@graphqlError');
    cy.contains('Error loading hotel:').should('exist');
  });
  it('should handle not found state gracefully', () => {
    cy.intercept('POST', 'https://hotelbooking-2fh-backend-developmen.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'Hotel') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              hotel: null, // This will trigger the !data?.hotel condition
            },
          },
        });
      }
    }).as('hotelNotFound');
    cy.visit('/admin/hotel/notfound');
    cy.wait('@hotelNotFound');
    cy.contains('Hotel Not Found').should('exist');
    cy.contains("The hotel you're looking for doesn't exist.").should('exist');
  });
  it('should have proper responsive layout', () => {
    cy.viewport(375, 667);
    cy.get('[data-cy="HotelDetail-Page"]').should('exist');
    cy.viewport(1920, 1080);
    cy.get('[data-cy="HotelDetail-Page"]').should('exist');
  });
  it('should display hotel basic information', () => {
    cy.contains('General Information').should('exist');
    cy.contains('Test Hotel').should('exist');
    cy.contains('+1234567890').should('exist');
  });
  it('should display hotel details', () => {
    cy.contains('Hotel Details').should('exist');
    cy.contains('4').should('exist');
    cy.contains('8.5').should('exist');
  });
  it('should display hotel amenities', () => {
    cy.contains('Amenities').should('exist');
    cy.contains('WIFI').should('exist');
    cy.contains('POOL').should('exist');
    cy.contains('GYM').should('exist');
  });
  it('should display hotel policies', () => {
    cy.contains('Policies').should('exist');
    cy.contains('14:00').should('exist');
    cy.contains('11:00').should('exist');
  });
  it('should display hotel FAQ', () => {
    cy.contains('Frequently Asked Questions').should('exist');
    cy.contains('What time is check-in?').should('exist');
    cy.contains('Check-in is available from 2:00 PM').should('exist');
  });
  it('should display hotel location', () => {
    cy.contains('Location').should('exist');
    cy.contains('Test City').should('exist');
    cy.contains('Test Country').should('exist');
    cy.contains('123 Test Street').should('exist');
  });
  it('should display hotel images', () => {
    cy.contains('Hotel Images').should('exist');
    cy.get('img').should('have.attr', 'src');
  });
  it('should handle edit modal state', () => {
    cy.contains('button', 'Edit').should('exist');
    cy.get('button').contains('Edit').should('have.length.at.least', 1); // At least 1 edit button
  });
  it('should have proper page structure and styling', () => {
    cy.get('[data-cy="HotelDetail-Page"]').should('have.class', 'min-h-screen');
    cy.get('[data-cy="HotelDetail-Page"]').should('have.class', 'bg-gray-50');
    cy.get('[data-cy="HotelDetail-Page"]').should('have.class', 'p-6');
  });
  it('should have proper grid layout', () => {
    cy.get('[data-cy="HotelDetail-Page"] .grid').should('exist');
    cy.get('[data-cy="HotelDetail-Page"] .lg\\:grid-cols-2').should('exist');
  });
  it('should have proper card spacing', () => {
    cy.get('[data-cy="HotelDetail-Page"] .space-y-6').should('exist');
  });
  it('should have proper container max width', () => {
    cy.get('[data-cy="HotelDetail-Page"] .max-w-6xl').should('exist');
  });
  it('should have proper button accessibility', () => {
    cy.get('[data-cy="HotelDetail-BackButton"]').should('be.visible');
    cy.get('[data-cy="HotelDetail-BackButton"]').should('not.be.disabled');
  });
  it('should have proper heading hierarchy', () => {
    cy.get('[data-cy="HotelDetail-Title"] h1').should('exist');
    cy.get('[data-cy="HotelDetail-Title"] h1').should('have.class', 'text-3xl');
  });
  it('should have proper semantic structure', () => {
    cy.get('[data-cy="HotelDetail-Page"]').should('exist');
    cy.get('[data-cy="HotelDetail-Header"]').should('exist');
    cy.get('[data-cy="HotelDetail-Title"]').should('exist');
  });
});
