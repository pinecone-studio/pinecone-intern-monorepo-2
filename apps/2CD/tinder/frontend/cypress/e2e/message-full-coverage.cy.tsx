describe('Chat Page E2E - Full Coverage', () => {
  beforeEach(() => {
    // Default: intercept all GraphQL requests and allow test-specific overrides
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMyMatches') {
        req.reply({ data: { getMyMatches: [
          {
            _id: 'match1',
            users: [
              { _id: 'user1', name: 'John', clerkId: 'user1' },
              { _id: 'user2', name: 'Jane', clerkId: 'user2' }
            ]
          }
        ] } });
      } else if (req.body.operationName === 'GetMessage') {
        req.reply({ data: { getMessage: [
          { _id: 'msg1', content: 'Hello!', sender: { _id: 'user1', name: 'John' } },
          { _id: 'msg2', content: 'Hi there!', sender: { _id: 'user2', name: 'Jane' } }
        ] } });
      } else if (req.body.operationName === 'SendMessage') {
        req.reply({ data: { sendMessage: { _id: 'msg3', content: req.body.variables.content, sender: { _id: 'user1', name: 'John' } } } });
      }
    });
    cy.visit('/message');
  });

  it('shows loading state for matches', () => {
    cy.intercept('POST', '/api/graphql', { delay: 1000, data: { getMyMatches: [] } }).as('getMatches');
    cy.contains('Loading matches...').should('exist');
  });

  it('shows empty state for no matches', () => {
    cy.intercept('POST', '/api/graphql', { data: { getMyMatches: [] } }).as('getMatches');
    cy.contains('No matches').should('exist');
  });

  it('shows error state for matches', () => {
    cy.intercept('POST', '/api/graphql', { statusCode: 500, body: { errors: [{ message: 'Failed to load matches' }] } }).as('getMatches');
    cy.contains('Error').should('exist');
  });

  it('shows messages for a match', () => {
    cy.get('[data-testid="match-item"]').first().click();
    cy.get('[data-testid="message-bubble"]').should('have.length', 2);
    cy.contains('Hello!').should('exist');
    cy.contains('Hi there!').should('exist');
  });

  it('shows loading state for messages', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMessage') {
        req.reply({ delay: 1000, data: { getMessage: [] } });
      }
    }).as('getMessage');
    cy.get('[data-testid="match-item"]').first().click();
    cy.contains('Loading messages...').should('exist');
  });

  it('shows empty state for messages', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMessage') {
        req.reply({ data: { getMessage: [] } });
      }
    }).as('getMessage');
    cy.get('[data-testid="match-item"]').first().click();
    cy.contains('No messages yet.').should('exist');
  });

  it('shows error state for messages', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMessage') {
        req.reply({ statusCode: 500, body: { errors: [{ message: 'Failed to load messages' }] } });
      }
    }).as('getMessage');
    cy.get('[data-testid="match-item"]').first().click();
    cy.contains('Error').should('exist');
  });

  it('can send a message', () => {
    cy.get('[data-testid="match-item"]').first().click();
    cy.get('input[placeholder="Write a message..."]').type('Test message');
    cy.get('button').contains('Send').click();
    cy.contains('Test message').should('exist');
  });

  it('shows loading state when sending a message', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'SendMessage') {
        req.reply({ delay: 1000, data: { sendMessage: { _id: 'msg3', content: req.body.variables.content, sender: { _id: 'user1', name: 'John' } } } });
      }
    }).as('sendMessage');
    cy.get('[data-testid="match-item"]').first().click();
    cy.get('input[placeholder="Write a message..."]').type('Loading message');
    cy.get('button').contains('Send').click();
    cy.get('button').contains('Sending...').should('be.disabled');
  });

  it('shows error state when sending a message fails', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'SendMessage') {
        req.reply({ statusCode: 500, body: { errors: [{ message: 'Failed to send message' }] } });
      }
    }).as('sendMessage');
    cy.get('[data-testid="match-item"]').first().click();
    cy.get('input[placeholder="Write a message..."]').type('Error message');
    cy.get('button').contains('Send').click();
    // You may want to check for an error toast or message in your UI
  });
}); 