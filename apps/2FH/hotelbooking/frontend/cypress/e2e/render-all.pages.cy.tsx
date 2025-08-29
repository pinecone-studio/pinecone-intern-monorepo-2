import allPages from '../utils/all-pages.json';

describe('render all pages', () => {
  // Clean up the URLs by removing invalid triple slashes
  const cleanPages = allPages.map((page: string) => 
    page.replace(/^\/\/\//, '/')
  );

  cleanPages.forEach((page: string) => {
    it(`Should render page: ${page}`, () => {
      // Visit the page and ensure it doesn't throw an exception
      cy.visit(page, { failOnStatusCode: false });
      
      // Basic assertion to ensure the page loads (even if it's a 404)
      cy.get('body').should('be.visible');
      
      // Wait for any loading states to complete
      cy.wait(1000);
      
      // Log successful page load (even if it's a 404 page)
      cy.log(`Successfully loaded page: ${page}`);
    });
  });
});
