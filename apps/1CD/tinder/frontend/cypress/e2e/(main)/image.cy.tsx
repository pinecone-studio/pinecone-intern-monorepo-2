describe('Image upload page', () => {
    beforeEach(() => {
      cy.visit('/sign-up/image');
    });
    it('1. display the logo and header', () => {
      cy.get('[data-cy="logo-container"]').should('be.visible');
      cy.contains('tinder').should('be.visible');
      cy.contains('Upload your image').should('be.visible');
      cy.contains('Please choose an image that represents you').should('be.visible');
    });
    it('2. should interact with the "Upload image" button', () => {
      cy.get('[data-cy="upload-image-button"]').should('be.visible').click();
      cy.get('[data-cy="next-button"]').should('be.visible').click();
      cy.url().should('include', '/');
    });
    it('3. should interact with the remove button on the first image', () => {
      cy.get('[data-cy="image-placeholder"]').first().find('[data-cy="remove-button"]').should('be.visible').click();
    });
    it('4. should interact with the next button', () => {
      cy.get('[data-cy="next-button"]').should('be.visible').click();
      cy.url().should('include', '/');
    });
    it('5. should go back to the home page when clicking "Back"', () => {
      cy.visit('/sign-up/image');
      cy.get('[data-cy="back-button"]').click();
      cy.url().should('include', '/');
    });
  });
