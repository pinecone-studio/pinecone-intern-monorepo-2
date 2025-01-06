describe('homePage', () => {
  beforeEach(() => {
    cy.visit('/add-hotel/home-page');
  });
  it('1. should have Hotel text', () => {
    cy.get('[data-cy=Hotel-Text]').should('be.visible');
  });
  it('2. should have Add Hotel Button', () => {
    cy.get('[data-cy="Add-Hotel-button"]').should('be.visible').click();
    cy.visit('/add-hotel');
  });
  it('3. should have search input', () => {
    cy.get('[data-cy="Input-element"]').should('exist');
  });
  it('4. should have rooms input', () => {
    cy.get('[data-cy="Room-input"]').click().should('exist');
  });
  it('5. should have star-rating input', () => {
    cy.get('[data-cy="Star-rating"]').click().should('exist');
  });
  it('5. should have user-raring input', () => {
    cy.get('[data-cy="User-rating"]').click().should('exist');
  });
});
