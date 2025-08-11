import allPages from '../utils/all-pages.json';

describe('render all pages', () => {
  it(`Should render all page`, () => {
    cy.log(JSON.stringify(allPages));
    allPages.forEach((page) => {
      cy.visit(page);
    });
  });
});
