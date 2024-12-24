import { interceptGraphql } from 'cypress/utils/intercept-graphql';
import { MockEventData } from 'cypress/utils/mock-events';

describe('Detail Page', () => {
  beforeEach(() => {
    cy.visit('user/home/event/[eventId]'); // Event ID-г URL-д тохируулж зассан
  });

  it('Displays the Detail Page top component', () => {
    cy.get('[data-cy="Detail-Page"]').should('be.visible'); // Detail Page байгаа эсэхийг шалгах
    cy.get('[data-cy="DetailTop-Component"]').should('be.visible'); // DetailTop component байгаа эсэхийг шалгах
  });

  it('Displays the correct event details', () => {
    interceptGraphql({
      state: '',
      operationName: 'GetEventById',
      data: {
        data: MockEventData,
      },
    });

    cy.get('[data-cy="Venue-Name"]').should('contain.text', 'UG-arena'); // Venue нэрийг шалгах
    cy.get('[data-cy="Guest-Artist-0"]').should('contain.text', 'Pink');
    cy.get('[data-cy="select-day-button"]').click();
    cy.get('[data-cy="select-day-item"]').contains('12.30').click();

    cy.get('[data-cy="select-day-button"]').should('contain.text', 'Сонгосон өдөр: 12.30');

    // cy.get('[data-cy="selected-products"]').should('contain.text', 'VIP').and('contain.text', '50000₮');
    cy.get('[data-cy="Scheduled-Days"]').should('be.visible');
    cy.get('[data-cy="discount-price-0"]').should('contain.text', '43000');
  });
  it('Displays the correct event details', () => {
    interceptGraphql({
      state: '',
      operationName: 'GetEventById',
      data: {
        data: {
          getEventById: {
            __typename: 'Event',
            discount: 0,
            scheduledDays: ['2024-12-30T00:00:00.000Z'],
            guestArtists: [{ __typename: 'Artist', name: 'Pink' }],
            mainArtists: [{ __typename: 'Artist', name: '2n1' }],
            products: [
              {
                __typename: 'Product',
                _id: '67693143028fa758efe230fb',
                scheduledDay: '2024-12-30T00:00:00.000Z',
                ticketType: [
                  {
                    discount: '0',
                    soldQuantity: '0',
                    totalQuantity: '100',
                    unitPrice: '50000',
                    zoneName: 'VIP',
                  },
                  {
                    discount: '0',
                    soldQuantity: '0',
                    totalQuantity: '150',
                    unitPrice: '30000',
                    zoneName: 'Standard',
                  },
                  {
                    discount: '0',
                    soldQuantity: '0',
                    totalQuantity: '200',
                    unitPrice: '20000',
                    zoneName: 'Economy',
                  },
                ],
              },
            ],
            venue: {
              _id: '675699a6c1dddce3ed2978ae',
              name: 'UG-arena',
            },
          },
        },
      },
    });
    cy.get('[data-cy="Scheduled-Days"]').should('be.visible'); // Scheduled Days байгаа эсэхийг шалгах
    cy.get('[data-cy="Scheduled-Day-0"]').should('contain.text', '24.12.30'); // Scheduled Days байгаа эсэхийг шалгах
    cy.get('[data-cy="Scheduled-Days"]').should('be.visible');
    cy.get('[data-cy="Scheduled-Days"]').should('be.visible');
    cy.get('[data-cy="select-day-button"]').click();
    cy.get('[data-cy="select-day-item"]').contains('12.30').click();
    cy.get('[data-cy="unit-price-0"]').should('contain.text', '50000');
  });
});
