describe('MyRequest', () => {
    it('should display the my request', () => {
      cy.visit('/MyRequest');
      cy.get('button').contains('+ Чөлөө хүсэх').click();
    });
  });
  