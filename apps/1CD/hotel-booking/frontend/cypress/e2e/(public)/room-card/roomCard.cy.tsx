describe('HotelDetail', () => {
  beforeEach(() => {
    cy.visit('/hotel-detail');
  });
  it('1. should render', () => {
    cy.get('[data-cy="Show-More"]').first().click();
    cy.get('[data-cy="Hotel-Room-Detail"]').should('exist');
    cy.get('[data-cy="Room-Dialog-Close" ]').first().click().should('not.exist');
  });
  it('2. should render', () => {
    cy.get('[data-cy="Show-More"]').first().click();
    cy.get('[data-cy="Hotel-Room-Detail"]').should('exist');
    cy.get('[data-cy="HotelRoomCarousel"]').should('exist');
    cy.get('[data-cy="next-image"]').click();
    cy.get("[data-cy=carousel-item1]").should("be.visible")
    cy.get('[data-cy="previos-image"]').click();
    cy.get("[data-cy=carousel-item0]").should("be.visible")

  });
  it('3. should render', () => {
    cy.get('[data-cy="Room-Card"]').should('be.visible');
  });
  it('4. should render', () => {
    cy.get('[data-cy="Price-Detail-Button"]').last().click();
    cy.get('[data-cy="Price-Detail-Dialog"]').should('exist');
    cy.get('[data-cy="Price-Detail-Dialog-Close"]').last().click().should('not.exist');
  });
  it('5. should render', () => {
    cy.get('[data-cy="Reserve-button"]').first().click();
    cy.visit('/checkout/674851d9066230f0d7f74866').should('exist');
  });
});
