describe('DatePicker Component', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN_SUPERVISEE'] as string;
    cy.setCookie('authtoken', token);
  });
  beforeEach(() => {
    cy.visit('/MyRequest');
  });
  it('should render Calendar component', () => {
    cy.get('[data-testid="choose-date"]').should('exist');
  });
});
