/// <reference types="cypress" />

import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('CreateEventModal', () => {
  beforeEach(() => {
    const mockToken = {
      token: 'faketoken',
    };
    cy.window().then((window) => {
      window.localStorage.setItem('token', JSON.stringify(mockToken));
    });
    interceptGraphql({
      state: '',
      operationName: 'GetMe',
      data: {
        data: {
          getMe: {
            email: 'example@gmail.com',
            role: 'admin',
            phoneNumber: '+976 95160812',
            __typename: 'User',
          },
        },
      },
    });
    cy.visit('/admin/home');
  });

  it('should render the modal when the button is clicked', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="modal-title"]').should('exist');
    cy.get('button:has(svg.lucide-x)').first().click();
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
  });
});
