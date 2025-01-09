describe('Requests Component', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN_SUPERVISEE'] as string;
    cy.setCookie('authtoken', token);
  });
  beforeEach(() => {
    cy.visit('/MyRequest');
  });

  it('should render RequestCard components with correct data', () => {
    cy.get('[data-testid="work-from-distance"]').should('contain.text', 'хоног');
  });
});

