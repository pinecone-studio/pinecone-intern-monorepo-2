describe('Booking Confirmation Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy=Login-Email-Input]').type('badralbaigalmaa7@gmail.com');
    cy.get('[data-cy=Login-Password-Input]').type('badral1218');
    cy.get('[data-cy=Login-Submit-Button]').click();
    cy.url().should('not.include', '/login');
    cy.getAllLocalStorage();
  });
  const mockBooking = {
    getBooking: {
      roomId: {
        hotelId: {
          hotelName: 'Hotel Test',
          userRating: 4.5,
        },
        amenities: ['WiFi', 'Pool'],
        roomInformation: ['WiFi', 'Pool'],
      },
      checkInDate: '2024-12-20T14:00:00Z',
      checkOutDate: '2024-12-22T11:00:00Z',
    },
  };

  it('Displays booking details with amenities', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetBooking') {
        req.reply({ data: mockBooking });
      }
    }).as('getBooking');

    cy.visit('/booking-confirm/6757dfb4687cb83ca69ff3cb');

    cy.get('[data-cy="Room-Amenities0"]').should('contain', 'WiFi');
    cy.get('[data-cy="Room-Amenities1"]').should('contain', 'Pool');
  });

  it('Handles no amenities gracefully', () => {
    const noAmenitiesBooking = { ...mockBooking, getBooking: { ...mockBooking.getBooking, roomId: { ...mockBooking.getBooking.roomId, roomInformation: null } } };
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetBooking') {
        req.reply({ data: noAmenitiesBooking });
      }
    }).as('getBooking');

    cy.visit('/booking-confirm/6757dfb4687cb83ca69ff3cb');

    cy.get('[data-cy="No-Amenities"]').should('exist').and('contain', 'No amenities available');
  });
  it('not have checkin and checkout dates', () => {
    cy.visit('/booking-confirm/6757dfb4687cb83ca69ff3cb');
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetBooking') {
        req.reply({
          data: {
            getBooking: {
              checkInDate: undefined,
              checkOutDate: undefined,
            },
          },
        });
      }
    });
    cy.get('[data-cy=Booking-Confirm-Page]').should('be.visible');
  });
});
