/* eslint-disable camelcase */

import { interceptGraphql } from 'cypress/utils/intercept-graphql';
describe('InputImage Component', () => {
  beforeEach(() => {
    const mockToken = {
      token: 'faketoken',
    };
    cy.window().then((window) => {
      window.localStorage.setItem('token', JSON.stringify(mockToken));
    });
    interceptGraphql({
      state: '',
      operationName: 'GetMe',
      data: {
        data: {
          getMe: {
            email: 'example@gmail.com',
            role: 'admin',
            phoneNumber: '+976 95160812',
            __typename: 'User',
          },
        },
      },
    });
    cy.visit('/admin/home');
    cy.get('[data-testid="edit-event-button-6783e3c08516e7cebc45071a"]').click();
  });

  it('should upload and preview the image', () => {
    cy.get('[data-testid="image_preview"]').should('be.visible');
    cy.get('[data-testid="delete_image_button"]').click();

    cy.get('[data-testid="image_preview"]').should('not.exist');
    const imagePath = 'mock-image.png';

    cy.get('[data-testid="image_upload_button"]').should('be.visible');
    cy.get('[data-testid="image_upload_button"]').click();

    cy.fixture(imagePath, 'base64').then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
      const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      cy.get('[data-testid="file_input"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        input.files = dataTransfer.files;
        cy.wrap($input).trigger('change', { force: true });
      });
      cy.get('[data-testid="image_upload_loading"]').should('be.visible');
      cy.get('[data-testid="image_preview"]').should('be.visible');
    });
  });
});
