/* eslint-disable  no-secrets/no-secrets */
import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('OrderDetail Page', () => {
  beforeEach(() => {
    cy.visit('/user/sign-in');
    cy.get('input[name="email"]').type('B161100147@must.edu.mn');
    cy.get('input[name="password"]').type('@Pi88923');
    cy.get('[data-cy="Sign-In-Submit-Button"]').should('be.visible').click();
    cy.get('.toast').should('contain', 'Successfully login');
    cy.url().should('include', '/user/home');
  });
  it('should display the correct state and allow navigation', () => {
    cy.visit('/user/order/6775692364c0071f2a79492c?event=6775692364c0071f2a794935&venue=675699a6c1dddce3ed2978ae');
    cy.get('[data-cy="order-ticket-header"]').should('contain', 'Тасалбар захиалах');
    cy.get('[data-cy="increase-0"]').should('be.visible').click();
    cy.get('[data-cy="purchase-ticket-button"]').click();
    cy.get('[data-cy="order-ticket-header"]').should('contain', 'Захиалга баталгаажуулах');
    cy.get('[ data-cy="order-confirm-button"]').click();
    cy.get('[data-cy="order-ticket-header"]').should('contain', 'Төлбөр төлөх');
    cy.get('[data-cy="undo-button"]').should('be.visible').click();
    cy.get('[data-cy="order-ticket-header"]').should('contain', 'Захиалга баталгаажуулах');
    cy.get('[data-cy="undo-button"]').should('be.visible').click();
    cy.get('[data-cy="undo-button"]').should('be.visible').click();
    cy.url().should('include', '/user/home');
  });

  it('should allow user to increase or decrease quantity', () => {
    cy.visit('/user/order/6775692364c0071f2a79492c?event=6775692364c0071f2a794935&venue=675699a6c1dddce3ed2978ae');
    // cy.get('[data-cy="event-scheduled-time"]').should('have.text', '25.06.27 03:00 pm');
    cy.get('[data-cy="increase-0"]').should('be.visible').click();
    cy.get('[data-cy="quantity-input-0"]').should('have.value', 1);
    cy.get('[data-cy="increase-1"]').should('be.visible').click();
    cy.get('[data-cy="quantity-input-1"]').should('have.value', 1);
    cy.get('[data-cy="decrease-1"]').should('be.visible').click();
  });
  it('should show error if quantity exceeds available stock', () => {
    cy.visit('/user/order/6775692364c0071f2a79492c?event=6775692364c0071f2a794935&venue=675699a6c1dddce3ed2978ae');
    cy.get('[data-cy="increase-2"]').should('be.visible').click();
    cy.get('[data-cy="increase-2"]').should('be.visible').click();
    cy.get('[data-cy="ticket-type-2"] .text-red-500').should('contain', 'Та 2-с дээш суудал захиалах боломжгүй байна!');
    cy.get('[data-cy="decrease-2"]').should('be.visible').click();
    cy.get(`[data-cy="quantity-input-2"]`).should('have.value', '1');
  });
  it('should navigate to the next step when "Тасалбар авах" is clicked', () => {
    cy.visit('/user/order/6775692364c0071f2a79492c?event=6775692364c0071f2a794935&venue=675699a6c1');
    cy.get('.toast').should('contain', 'Error: Cast to ObjectId failed for value "675699a6c1" (type string) at path "_id" for model "Venue"');
  });
  it('should buy ticket correctly', () => {
    interceptGraphql({
      state: '',
      operationName: 'AddToCarts',
      data: {
        data: {
          addToCarts: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.visit('/user/order/676b9997bd529295c8a1304f?event=676b9997bd529295c8a1305c&venue=67482f4bae5aca4e02a71a30');
    cy.get('[data-cy="increase-0"]').should('be.visible').click();
    cy.get('[data-cy="purchase-ticket-button"]').click();
    cy.get('[ data-cy="order-confirm-button"]').click();
    cy.get('[data-cy="payment-select-button"]').click();
    cy.get('[data-cy="payment-submit-button"]').click();
    cy.get('.toast').should('contain', 'Successfully buy ticket check your email');
  });
  it('should navigate to the next step when "Тасалбар авах" is clicked', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'AddToCarts',
      data: {
        errors: [
          {
            message: 'Invalid data',
          },
        ],
        data: null,
      },
    });

    cy.visit('/user/order/676b9997bd529295c8a1304f?event=676b9997bd529295c8a1305c&venue=67482f4bae5aca4e02a71a30');
    cy.get('[data-cy="increase-0"]').should('be.visible').click();
    cy.get('[data-cy="purchase-ticket-button"]').click();
    cy.get('[ data-cy="order-confirm-button"]').click();
    cy.get('[data-cy="payment-select-button"]').click();
    cy.get('[data-cy="payment-submit-button"]').click();
    cy.get('.toast').should('contain', 'Invalid data');
  });
  it('should buy ticket correctly', () => {
    cy.visit('/user/sign-in');
    cy.get('input[name="email"]').type('bat1@gmail.com');
    cy.get('input[name="password"]').type('P@ss1234');
    cy.get('[data-cy="Sign-In-Submit-Button"]').should('be.visible').click();
    cy.get('.toast').should('contain', 'Successfully login');
    cy.url().should('include', '/user/home');
    cy.visit('/user/order/676b9997bd529295c8a1304f?event=676b9997bd529295c8a1305c&venue=67482f4bae5aca4e02a71a30');
    cy.get('[data-cy="increase-0"]').should('be.visible').click();
    cy.get('[data-cy="purchase-ticket-button"]').click();
    cy.get('[ data-cy="order-confirm-button"]').click();
  });
});
