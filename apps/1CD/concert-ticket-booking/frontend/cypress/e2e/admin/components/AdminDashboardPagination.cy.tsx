import { interceptGraphql } from 'cypress/utils/intercept-graphql';
describe('AdminPagination Component', () => {
  beforeEach(() => {
    const mockToken = { token: 'faketoken' };
    cy.window().then((window) => {
      window.localStorage.setItem('token', JSON.stringify(mockToken));
    });
    interceptGraphql({
      state: '',
      operationName: 'GetMe',
      data: {
        data: {
          getMe: {
            email: 'example@gmail.com',
            role: 'admin',
            phoneNumber: '+976 95160812',
            __typename: 'User',
          },
        },
      },
    });
    cy.visit('/admin/home');
  });
  it('renders buttons and pages', () => {
    cy.get('[data-testid="left-btn"]').should('exist');
    cy.get('[data-testid="right-btn"]').should('exist'); // cy.get('[data-testid^="currentPage-"]').should('have.length', 2);
  });
  it('navigates pages correctly', () => {
    cy.get('[data-testid="right-btn"]').click();
    cy.url().should('include', 'page=2');
    cy.get('[data-testid="currentPage-0"]').click();
  });
  it('disables out-of-bound navigation', () => {
    cy.get('[data-testid="left-btn"]').click();
    cy.get('[data-testid="currentPage-1"]').click();
    cy.get('[data-testid="right-btn"]').click();
    cy.url().should('include', 'page=2');
  });
  it('0 data', () => {
    interceptGraphql({
      state: '',
      operationName: 'GetEventsPaged',
      data: {
        data: {
          getEventsPaged: {
            totalPages: 0,
            events: [
              {
                _id: '6775692364c0071f2a794935',
                isArchived: false,
                mainArtists: [
                  {
                    name: 'Example Artist 1',
                    __typename: 'Artist',
                  },
                ],
                name: 'Test Event',
                priority: 'low',
                products: [
                  {
                    _id: '6775692364c0071f2a79492c',
                    scheduledDay: '2025-06-27T07:00:00.000Z',
                    ticketType: [
                      {
                        _id: '6775692364c0071f2a79492d',
                        additional: '',
                        discount: null,
                        soldQuantity: '3',
                        totalQuantity: '5',
                        unitPrice: '100000',
                        zoneName: 'VIP',
                        __typename: 'TicketType',
                      },
                      {
                        _id: '6775692364c0071f2a79492e',
                        additional: '',
                        discount: null,
                        soldQuantity: '2',
                        totalQuantity: '4',
                        unitPrice: '150000',
                        zoneName: 'Backstage',
                        __typename: 'TicketType',
                      },
                      {
                        _id: '6775692364c0071f2a79492f',
                        additional: '',
                        discount: null,
                        soldQuantity: '1',
                        totalQuantity: '3',
                        unitPrice: '100000',
                        zoneName: 'Regular',
                        __typename: 'TicketType',
                      },
                    ],
                    __typename: 'Product',
                  },
                  {
                    _id: '6775692364c0071f2a794930',
                    scheduledDay: '2025-06-28T07:00:00.000Z',
                    ticketType: [
                      {
                        _id: '6775692364c0071f2a794931',
                        additional: '',
                        discount: null,
                        soldQuantity: '4',
                        totalQuantity: '5',
                        unitPrice: '100000',
                        zoneName: 'VIP',
                        __typename: 'TicketType',
                      },
                      {
                        _id: '6775692364c0071f2a794932',
                        additional: '',
                        discount: null,
                        soldQuantity: '0',
                        totalQuantity: '4',
                        unitPrice: '150000',
                        zoneName: 'Backstage',
                        __typename: 'TicketType',
                      },
                      {
                        _id: '6775692364c0071f2a794933',
                        additional: '',
                        discount: null,
                        soldQuantity: '0',
                        totalQuantity: '3',
                        unitPrice: '100000',
                        zoneName: 'Regular',
                        __typename: 'TicketType',
                      },
                    ],
                    __typename: 'Product',
                  },
                ],
                scheduledDays: ['2025-06-27T07:00:00.000+00:00', '2025-06-28T07:00:00.000+00:00'],
                description: 'test event description',
                category: ['674d4115c644a2350d5598e6'],
                guestArtists: [
                  {
                    name: '',
                    __typename: 'Artist',
                  },
                ],
                image: '',
                venue: {
                  _id: '675699a6c1dddce3ed2978ae',
                  name: 'UG-arena',
                  __typename: 'Venue',
                },
                __typename: 'Event',
              },
            ],
          },
        },
      },
    });
    cy.get('[data-testid="pagination-container"]').should('not.exist');
    cy.get('[data-testid="pagination-nothing-container"]').should('exist');
  });
});
