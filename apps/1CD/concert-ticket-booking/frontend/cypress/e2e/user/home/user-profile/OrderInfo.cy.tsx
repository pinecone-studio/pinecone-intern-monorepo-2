import { data } from 'cypress/utils/orders-mock';
import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('OrderInfo Page with API Data', () => {
  beforeEach(() => {
    cy.visit('/user/home/user-profile');
  });
  it('2. Should display posts when fetch post successfully', () => {
    interceptGraphql({
      state: '',
      operationName: 'GetOrder',
      data: {
        data,
      },
    });
    cy.get('[data-cy="order-state-button"]').click();
    cy.get('[data-cy="order-info-title"]').should('contain', 'Захиалгын мэдээлэл');
    cy.get('[data-cy="order-id-676e4e8a57bd55115f8bafce"]').first().should('exist');
    cy.get('[data-cy="cancel-button-67720a5842a9de4bf2a056ca"]').click();
    cy.get('button:has(svg.lucide-x)').first().click();
  });
});
