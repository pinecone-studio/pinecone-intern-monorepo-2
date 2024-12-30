import { data } from 'cypress/fixtures/orders-mock';
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
    cy.get('[data-cy="order-info-title"]').should('contain', 'Захиалгын мэдээлэл');
    cy.get('[data-cy^="order-card-"]').should('have.length.greaterThan', 0);
    cy.get('[data-cy^="order-id-"]').first().should('exist');
    cy.get('[data-cy^="cancel-button"]').click();
    cy.get('button:has(svg.lucide-x)').click();
  });
});
