describe('Chat page should be visible', () => {
  beforeEach(() => {
    cy.visit('/chat');
  });

  it('1.When clicking on a matched user with no previous chat, it should push the ID of the selected user to the URL', () => {
    cy.get('[data-cy^="Matched-Users-"]')
      .should('have.length.greaterThan', 0)
      .first()
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

  it('2.When clicking on a matched user with previous chat, it should push the ID of the selected user to the URL', () => {
    cy.get('[data-cy^="Matched-User-"]')
      .should('have.length.greaterThan', 0)
      .first()
      .invoke('attr', 'data-cy')
      .then((dataCy) => {
        if (dataCy && typeof dataCy === 'string') {
          const userId = dataCy.replace('Matched-User-', '');
          cy.get(`[data-cy="Matched-User-${userId}"]`).click();
          cy.url().should('include', `/chat/${userId}`);
        } else {
          throw new Error('data-cy attribute not found or has an invalid format');
        }
      });
  });

  it('3.When there are no match it should render No Matches Yet text', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetMatchedUsers') {
        console.log('This is operation name', req.body.operationName);
        req.reply({
          statusCode: 200,
          body: {
            errors: [{ message: 'Error occurred: No matches found' }],
          },
        });
      }
    }).as('GetMatchedUsers');
    cy.visit('/chat');
    cy.wait('@GetMatchedUsers').then((intercept) => {
      assert.isNotNull(intercept.response?.body, 'Error occurred: No matches found');
    });
    cy.get('[data-cy="No-Matches-Found"]').should('be.visible');
    cy.get('[data-cy="No-Matches-Found"] p').first().should('contain.text', 'No Matches Yet');
    cy.get('[data-cy="No-Matches-Found"] p').last().should('contain.text', 'Keep swiping, your next match could be just around the corner!');
  });

  it('4.When there is error other than no match, it should display Error occured try again text', () => {
    cy.intercept('POST', 'api/graphql', (req) => {
      if (req.body.operationName === 'GetMatchedUsers') {
        req.reply({
          statusCode: 200,
          body: {
            errors: [{ message: 'Error occurred: Internal Server error' }],
          },
        });
      }
    }).as('GetMatchedUsers');
    cy.visit('/chat');
    cy.wait('@GetMatchedUsers').then((intercept) => {
      assert.isNotNull(intercept.response?.body, 'Error occurred: Internal Server error');
    });
    cy.get('[data-cy="Error occured"]').should('be.visible');
    cy.get('[data-cy="Error occured"] p').should('contain.text', 'Error occurred, try again');
  });
});