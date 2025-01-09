describe('HotelDetail', () => {
  beforeEach(() => {
    cy.visit('/hotel-detail/674bfbd6a111c70660b55541');
  });
  it('1. should render', () => {
    cy.scrollTo('bottom').should('exist', '[data-cy="Show-More"]');
    cy.get('[data-cy="Show-More"]').first().click();
    cy.get('[data-cy="Hotel-Room-Detail"]').should('exist');
    cy.get('[data-cy="Room-Dialog-Close" ]').first().click({ force: true }).should('not.exist');
  });

  it('2. should render', () => {
    cy.get('[data-cy="Show-More"]').first().click();
    cy.get('[data-cy="Hotel-Room-Detail"]').should('exist');
    cy.get('[data-cy="HotelRoomCarousel"]').should('exist');
    cy.get('[data-cy="next-image"]').click();
    cy.get('[data-cy=carousel-item1]').should('be.visible');
    cy.get('[data-cy="previos-image"]').click();
    cy.get('[data-cy=carousel-item0]').should('be.visible');
  });
  it('3. should render', () => {
    cy.get('[data-cy="Hotel-Detail-Page"]').should('be.visible');
    cy.scrollTo('bottom').should('exist', '[data-cy="Hotel-Rooms"]');
    cy.get('[data-cy="All-Rooms-button"]').click();
    cy.get('[data-cy=one-button]').click();
  });
  it('4. should render', () => {
    cy.get('[data-cy="Price-Detail-Button"]').last().click({ force: true });
    cy.get('[data-cy="Price-Detail-Dialog"]').should('exist');
    cy.get('[data-cy="Price-Detail-Dialog-Close"]').last().click().should('not.exist');
  });
  it('5. should render', () => {
    // cy.contains('Reserve').first().click();
    cy.get('[data-cy=Trigger-Test]').click();
    cy.get('[data-cy=Date-Picker-Calendar]').should('be.visible').as('calendar');
    cy.get('@calendar').contains('7').click();
    cy.get('@calendar').contains('10').click();
    cy.scrollTo(0, 1000);
    cy.get('[data-cy=Reserve-Button]').first().click();
    cy.visit('/hotel-detail/674bfbd6a111c70660b55541');
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'HotelDetail') {
        req.reply({
          data: {
            hotelDetail: [
              {
                price: undefined,
                images: ['/https'],
              },
            ],
          },
        });
      }
    });
  });
  it('6. should render', () => {
    cy.get('[data-cy="Hotel-Detail-Page"]').should('be.visible');
    cy.get('[data-cy="Hotel-images"]').click().should('exist', '[data-cy="Hotel-detail-image"]');
    cy.scrollTo('bottom').should('exist', '[data-cy="Hotel-detail-image"]').should('exist');
    cy.get('[data-cy="image-detail-dialog-close"]').click({ multiple: true }).should('not.exist');
    cy.get('[data-cy="Hotel-Detail-Page"]').should('exist');
  });
});
