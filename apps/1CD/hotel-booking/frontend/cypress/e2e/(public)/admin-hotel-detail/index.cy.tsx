describe('admin hotel detail test', () => {
  beforeEach(() => {
    cy.visit('/admin-hotel-detail/67734d4aa494d000fe224b6d');
  });
  it('1. it should render', () => {
    cy.get('[data-cy=Admin-Hotel-Detail-Page]').should('be.visible');
  });
  it('2. it should render and aminities are exist', () => {
    cy.intercept('/api/graphql', (req) => {
      if (req.body.operationName === 'GetHotel') {
        req.reply({
          data: {
            getHotel: {
              hotelAmenities: ['test', 'test1'],
              hotelName: 'test',
              starRating: 5,
            },
          },
        });
      }
    });
    cy.get('[data-cy=Aminities-Badge]').should('be.visible');
  });
});
