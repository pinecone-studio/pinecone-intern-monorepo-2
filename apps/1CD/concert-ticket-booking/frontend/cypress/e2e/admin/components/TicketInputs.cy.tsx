import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('InputForm Component', () => {
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
    cy.get('[data-testid="create-event-button"]').click();
  });

  it('should render ticket type fields', () => {
    cy.get('[data-testid="ticket-type-fields"]').should('exist');
    cy.get('[data-testid^="ticket-type-"]').should('have.length.greaterThan', 0);
  });

  it('should render ticket type fields with correct labels and placeholders', () => {
    cy.get('[data-testid="zone-name-label-0"]').should('contain.text', 'VIP');
    cy.get('[data-testid="zone-name-input-0"]').should('have.attr', 'placeholder', 'zoneName');
    cy.get('[data-testid="discount-input-0"]').should('have.attr', 'placeholder', 'Хөнгөлөлт');
    cy.get('[data-testid="unit-price-input-0"]').should('have.attr', 'placeholder', 'Нэгж үнэ');
    cy.get('[data-testid="total-quantity-input-0"]').should('have.attr', 'placeholder', 'Тоо хэмжээ');
    cy.get('[data-testid="additional-input-0"]').should('have.attr', 'placeholder', 'Нэмэлт');
  });

  it('should allow the user to interact with inputs', () => {
    cy.get('[data-testid="discount-input-0"]').type('10%').should('have.value', '10%');
    cy.get('[data-testid="unit-price-input-0"]').type('1000').should('have.value', '1000');
    cy.get('[data-testid="total-quantity-input-0"]').type('5').should('have.value', '5');
    cy.get('[data-testid="additional-input-0"]').type('VIP Access').should('have.value', 'VIP Access');
  });
  it('should show validation error if required fields are left empty', () => {
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="unit-price-message-0"]').should('have.class', 'text-destructive');
    cy.get('[data-testid="total-quantity-message-0"]').should('have.class', 'text-destructive');
  });
});
