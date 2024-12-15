describe('InputImage Component', () => {
  beforeEach(() => {
    cy.intercept('POST', `https://api.cloudinary.com/v1_1/${Cypress.env('NEXT_PUBLIC_CLOUD_NAME')}/image/upload`, {
      statusCode: 200,
      body: {
        secureUrl: 'https://example.com/test-image.jpg',
      },
    }).as('imageUpload');

    cy.visit('/admin/home');
    cy.get('[data-testid="create-event-button"]').click();
  });

  it('should upload and preview the image', () => {
    const imagePath = '../../public/images/logo.png';
    cy.get('[data-testid="image-upload-button"]').should('be.visible');
    cy.get('[data-testid="image-upload-button"]').click();
    cy.fixture(imagePath, 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
      const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      cy.get('[data-testid="file-input"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        input.files = dataTransfer.files;
        cy.wrap($input).trigger('change', { force: true });
      });
      cy.get('[data-testid="image-upload-loading"]').should('be.visible');
      cy.get('[data-testid="image-preview"]').should('be.visible');
    });
  });

  it('should delete the uploaded image', () => {
    const imagePath = '../../public/images/logo.png';

    cy.get('[data-testid="image-upload-button"]').click();
    cy.fixture(imagePath, 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
      const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      cy.get('[data-testid="file-input"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        input.files = dataTransfer.files;
        cy.wrap($input).trigger('change', { force: true });
      });
      cy.get('[data-testid="image-preview"]').should('be.visible');
      cy.get('[data-testid="delete-image-button"]').click();
      cy.get('[data-testid="image-preview"]').should('not.exist');
    });
  });
});
