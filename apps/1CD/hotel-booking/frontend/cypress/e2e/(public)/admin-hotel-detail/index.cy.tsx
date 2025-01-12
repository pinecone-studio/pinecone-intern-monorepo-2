/* eslint-disable max-lines */
describe('admin hotel detail test', () => {
  beforeEach(() => {
    cy.visit('/admin-hotel-detail/6783cddad1f2090809af97d7');
  });
  it('1. it should render', () => {
    cy.get('[data-cy=Admin-Hotel-Detail-Page]').should('be.visible');
  });
  it('2. it should render and aminities are exist', () => {
    cy.intercept('/api/graphql', (req) => {
      if (req.body.operationName === 'GetHotel') {
        req.reply({
          data: {
            getHotel: {
              hotelAmenities: ['test', 'test1'],
              hotelName: 'test',
              starRating: 5,
            },
          },
        });
      }
    });
    cy.get('[data-cy=Aminities-Badge]').should('be.visible');
  });
  it('2. click room types edit button then open dialog can update fields', () => {
    cy.get('[data-cy=Hotel-General-Info-Create-Dialog-Open]').click();
    cy.get('[data-cy=Update-Hotel-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=PhoneNumber-Input]').clear();
    cy.get('[data-cy=PhoneNumber-Input]').should('not.have.text');
    cy.get('[data-cy=Hotel-Name-Input]').clear();
    cy.get('[data-cy=Hotel-Name-Input]').should('not.have.text');
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Hotel-Name-Error]').should('be.visible');
    cy.get('[data-cy=Cancel-Button]').click();
    cy.get('[data-cy=Update-Hotel-General-Info-Page]').should('not.exist');
    cy.get('[data-cy=Hotel-General-Info-Create-Dialog-Open]').click();
    cy.get('[data-cy=Hotel-Name-Input]').clear().type('hotel test');
    cy.get('[data-cy="Stars-Rating-Select-Value1"]').click();
    cy.get('[data-cy=Selected-Stars2]').click();
    cy.get('[data-cy="Stars-Rating-Select-Value"]').should('have.text', '2 ⭐ hotel');

    cy.get('[data-cy=PhoneNumber-Input]').clear().type('80808080');
    cy.get('[data-cy=Review-Rating-Stars-Trigger]').click();
    cy.get('[data-cy=Review-Rating-Item1]').click();
    cy.get('[data-cy="Review-Rating-Stars"]').should('have.text', '1 ⭐');
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Update-Hotel-General-Info-Page]').should('not.exist');
  });
  it('3. if user should all room input filled and click save button', () => {
    cy.get('[data-cy=Add-Room-General-Info-Dialog]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=Room-Name-Input]').type('badral');
    cy.get('[data-cy=Select-Room-Type-Trigger]').click();
    cy.get('[data-cy=Selected-Type1]').click();
    cy.get('[data-cy=Selected-Room-Type-Value]').should('have.text', '2beds');
    cy.get('input[placeholder="Select options..."]').focus();
    cy.get('input[placeholder="Select options..."]').clear().type('24-hour front de');
    cy.get('input[placeholder="Select options..."]').trigger('keydown', { key: 'Enter', keyCode: 13, code: 'Enter' });
    cy.contains('shower').click({ force: true });
    cy.get('[data-cy=Price-Per-Night-Input]').type('5000');
    cy.get('[data-cy=Room-Save-Button]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('not.exist');
  });
  it('4. if user input not filled and click save button', () => {
    cy.get('[data-cy=Add-Room-General-Info-Dialog]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=Room-Save-Button]').click();
    cy.get('[data-cy=Price-Per-Night-Error]').should('be.visible');
    cy.get('[data-cy=Room-Type-Error]').should('be.visible');
    cy.get('[data-cy=Room-Name-Error]').should('be.visible');
  });
  it('5. if user cancel button', () => {
    cy.get('[data-cy=Add-Room-General-Info-Dialog]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('be.visible');
    cy.get('[data-cy=Room-Cancel-Button]').click();
    cy.get('[data-cy=Room-General-Info-Page]').should('not.exist');
  });
  it('6. open Amenities dialog then all filled input and can update', () => {
    cy.get('[data-cy=Open-Amenities-Dialog]').click();
    cy.get('[data-cy=Update-Amenities-Dialog]').should('exist');
    cy.get('input[placeholder="Select-Value"]').focus();
    cy.get('input[placeholder="Select-Value"]').trigger('keydown', { key: 'Delete', keyCode: 46, code: 'Delete' }); // Simulate Delete key event
    cy.get('[data-cy=Hotel-Amenities-Update-Button]').click({ force: true });
    cy.get('[data-cy=Error-Message-Amenities]').should('be.visible');
    cy.get('input[placeholder="Select-Value"]').type('showe');
    cy.get('input[placeholder="Select-Value"]').trigger('keydown', { key: 'Enter', keyCode: 13, code: 'Enter' }); // Simulate Delete key event
    cy.contains('shower').click({ force: true });
    cy.get('[data-cy=Hotel-Amenities-Update-Button]').click({ force: true });
    cy.get('[data-cy=Update-Amenities-Dialog]').should('not.exist');
    cy.get('[data-cy=Open-Amenities-Dialog]').click();
    cy.get('[data-cy=Update-Amenities-Dialog]').should('exist');
    cy.get('[data-cy=Hotel-Amenities-Cancel-Button]').click();
    cy.get('[data-cy=Update-Amenities-Dialog]').should('not.exist');
  });
  it('7. already have values hotel amenities', () => {
    cy.intercept('/api/graphql', (req) => {
      if (req.body.operationName === 'GetHotel') {
        req.reply({
          data: {
            getHotel: {
              _id: '1',
              hotelAmenities: [],
            },
          },
        });
      }
    });
    cy.get('[data-cy=Open-Amenities-Dialog]').click({ force: true });
    cy.get('[data-cy=Update-Amenities-Dialog]').should('exist');
  });
  it('8. click update location dialog then can update', () => {
    cy.get('[data-cy=Update-Location-Dialog-Open-Button]').click();
    cy.get('[data-cy=Update-Location-Dialog]').should('be.visible');
    cy.get('textarea[placeholder="Please Write..."]').type('ub', { force: true });
    cy.get('[data-cy=Update-Location-Button]').click();
    cy.get('[data-cy=Update-Location-Dialog]').should('not.exist');
    cy.get('[data-cy=Update-Location-Dialog-Open-Button]').click();
    cy.get('[data-cy=Update-Location-Dialog]').should('be.visible');
    cy.get('[data-cy=Location-Cancel-Button]').click();
    cy.get('[data-cy=Update-Location-Dialog]').should('not.exist');
  });
  it("9. getHotel data's location field is empty", () => {
    cy.intercept('/api/graphql', (req) => {
      if (req.body.operationName === 'GetHotel') {
        req.reply({
          data: {
            getHotel: {
              _id: '1',
              hotelAmenities: [],
            },
          },
        });
      }
    });
    cy.get('[data-cy=Update-Location-Dialog-Open-Button]').click();
    cy.get('[data-cy=Update-Location-Dialog]').should('be.visible');
  });
  it('10. click open image dialog button then add image click save button', () => {
    cy.get('[data-cy=Image-Update-Dialog-Open-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('be.visible');
    cy.get('[data-cy=Image-Upload-Input]').selectFile('cypress/fixtures/wallpaper.jpg', { force: true });
    cy.get('[data-cy=Remove-Image-Button1]').click();
    cy.get('[data-cy=Save-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('not.exist');
    cy.get('[data-cy=Image-Update-Dialog-Open-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('be.visible');
    cy.get('[data-cy=Cancel-Button]').click();
    cy.get('[data-cy=Image-Update-Dialog-Open-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('be.visible');
    cy.get('[data-cy=Remove-Image-Button]').eq(0).click();
  });
  it('11. get hotel data images field is empty', () => {
    cy.intercept('/api/graphql', (req) => {
      if (req.body.operationName === 'GetHotel') {
        req.reply({
          data: {
            getHotel: {
              _id: '1',
            },
          },
        });
      }
    });
    cy.get('[data-cy=Image-Update-Dialog-Open-Button]').click();
    cy.get('[data-cy=Dialog-Element]').should('be.visible');
  });
});
