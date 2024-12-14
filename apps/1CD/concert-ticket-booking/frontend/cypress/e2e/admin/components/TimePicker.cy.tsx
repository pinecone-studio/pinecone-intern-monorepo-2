describe('TimePicker Component', () => {
  beforeEach(() => {
    // Visiting the page where the TimePicker is rendered
    cy.visit('/admin/home');
    cy.get('[data-testid="create-event-button"]').click();
  });

  it('should render the time picker label and select fields', () => {
    cy.get('[data-testid="time-label"]').should('exist').and('contain.text', 'Цаг');
    cy.get('[data-testid="time-label"] .text-red-500').should('exist');
    cy.get('[data-testid="hour-select"]').should('exist');
    cy.get('[data-testid="minute-select"]').should('exist');
  });

  it('should allow selecting an hour and minute', () => {
    cy.get('[data-testid="hour-select"]').click();
    cy.get('[data-testid="hour-select-item-02"]').click();
    cy.get('[data-testid="minute-select"]').click();
    cy.get('[data-testid="minute-select-item-20"]').click();
    cy.get('[data-testid="hour-select"]').should('contain.text', '02');
    cy.get('[data-testid="minute-select"]').should('contain.text', '20');
  });

  it('should update form state when hour and minute are selected', () => {
    cy.get('[data-testid="hour-select"]').click();
    cy.get('[data-testid="hour-select-item-03"]').click();

    cy.get('[data-testid="minute-select"]').click();
    cy.get('[data-testid="minute-select-item-30"]').click();

    cy.get('[data-testid="hour-select"]').should('have.text', '03');
    cy.get('[data-testid="minute-select"]').should('have.text', '30');
    cy.get('[data-testid="time-label"]').should('not.have.class', 'text-red-500');
  });
  it('should update form state when hour and minute are selected', () => {
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="time-label"]').should('have.class', 'text-red-500');
  });
});
