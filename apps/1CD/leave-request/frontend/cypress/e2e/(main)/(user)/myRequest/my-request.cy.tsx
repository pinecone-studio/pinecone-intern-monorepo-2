

describe('MyRequest', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN_SUPERVISEE'] as string;
    cy.setCookie('authtoken', token);
  });
    it('should display the my request', () => {
      cy.visit('/MyRequest');
      cy.get('button').contains('+ Чөлөө хүсэх').click();
    });
  });
  