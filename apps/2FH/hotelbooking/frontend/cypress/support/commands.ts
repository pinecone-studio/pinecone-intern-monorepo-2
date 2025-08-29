// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Add custom command types
declare global {
  interface Cypress {
    Commands: {
      add(_name: string, _callback: () => void): void;
    };
  }
}

// Mock hotel data for testing
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

// -- This is a parent command --
Cypress.Commands.add('mockGraphQL', () => {
  cy.intercept('POST', 'http://localhost:4200/api/graphql', (req) => {
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

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export {};
