import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('EditingDialog Component', () => {
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
    cy.get('[data-testid="edit-event-button-6783e3c08516e7cebc45071a"]').click();
  });

  it('should render all fields correctly', () => {
    cy.get('[data-cy="event-name-input"]').should('exist');
    cy.get('[data-cy="event-description-input"]').should('exist');
    cy.get('[data-testid="venue-select"]').should('exist');
    cy.get('[data-testid="date-picker-button"]').should('exist');
    cy.get('[data-testid="hour-select"]').should('exist');
    cy.get('[data-testid="minute-select"]').should('exist');
    cy.get('[data-testid="main-artist-name-input-0"]').should('exist');
    cy.get('[data-testid="guest-artist-name-input-0"]').should('exist');
  });

  it('should allow the user to edit and save changes', () => {
    interceptGraphql({
      state: '',
      operationName: 'UpdateEvent',
      data: {
        data: {
          updateEvent: {
            id: '1',
            name: 'Updated Event Name',
            __typename: 'Event',
          },
        },
      },
    });
    cy.get('[data-cy="event-name-input"]').clear().type('Updated Event Name');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('.toast').should('contain.text', 'Successfully updated');
  });
  it('should error', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'UpdateEvent',
      data: {
        errors: [
          {
            message: 'An error occurred',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy="event-name-input"]').clear().type('Updated Event Name');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('.toast').should('contain.text', 'An error occurred');
  });
});
