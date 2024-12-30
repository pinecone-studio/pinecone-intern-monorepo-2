import { interceptGraphql } from 'cypress/utils/intercept-graphql';
import { mockEvent } from 'cypress/utils/mock-events';
import { OneMockEvent } from 'cypress/utils/one-mock-event';

describe('Detail Page', () => {
  beforeEach(() => {
    cy.visit('user/home/event/[eventId]');
  });

  it('Displays the Detail Page top component', () => {
    cy.get('[data-cy="Detail-Page"]').should('be.visible'); // Detail Page байгаа эсэхийг шалгах
    cy.get('[data-cy="DetailTop-Component"]').should('be.visible'); // DetailTop component байгаа эсэхийг шалгах
  });

  it('Displays the correct event details with mockEvent', () => {
    interceptGraphql({
      state: 'success',
      operationName: 'GetRelatedEvents',
      data: {
        data: mockEvent, // Mock өгөгдлийг ашиглаж байна
      },
    });

    cy.get('[data-cy="Venue-Name"]').should('contain.text', 'Төв цэнгэлдэх хүрээлэн'); // Venue нэрийг шалгах
    cy.get('[data-cy="Guest-Artist-0"]').should('contain.text', 'Jojo'); // Зочин уран бүтээлчийн нэр
    cy.get('[data-cy="select-day-button"]').click();
    cy.get('[data-cy="select-day-item"]').contains('05.31').click();

    cy.get('[data-cy="select-day-button"]').should('contain.text', 'Сонгосон өдөр: 05.31');
    cy.get('[data-cy="Scheduled-Days"]').should('be.visible');
    cy.get('[data-cy="discount-price-0"]').should('contain.text', '450000');
  });

  it('Displays the correct event details with OneMockEvent', () => {
    interceptGraphql({
      state: 'success',
      operationName: 'GetRelatedEvents',
      data: {
        data: OneMockEvent, // Өөр mock өгөгдлийг ашиглаж байна
      },
    });

    cy.get('[data-cy="Scheduled-Days"]').should('be.visible');
    // cy.get('[data-cy="Scheduled-Day-0"]').should('contain.text', '25.06.08'); // Зөв огноо шалгах
    // cy.get('[data-cy="select-day-button"]').click();
    // cy.get('[data-cy="select-day-item"]').contains('06.08').click();
    // cy.get('[data-cy="select-day-button"]').should('contain.text', 'Сонгосон өдөр: 06.08');
    cy.get('[data-cy="unit-price-0"]').should('contain.text', '500000');
  });
});
