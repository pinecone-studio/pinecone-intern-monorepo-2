describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/user/home');
  });
  it('1.Displays home page with events', () => {
    cy.get('[data-cy="Home-Page"]').should('be.visible');
    cy.get('[data-cy="Card-Component"]').should('be.visible');
  });
  it('should navigate to the next item on clicking the next button', () => {
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="prev-button"]').click();
  });
  it('should auto-scroll after a few seconds', () => {
    cy.wait(3000);
    cy.get('[data-cy="events"]');
    cy.wait(3000);
    cy.get('[data-cy="events"]');
  });
});
