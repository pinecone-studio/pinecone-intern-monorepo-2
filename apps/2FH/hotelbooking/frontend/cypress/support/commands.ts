import type { HotelData } from './types';
const mockHotel = {
  id: '1',
  name: 'Test Hotel',
  description: 'A beautiful test hotel',
  stars: 4,
  phone: '+1234567890',
  rating: 8.5,
  city: 'Test City',
  country: 'Test Country',
  location: '123 Test Street',
  languages: ['English', 'Spanish'],
  amenities: ['WIFI', 'POOL', 'GYM'],
  policies: [
    {
      checkIn: '14:00',
      checkOut: '11:00',
      specialCheckInInstructions: 'Please present valid ID',
      accessMethods: ['Key card'],
      childrenAndExtraBeds: 'Children under 12 stay free',
      pets: 'Pets not allowed',
    },
  ],
  optionalExtras: [
    {
      youNeedToKnow: 'Free breakfast included',
      weShouldMention: '24/7 front desk service',
    },
  ],
  faq: [
    {
      question: 'What time is check-in?',
      answer: 'Check-in is available from 2:00 PM',
    },
  ],
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
};
const mockHotels = [
  mockHotel,
  {
    ...mockHotel,
    id: '2',
    name: 'Another Hotel',
    city: 'Another City',
    stars: 5,
    rating: 9.0,
  },
];
Cypress.Commands.add('mockGraphQL', () => {
  cy.intercept('POST', 'https://hotelbooking-2fh-backend-developmen.vercel.app/api/graphql', (req) => {
    const { operationName } = req.body;
    switch (operationName) {
      case 'Hotel':
        req.reply({
          statusCode: 200,
          body: {
            data: {
              hotel: mockHotel,
            },
          },
        });
        break;
      case 'Hotels':
        req.reply({
          statusCode: 200,
          body: {
            data: {
              hotels: mockHotels,
            },
          },
        });
        break;
      default:
        req.reply({
          statusCode: 200,
          body: {
            data: null,
          },
        });
    }
  });
});
Cypress.Commands.add('fillBasicHotelInfo', (_hotelData = {}) => {
  const defaultData: HotelData = {
    name: 'Test Hotel',
    phone: '+1234567890',
    city: 'Test City',
    country: 'Test Country',
    location: '123 Test Street',
    stars: 4,
    rating: 8.5,
    description: 'A beautiful test hotel with amazing amenities',
    ..._hotelData,
  };
  cy.get('#name').clear().type(defaultData.name);
  cy.get('#phone').clear().type(defaultData.phone);
  cy.get('#city').clear().type(defaultData.city);
  cy.get('#country').clear().type(defaultData.country);
  cy.get('#location').clear().type(defaultData.location);
  cy.get('#stars').clear().type(defaultData.stars.toString());
  cy.get('#rating').clear().type(defaultData.rating.toString());
  cy.get('#description').clear().type(defaultData.description);
});
Cypress.Commands.add('submitHotelForm', () => {
  cy.get('[data-cy=create-hotel-button]').click();
});
Cypress.Commands.add('mockCreateHotelResponse', (_success = true, _delay = 0) => {
  cy.intercept('POST', 'https://hotelbooking-2fh-backend-developmen.vercel.app/api/graphql', (req) => {
    if (req.body.operationName === 'CreateHotel') {
      if (_success) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createHotel: {
                success: true,
                hotel: {
                  id: 'test-hotel-id',
                  name: 'Test Hotel',
                  description: 'A beautiful test hotel',
                },
              },
            },
          },
          _delay,
        });
      } else {
        req.reply({
          statusCode: 400,
          body: {
            errors: [
              {
                message: 'Hotel creation failed',
                extensions: {
                  code: 'BAD_REQUEST',
                },
              },
            ],
          },
          _delay,
        });
      }
    }
  }).as('createHotel');
});
export {};
