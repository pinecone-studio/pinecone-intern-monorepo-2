/* eslint-disable */
describe('Add Hotel Page', () => {
  beforeEach(() => {
    cy.mockGraphQL();
    cy.visit('/admin/add-hotel');
  });

  it('should display all form sections', () => {
    cy.get('[data-cy=basic-information]').should('exist');
    cy.get('[data-cy=image-upload]').should('exist');
    cy.get('[data-cy=languages-section]').should('exist');
    cy.get('[data-cy=amenities-section]').should('exist');
    cy.get('[data-cy=policies-section]').should('exist');
    cy.get('[data-cy=faq-section]').should('exist');
    cy.get('[data-cy=optional-extras-section]').should('exist');
  });

  it('should allow uploading images', () => {
    // Test with a sample image URL instead of fixture file
    const imageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';

    // Download the image and attach it to the file input
    cy.request(imageUrl).then((response) => {
      const fileName = 'sample-hotel.jpg';
      const fileContent = response.body;

      cy.get('input[type=file]').attachFile({
        fileContent,
        fileName,
        mimeType: 'image/jpeg',
      });
    });
  });

  it('should navigate back when Back is clicked', () => {
    cy.visit('/admin');
    cy.visit('/admin/add-hotel');
    cy.get('[data-cy=back-button]').click();
    cy.url().should('include', '/admin');
  });

  it('should navigate back when Cancel is clicked', () => {
    cy.visit('/admin');
    cy.visit('/admin/add-hotel');
    cy.get('[data-cy=cancel-button]').click();
    cy.url().should('include', '/admin');
  });
});

/// <reference types="cypress" />

describe('Add Hotel Mutation', () => {
  beforeEach(() => {
    cy.visit('/admin/add-hotel');
  });

  it('should submit form and handle success', () => {
    // Mock a successful response that will trigger the alert
    cy.intercept('POST', 'https://hotelbooking-2fh-backend-developmen.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'CreateHotel') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createHotel: {
                success: true,
                hotel: {
                  id: 'test-hotel-id',
                  name: 'Test Hotel',
                  description: 'A beautiful test hotel',
                },
              },
            },
          },
        });
      }
    }).as('createHotelSuccess');

    cy.fillBasicHotelInfo();
    cy.submitHotelForm();

    cy.wait('@createHotelSuccess');

    // This should trigger the alert on line 78
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Hotel created successfully');
    });

    cy.url().should('include', '/admin');
  });

  it('should handle GraphQL error', () => {
    cy.mockCreateHotelResponse(false);

    cy.fillBasicHotelInfo({ name: 'Error Hotel' });
    cy.submitHotelForm();

    cy.wait('@createHotel');

    // The error message should appear after the GraphQL call fails
    // Check that the error message exists and contains some error text
    cy.get('[data-cy=error-message]', { timeout: 10000 }).should('exist').and('contain', 'Error:');
  });

  it('should handle mutation success but hotel creation failed', () => {
    // Mock a response where the mutation succeeds but success is false
    cy.intercept('POST', 'https://hotelbooking-2fh-backend-developmen.vercel.app/api/graphql', (req) => {
      if (req.body.operationName === 'CreateHotel') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createHotel: {
                success: false,
                hotel: null,
                message: 'Hotel creation failed',
              },
            },
          },
        });
      }
    }).as('createHotelFailed');

    cy.fillBasicHotelInfo({ name: 'Failed Hotel' });
    cy.submitHotelForm();

    cy.wait('@createHotelFailed');

    // Should not show alert and should stay on the form page
    cy.get('[data-cy=add-hotel-form]').should('exist');
    cy.url().should('include', '/admin/add-hotel');
  });
});

describe('Form Sections Interaction', () => {
  beforeEach(() => {
    cy.mockGraphQL();
    cy.visit('/admin/add-hotel');
  });

  it('should handle languages section interactions', () => {
    cy.get('[data-cy="languages-section"]').should('exist');

    // Test adding a new language
    cy.get('[data-cy="languages-section"] input').first().clear().type('Spanish');
    cy.get('[data-cy="languages-section"] input').first().should('have.value', 'Spanish');

    // Test adding another language
    cy.get('[data-cy="languages-section"] button').contains('Add Language').click();
    cy.get('[data-cy="languages-section"] input').last().type('French');
    cy.get('[data-cy="languages-section"] input').last().should('have.value', 'French');

    // Test removing a language - use the button with X icon
    cy.get('[data-cy="languages-section"] button').first().click();
  });

  it('should handle amenities section interactions', () => {
    cy.get('[data-cy="amenities-section"]').should('exist');

    // Test selecting amenities using the checkbox labels
    cy.get('[data-cy="amenities-section"] label').first().click();
    cy.get('[data-cy="amenities-section"] label').last().click();

    // Verify amenities are selected by checking the checkbox state
    cy.get('[data-cy="amenities-section"] input[type="checkbox"]').first().should('be.checked');
    cy.get('[data-cy="amenities-section"] input[type="checkbox"]').last().should('be.checked');
  });

  it('should handle policies section interactions', () => {
    cy.get('[data-cy="policies-section"]').should('exist');
    cy.get('[data-cy="policies-section"] input').first().clear().type('15:00');
    cy.get('[data-cy="policies-section"] input').first().should('have.value', '15:00');
    cy.get('[data-cy="policies-section"] textarea').first().clear().type('New check-in instructions');
    cy.get('[data-cy="policies-section"] textarea').first().should('contain', 'New check-in instructions');
  });
  it('should handle FAQ section interactions', () => {
    cy.get('[data-cy="faq-section"]').should('exist');
    cy.get('[data-cy="faq-section"] button').contains('Add FAQ').click();
    cy.get('[data-cy="faq-section"] input').last().type('What is the cancellation policy?');
    cy.get('[data-cy="faq-section"] textarea').last().type('Free cancellation up to 24 hours before check-in');
    cy.get('[data-cy="faq-section"] input').last().should('have.value', 'What is the cancellation policy?');
    cy.get('[data-cy="faq-section"] textarea').last().should('contain', 'Free cancellation up to 24 hours before check-in');
  });
  it('should handle optional extras section interactions', () => {
    cy.get('[data-cy="optional-extras-section"]').should('exist');
    cy.get('[data-cy="optional-extras-section"] textarea').first().clear().type('Free parking available');
    cy.get('[data-cy="optional-extras-section"] textarea').last().clear().type('Spa services available');
    cy.get('[data-cy="optional-extras-section"] textarea').first().should('contain', 'Free parking available');
    cy.get('[data-cy="optional-extras-section"] textarea').last().should('contain', 'Spa services available');
  });
  it('should handle form data persistence across sections', () => {
    cy.get('#name').type('Test Hotel');
    cy.get('[data-cy="languages-section"] input').first().clear().type('French');
    cy.get('[data-cy="amenities-section"] label').first().click();
    cy.get('[data-cy="policies-section"] input').first().clear().type('16:00');
    cy.get('[data-cy="faq-section"] input').first().clear().type('What amenities are included?');
    cy.get('[data-cy="optional-extras-section"] textarea').first().clear().type('All inclusive package');
    cy.get('#name').should('have.value', 'Test Hotel');
    cy.get('[data-cy="languages-section"] input').first().should('have.value', 'French');
    cy.get('[data-cy="amenities-section"] input[type="checkbox"]').first().should('be.checked');
    cy.get('[data-cy="policies-section"] input').first().should('have.value', '16:00');
    cy.get('[data-cy="faq-section"] input').first().should('have.value', 'What amenities are included?');
    cy.get('[data-cy="optional-extras-section"] textarea').first().should('contain', 'All inclusive package');
  });
});
