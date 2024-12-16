/// <reference types="cypress" />

describe('CreateEventModal', () => {
  beforeEach(() => {
    cy.visit('/admin/home');
  });

  it('should render the modal when the button is clicked', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="modal-title"]').should('exist');
  });

  it('should open the date picker popover when clicking the date picker button', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="modal-title"]').should('exist');
    cy.get('[data-testid="date-picker-button"]').click();
    cy.get('[data-testid="popover-content"]').should('be.visible');
    cy.get('[data-testid="date-picker-calendar"]').click();
    cy.get('[data-testid="date-picker-button"]').click();
  });

  it('should show error styling when there is a validation error', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="modal-title"]').should('exist');
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="form-label-date"]').should('have.class', 'text-red-500');
  });

  it('should correctly select a date range', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="modal-title"]').should('exist');
    cy.get('[data-testid="date-picker-button"]').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('1').should('be.visible').click();
    cy.get('[data-testid="date-picker-calendar"]').find('[role="gridcell"]').contains('10').should('be.visible').click();
    cy.get('[data-testid="date-picker-button"]').click();
    cy.get('[data-testid="date-picker-button"]').should('contain', 'Dec 01, 2024 - Dec 10, 2024');
    cy.get('[data-testid="close-modal-button"]').click();
  });
});
