describe('Message Page', () => {
  beforeEach(() => {
    // Mock Clerk authentication
    cy.window().then((window) => {
      window.localStorage.setItem('clerk-db', JSON.stringify({
        lastSignInAt: new Date().toISOString(),
        user: {
          id: 'test_user_id',
          username: 'testuser',
          fullName: 'Test User'
        }
      }));
    });

    // Visit the messages page
    cy.visit('/message');
  });

  it('should show loading state initially', () => {
    cy.contains('Loading matches...').should('be.visible');
  });

  it('should display match list', () => {
    cy.get('[data-testid="match-list"]').should('exist');
    cy.get('[data-testid="match-item"]').should('have.length.at.least', 1);
  });

  it('should display chat section when match is selected', () => {
    cy.get('[data-testid="match-item"]').first().click();
    cy.get('[data-testid="chat-section"]').should('be.visible');
  });

  it('should send a message', () => {
    // Select first match
    cy.get('[data-testid="match-item"]').first().click();
    
    // Type and send a message
    const testMessage = 'Hello, this is a test message';
    cy.get('input[placeholder="Write a message..."]').type(testMessage);
    cy.get('button').contains('Send').click();

    // Verify message appears in chat
    cy.contains(testMessage).should('be.visible');
  });

  it('should show messages with correct alignment', () => {
    cy.get('[data-testid="match-item"]').first().click();

    // Check my messages are aligned right
    cy.get('[data-testid="message-bubble"]').each(($msg) => {
      if ($msg.find('[data-testid="sender-name"]').text() === 'You') {
        cy.wrap($msg).parent().should('have.class', 'justify-end');
      } else {
        cy.wrap($msg).parent().should('have.class', 'justify-start');
      }
    });
  });

  it('should handle empty message list', () => {
    // Mock empty message response
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetMessage') {
        req.reply({
          data: {
            getMessage: []
          }
        });
      }
    });

    cy.get('[data-testid="match-item"]').first().click();
    cy.contains('No messages yet').should('be.visible');
  });

  it('should handle network errors', () => {
    // Mock error response
    cy.intercept('POST', '/api/graphql', {
      statusCode: 500,
      body: { errors: [{ message: 'Internal server error' }] }
    });

    cy.get('[data-testid="match-item"]').first().click();
    cy.contains('Error:').should('be.visible');
  });
}); 