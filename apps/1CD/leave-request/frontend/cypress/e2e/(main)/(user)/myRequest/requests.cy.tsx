describe('Requests Component', () => {
  beforeEach(() => {
    cy.visit('/MyRequest');
  });

  it('should render RequestCard components with correct data', () => {
    cy.get('[data-testid="work-from-distance"]').should('contain.text', 'хоног');
  });
});

