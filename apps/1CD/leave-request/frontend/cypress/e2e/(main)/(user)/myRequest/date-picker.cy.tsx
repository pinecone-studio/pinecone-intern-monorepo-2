describe('DatePicker Component', () => {
  beforeEach(() => {
    cy.visit('/MyRequest');
  });
  it('should render Calendar component', () => {
    cy.get('[data-testid="choose-date"]').should('exist');
  });
});
