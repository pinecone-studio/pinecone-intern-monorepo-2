describe('Image upload page', () => {
  beforeEach(() => {
    cy.visit('/register/photos');
  });
  it('1. display the logo and header', () => {
    cy.contains('tinder').should('be.visible');
    cy.contains('Upload your image').should('be.visible');
    cy.contains('Please choose an image that represents you.').should('be.visible');
  });
  it('2. should interact with the "Upload image" button', () => {
    cy.get('[data-cy="upload-image-button"]').should('be.visible').click();
    cy.get('[data-cy="next-button"]').should('be.visible').click();
  });
  it('3. should interact with the remove button on the first image', () => {
    cy.get('[data-cy="upload-image-button"]').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dog.jpg', { force: true });

    cy.get('[data-cy="image-placeholder"]').first().find('[data-cy="remove-button"]').should('be.visible').click();
    cy.get('[data-cy="image-placeholder"]').first().should('not.have.class', 'relative');
  });
  it('4. should interact with the next button', () => {
    cy.get('[data-cy="upload-image-button"]').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dog.jpg', { force: true });

    cy.get('[data-cy="next-button"]').should('contain.text', 'Next');

    cy.get('[data-cy="next-button"]').should('be.visible').click();
    cy.url().should('include', '/register/all-set');
  });
  it('5. should go back to the home page when clicking "Back"', () => {
    cy.visit('/register/photos');
    cy.get('[data-cy="back-button"]').click();
    cy.url().should('include', '/register/details');
  });
  it('6. should go back to the home page when clicking "Back"', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dog.jpg', { force: true });

    cy.get('[data-cy="remove-button"]').click();
  });
  it('7. should be added gridItem when uploading more than 6 images ', () => {
    cy.get('[data-cy="upload-image-button"]').click();
    cy.fixture('dog.jpg').as('imageFile');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dog.jpg', { force: true });
    cy.fixture('kitten.jpg').as('imageFile');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/kitten.jpg', { force: true });
    cy.fixture('dog.jpg').as('imageFile');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dog.jpg', { force: true });
    cy.fixture('kitten.jpg').as('imageFile');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/kitten.jpg', { force: true });
    cy.fixture('dog.jpg').as('imageFile');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dog.jpg', { force: true });
    cy.fixture('kitten.jpg').as('imageFile');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/kitten.jpg', { force: true });
    cy.fixture('dog.jpg').as('imageFile');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/dog.jpg', { force: true });
  });
});
