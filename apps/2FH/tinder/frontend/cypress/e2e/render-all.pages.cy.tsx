import allPages from '../utils/all-pages.json';

describe('render all pages', () => {
  it(`Should render all pages`, () => {
    cy.log(`Testing pages: ${JSON.stringify(allPages)}`);
    
    allPages.forEach((page) => {
      const pagePath = page === '/' ? '/' : `/${page}`;
      cy.visit(pagePath);
      cy.get('body').should('be.visible');
    });
  });
});
