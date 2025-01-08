/* eslint-disable camelcase */
import crypto from 'crypto';
import { interceptGraphql } from 'cypress/utils/intercept-graphql';
function generateSignature(publicId: string, timestamp: number): string {
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  return stringToSign;
}

function generateSHA1(signature: string, apiSecret: string): string {
  // const crypto = require('crypto');
  return crypto
    .createHash('sha1')
    .update(signature + apiSecret)
    .digest('hex');
}

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
    cy.get('[data-testid="create-event-button"]').click();

    // Intercept the Cloudinary image upload POST request
    cy.intercept('POST', 'https://api.cloudinary.com/**').as('cloudinaryRequest');
    // // Intercept the delete image request
    // cy.intercept('POST', 'https://api.cloudinary.com/v1_1/**/image/destroy').as('deleteRequest');
  });

  afterEach(() => {
    const cloudinaryConfig = {
      cloudName: Cypress.env('CLOUDINARY_CLOUD_NAME'),
      apiKey: Cypress.env('CLOUDINARY_API_KEY'),
      apiSecret: Cypress.env('CLOUDINARY_API_SECRET'),
    };

    // Wait for the Cloudinary upload request to complete
    cy.wait('@cloudinaryRequest').then((interception) => {
      console.log('Intercepted Upload Request:', interception);

      const uploadedImage = interception.response?.body;

      // Ensure public_id is present
      if (!uploadedImage?.public_id) {
        console.error('No public_id found in Cloudinary response');
        return;
      }

      const timestamp = Math.floor(Date.now() / 1000);

      const signatureString = generateSignature(uploadedImage.public_id, cloudinaryConfig.apiSecret);
      const signature = generateSHA1(signatureString, cloudinaryConfig.apiSecret);

      cy.request({
        method: 'POST',
        url: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
        body: {
          public_id: uploadedImage.public_id,
          signature: signature,
          api_key: cloudinaryConfig.apiKey,
          timestamp: timestamp,
        },
        failOnStatusCode: false,
      }).then((deleteResponse) => {
        console.log('Delete response:', deleteResponse);
        if (deleteResponse.status === 200) {
          expect(deleteResponse.body).to.have.property('result', 'ok');
        } else {
          console.error('Failed to delete image:', deleteResponse.body);
        }
      });
    });
  });

  it('should upload and preview the image', () => {
    const imagePath = 'mock-image.png';

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

      // Verify loading spinner and image preview
      cy.get('[data-testid="image-upload-loading"]').should('be.visible');
      cy.get('[data-testid="image-preview"]').should('be.visible');
      cy.get('[data-testid="delete-image-button"]').click();
      cy.get('[data-testid="image-upload-loading"]').should('be.visible');
      cy.get('[data-testid="image-preview"]').should('not.exist');
    });
  });

  it('should delete the uploaded image', () => {
    const imagePath = 'mock-image.png'; // Ensure this path is correct for your fixtures
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

      // Wait for the preview and ensure it's visible
      cy.get('[data-testid="image-preview"]').should('be.visible');
      cy.get('[data-testid="delete-image-button"]').click();
      cy.get('[data-testid="image-upload-loading"]').should('be.visible');
      cy.get('[data-testid="image-upload-loading"]').should('not.exist');
      cy.get('[data-testid="image-preview"]').should('not.exist');
    });
  });
});
