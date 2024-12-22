describe('Chat page should be visible', () => {
    beforeEach(() => {
      cy.visit('/chat');
    });
  
  
    it('1. When clicking on a matched user with no previous chat, it should push the ID of the selected user to the URL', () => {

      cy.get('[data-cy^="Matched-Users-"]')
        .first()
        .should('be.visible')
        .invoke('attr', 'data-cy')
        .then((dataCy) => {
          if (dataCy && typeof dataCy === 'string') {
            const userId = dataCy.replace('Matched-Users-', '');
            cy.get(`[data-cy="Matched-Users-${userId}"]`).click();
            
            cy.url().should('include', `/chat/${userId}`);
          } else {
            throw new Error('data-cy attribute not found or has an invalid format');
          }
        });
    });

  
    it('2. When clicking on a matched user with previous chat, it should push the ID of the selected user to the URL', () => {
      cy.get('[data-cy^="Matched-Users-"]')
        .first()
        .should('be.visible')
        .invoke('attr', 'data-cy')
        .then((dataCy) => {
          if (dataCy && typeof dataCy === 'string') {
            const userId = dataCy.replace('Matched-Users-', '');
            cy.get(`[data-cy="Matched-Users-${userId}"]`).click();
            cy.url().should('include', `/chat/${userId}`);
          } else {
            throw new Error('data-cy attribute not found or has an invalid format');
          }
        });
    });
  });
  