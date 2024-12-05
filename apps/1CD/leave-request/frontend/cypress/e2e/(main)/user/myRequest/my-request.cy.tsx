describe('my-request', () => {
    it('should display the my request', () => {
      cy.visit('/myRequest');
      cy.get('button').contains('+ Чөлөө хүсэх').click();
    });
  });
  