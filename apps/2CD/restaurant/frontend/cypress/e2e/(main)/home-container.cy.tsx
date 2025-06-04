import React from 'react';
import HomeContainer from '../../../src/app/Home/components/HomeContainer';
import { mount } from 'cypress/react18'; 

describe('HomeContainer component', () => {
  it('renders all tacos', () => {
    mount(<HomeContainer />);
    cy.contains('Taco').should('have.length', 4);
  });

  it('applies 20% discount on click', () => {
    mount(<HomeContainer />);
    cy.contains('15.6k').should('exist');

    cy.contains('20% Sale').first().click();
    cy.contains('10.0k').should('exist');
  });

  it('does not reduce price below 0', () => {
    mount(<HomeContainer />);
    const saleButton = cy.contains('20% Sale').first();

    // Click the button multiple times
    for (let i = 0; i < 10; i++) {
      saleButton.click();
    }

    cy.contains('0.0k').should('exist');
  });
});