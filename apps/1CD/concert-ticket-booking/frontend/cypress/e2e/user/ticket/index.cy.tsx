import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('UnitTicketPage', () => {
  it('should display event details correctly when data is available and data not have discount', () => {
    interceptGraphql({
      state: 'success',
      operationName: 'GetUnitTicket',
      data: {
        data: {
          getUnitTicket: {
            eventId: {
              name: 'The Rolling Stones Live',
              image: 'https://example.com/event-image.jpg',
              description: 'A legendary performance',
              mainArtists: [{ name: 'Mick Jagger' }, { name: 'Keith Richards' }],
            },
            orderId: {
              status: 'available',
              ticketType: [
                {
                  _id: '123',
                  zoneName: 'VIP',
                  unitPrice: 150,
                },
              ],
            },
            productId: {
              scheduledDay: '2024-04-12T19:00:00Z',
            },
            ticketId: '123',
          },
        },
      },
    });
    cy.visit('/user/ticket/676e4af16');
    cy.get('[data-cy="ticket-price"]').should('contain.text', '150');
  });
  it('should display event details correctly when data is available', () => {
    interceptGraphql({
      state: 'success',
      operationName: 'GetUnitTicket',
      data: {
        data: {
          getUnitTicket: {
            eventId: {
              name: 'The Rolling Stones Live',
              image: 'https://example.com/event-image.jpg',
              description: 'A legendary performance',
              mainArtists: [{ name: 'Mick Jagger' }, { name: 'Keith Richards' }],
            },
            orderId: {
              status: 'available',
              ticketType: [
                {
                  _id: '123',
                  zoneName: 'VIP',
                  unitPrice: 150,
                  discount: '10',
                  additional: 'Free Drink',
                },
              ],
            },
            productId: {
              scheduledDay: '2024-04-12T19:00:00Z',
            },
            ticketId: '123',
          },
        },
      },
    });
    cy.visit('/user/ticket/676e4af16');
    cy.get('[data-cy="event-name"]').should('contain', 'The Rolling Stones Live');
    cy.get('[data-cy="event-description"]').should('contain', 'A legendary performance');
    cy.get('[data-cy="main-artist-0"]').should('contain', 'Mick Jagger');
    // cy.get('[data-cy="event-date"]').should('contain', '24.04.13 03:00 AM');
    cy.get('[data-cy="ticket-discount"]').should('contain.text', '135 ₮');
    cy.get('[data-cy="ticket-additional"]').should('contain', 'Free Drink');
    cy.get('[data-cy="ticket-zone-name"]').should('contain', 'VIP');
  });

  it('should display a message when ticket is unavailable', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'GetUnitTicket',
      data: {
        data: {
          getUnitTicket: {
            orderId: {
              status: 'unavailable',
            },
          },
        },
      },
    });
    cy.visit('/user/ticket/676e4af164ef63331787bd78');
    cy.get('[data-cy="ticket-unavailable"]').should('contain', ' Ticket has been cancelled');
  });
});
