

describe('MyRequest', () => {
  beforeEach(() => {
    const token = Cypress.env().env['ANNUAL_TOKEN'] as string;
    cy.setCookie('authtoken', token);
  });
    it('should display the my request', () => {
      cy.visit('/MyRequest');
      cy.get('button').contains('+ Чөлөө хүсэх').click();
    });
  });
  