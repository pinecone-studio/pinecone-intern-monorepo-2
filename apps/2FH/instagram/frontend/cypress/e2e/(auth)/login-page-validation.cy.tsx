describe('Login Page - Validation & Error Handling', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should test validation errors', () => {
      // Test by removing the disabled attribute to trigger validation
      cy.get('input[placeholder="Username, phone number, or email"]').invoke('removeAttr', 'required');
      cy.get('input[placeholder="Password"]').invoke('removeAttr', 'required');
      
      // Remove disabled state temporarily to test validation
      cy.get('button[type="submit"]').invoke('removeAttr', 'disabled').click();
      cy.contains('Please fill in all fields').should('be.visible');
  
      // Test with only email
      cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      cy.contains('Please fill in all fields').should('be.visible');
  
      // Test with only password
      cy.get('input[placeholder="Username, phone number, or email"]').clear();
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Please fill in all fields').should('be.visible');
  
      // Test form validation state - both fields filled should be enabled
      cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
      cy.reload(); // Reload to restore normal form behavior
      cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  
    it('should test precise validation error coverage', () => {
      cy.visit('/login');
      
      // Test initial state - button should be disabled
      cy.get('button[type="submit"]').should('be.disabled');
      
      // With only email, button should be disabled
      cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Clear email, add password only - button should be disabled
      cy.get('input[placeholder="Username, phone number, or email"]').clear();
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Add both fields - button should be enabled and can be clicked
      cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
      cy.get('button[type="submit"]').should('not.be.disabled').click();
      cy.wait(100);
    });
  
    it('should test complete error handling coverage', () => {
      // Test error clearing when input changes
      cy.interceptGraphql({
        operationName: 'LoginUser', 
        state: 'error',
        data: {
          errors: [{
            message: 'Test error',
            extensions: { code: 'TEST_ERROR' }
          }]
        }
      });
  
      cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@LoginUser');
      cy.contains('Test error').should('be.visible');
      
      // Clear error by changing input
      cy.get('input[placeholder="Username, phone number, or email"]').clear().type('new@example.com');
      cy.contains('Test error').should('not.exist');
      
      // Test error with password input change
      cy.get('button[type="submit"]').click();
      cy.wait('@LoginUser');
      cy.contains('Test error').should('be.visible');
      
      cy.get('input[placeholder="Password"]').clear().type('newpassword');
      cy.contains('Test error').should('not.exist');
    });
  
    it('should test form validation edge cases', () => {
      // First, let's check the initial state
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Test with whitespace only - should remain disabled
      cy.get('input[placeholder="Username, phone number, or email"]').type('   ');
      cy.get('input[placeholder="Password"]').type('   ');
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Clear and test with valid email but spaces in password
      cy.get('input[placeholder="Username, phone number, or email"]').clear().type('test@example.com');
      cy.get('input[placeholder="Password"]').clear().type('  password  ');
      
      // Button should be enabled with non-empty values
      cy.get('button[type="submit"]').should('not.be.disabled').click();
      cy.wait(100);
      
      // Test clearing one field - button should be disabled
      cy.get('input[placeholder="Username, phone number, or email"]').clear();
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Test clearing other field - button should be disabled
      cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
      cy.get('input[placeholder="Password"]').clear();
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Both fields filled - button should be enabled
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  });