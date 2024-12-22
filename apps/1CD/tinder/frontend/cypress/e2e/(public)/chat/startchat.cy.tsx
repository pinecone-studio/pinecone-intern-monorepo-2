describe('Chat page should be visible', () => {
  beforeEach(() => {
    cy.visit('/chat/6747b8ca2620b89f89ae1b54');
  });
  it('1.When click on the match that has previously chatted view profile button should be seen and when send new message new message should be seen', () => {
    cy.get('[data-cy="Chat-Part-Message-Input"]').type('hellloooo');
    cy.get('[data-cy="Chat-Part-Send-Button"]').click();
    cy.get('[data-cy="Chat-Part-Page"]').contains('hellloooo');
    cy.get('[data-cy="Chat-Part-Message-Input"]').should('not.have.value');
  });

  it('2. When clicking on a matched user with no previous chat, it should push the ID of the selected user to the URL', () => {
    cy.get('[data-cy^="Matched-Users-"]')
      .first()
      .should('be.visible')
      .invoke('attr', 'data-cy')
      .then((dataCy) => {
        if (dataCy && typeof dataCy === 'string') {
          const userId = dataCy.replace('Matched-Users-', '');
          cy.get(`[data-cy="Matched-Users-${userId}"]`).click();

          cy.url().should('include', `/chat/${userId}`);
          cy.get('[data-cy="Chat-Part-Page"]').contains('You’ve got a match! Send a message to start chatting').should('be.visible');
          cy.get('[data-cy="Chat-Part-Message-Input"]').type('helllo');
          cy.get('[data-cy="Chat-Part-Send-Button"]').click();
          cy.get('[data-cy="Chat-Part-Page"]').contains('helllo');
          cy.get('[data-cy="Chat-Part-Message-Input"]').should('not.have.value');
        } else {
          throw new Error('data-cy attribute not found or has an invalid format');
        }
      });
  });

  it('3. When clicking on a matched user with previous chat, it should push the ID of the selected user to the URL', () => {
    cy.get('[data-cy^="Matched-User-"]')
      .first()
      .should('be.visible')
      .invoke('attr', 'data-cy')
      .then((dataCy) => {
        if (dataCy && typeof dataCy === 'string') {
          const userId = dataCy.replace('Matched-User-', '');
          cy.get(`[data-cy="Matched-User-${userId}"]`).click();

          cy.url().should('include', `/chat/${userId}`);
          cy.get('[data-cy="Chat-Part-Message-Input"]').type('helllo');
          cy.get('[data-cy="Chat-Part-Send-Button"]').click();
          cy.get('[data-cy="Chat-Part-Page"]').contains('helllo');
          cy.get('[data-cy="Chat-Part-Message-Input"]').should('not.have.value');
        } else {
          throw new Error('data-cy attribute not found or has an invalid format');
        }
      });
  });
});
