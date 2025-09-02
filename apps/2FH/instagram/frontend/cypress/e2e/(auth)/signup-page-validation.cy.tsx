 describe('Signup Page - Validation & Error Handling', () => {
    beforeEach(() => {
      cy.visit('/signup');
    });
  
    it('should test comprehensive validation and error patterns', () => {
      cy.get('input').invoke('removeAttr', 'required');
      cy.get('button[type="submit"]').click();
      cy.wait(100);
      
      cy.get('input[placeholder="Password"]').type('pass123');
      cy.get('input[placeholder="Full Name"]').type('Test');
      cy.get('input[placeholder="Username"]').type('test');
      cy.get('button[type="submit"]').click();
      cy.wait(100);
  
      cy.interceptGraphql({
        operationName: 'CreateUser',
        state: 'error',
        data: {
          errors: [{
            message: 'Network error occurred'
          }]
        }
      });
  
      cy.get('input[placeholder="Email Address"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Full Name"]').type('Test User');
      cy.get('input[placeholder="Username"]').type('testuser');
      cy.get('select[aria-hidden="true"]').first().select('OTHER', { force: true });
      cy.get('button[type="submit"]').click();
      cy.wait('@CreateUser');
      cy.wait(100);
  
      cy.visit('/signup');
      cy.get('input').invoke('removeAttr', 'required');
      cy.get('button[type="submit"]').click();
      cy.wait(100);
      cy.contains('Please fill in all fields').should('be.visible');
      
      cy.get('input[placeholder="Email Address"]').type('test2@example.com');
      cy.wait(100);
      cy.contains('Please fill in all fields').should('not.exist');
      
      cy.get('input[placeholder="Password"]').type('123');
      cy.get('input[placeholder="Full Name"]').type('Test User');
      cy.get('input[placeholder="Username"]').type('testuser2');
      cy.get('select[aria-hidden="true"]').first().select('OTHER', { force: true });
      cy.get('button[type="submit"]').click();
      cy.wait(100);
      cy.contains('Password must be at least 6 characters long').should('be.visible');
      cy.get('select[aria-hidden="true"]').first().select('FEMALE', { force: true });
      cy.wait(100);
      cy.contains('Password must be at least 6 characters long').should('not.exist');
    });
  
    it('should test error clearing on input changes', () => {
      // Test error clearing when inputs change
      cy.interceptGraphql({
        operationName: 'CreateUser',
        state: 'error',
        data: {
          errors: [{
            message: 'Test signup error',
            extensions: { code: 'TEST_ERROR' }
          }]
        }
      });
  
      cy.get('input[placeholder="Email Address"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Full Name"]').type('Test User');
      cy.get('input[placeholder="Username"]').type('testuser');
      cy.get('select[aria-hidden="true"]').first().select('OTHER', { force: true });
      cy.get('button[type="submit"]').click();
      cy.wait('@CreateUser');
      cy.contains('Test signup error').should('be.visible');
      
      // Clear error by changing email
      cy.get('input[placeholder="Email Address"]').clear().type('new@example.com');
      cy.contains('Test signup error').should('not.exist');
      
      // Trigger error again
      cy.get('button[type="submit"]').click();
      cy.wait('@CreateUser');
      cy.contains('Test signup error').should('be.visible');
      
      // Clear error by changing password
      cy.get('input[placeholder="Password"]').clear().type('newpassword123');
      cy.contains('Test signup error').should('not.exist');
      
      // Test with other inputs
      cy.get('button[type="submit"]').click();
      cy.wait('@CreateUser');
      cy.contains('Test signup error').should('be.visible');
      
      cy.get('input[placeholder="Full Name"]').clear().type('New User');
      cy.contains('Test signup error').should('not.exist');
      
      cy.get('button[type="submit"]').click();
      cy.wait('@CreateUser');
      cy.contains('Test signup error').should('be.visible');
      
      cy.get('input[placeholder="Username"]').clear().type('newuser');
      cy.contains('Test signup error').should('not.exist');
    });
  });