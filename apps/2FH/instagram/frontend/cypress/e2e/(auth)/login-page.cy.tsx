/* eslint-disable max-lines */

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should render login page elements', () => {
    cy.get('img[alt="Instagram"]').should('be.visible');
    cy.get('input[placeholder="Username, phone number, or email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.contains('Log in').should('be.visible');
    cy.contains('Forgot password?').should('be.visible');
    cy.contains('Sign Up').should('be.visible');
  });

  it('should handle form input changes', () => {
    cy.get('input[placeholder="Username, phone number, or email"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com');
    
    cy.get('input[placeholder="Password"]')
      .type('password123')
      .should('have.value', 'password123');
  });

  it('should handle form submission attempt', () => {
    cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    
    cy.contains('Log in').click();
    
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

  it('should have correct navigation links', () => {
    cy.contains('Forgot password?').should('have.attr', 'href', '/forgot-password');
    cy.contains('Sign Up').should('have.attr', 'href', '/signup');
  });

  it('should handle form interactions and validation', () => {
    cy.get('input[placeholder="Username, phone number, or email"]').type('test@test.com').clear().type('test@test.com');
    cy.get('input[placeholder="Password"]').type('pass123').clear().type('pass123');
    
    // Clear password - button should become disabled
    cy.get('input[placeholder="Password"]').clear();
    cy.get('button[type="submit"]').should('be.disabled');
    
    // Add password back - button should be enabled
    cy.get('input[placeholder="Password"]').type('validpassword123');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait(100);
  });

  it('should test successful login mutation', () => {
    cy.interceptGraphql({
      operationName: 'LoginUser',
      state: 'success',
      data: {
        data: {
          loginUser: {
            user: {
              _id: '123',
              fullName: 'Test User',
              userName: 'testuser',
              email: 'test@example.com',
              profileImage: null
            },
            token: 'fake-jwt-token'
          }
        }
      }
    });

    cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@LoginUser');
    cy.wait(100);
  });

  it('should test login error handling', () => {
    cy.interceptGraphql({
      operationName: 'LoginUser', 
      state: 'error',
      data: {
        errors: [{
          message: 'Invalid credentials',
          extensions: { code: 'INVALID_CREDENTIALS' }
        }]
      }
    });

    cy.get('input[placeholder="Username, phone number, or email"]').type('wrong@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@LoginUser');
    cy.wait(100);
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

  it('should display success message from URL parameters', () => {
    // Visit login page with success message parameter
    cy.visit('/login?message=Password reset successfully! Please sign in with your new password.');
    
    // Should display the success message
    cy.contains('Password reset successfully! Please sign in with your new password.').should('be.visible');
    
    // Test clearing success message when typing
    cy.get('input[placeholder="Username, phone number, or email"]').type('test');
    cy.contains('Password reset successfully! Please sign in with your new password.').should('not.exist');
  });

  it('should handle email not verified error', () => {
    cy.interceptGraphql({
      operationName: 'LoginUser', 
      state: 'error',
      data: {
        errors: [{
          message: 'Email not verified',
          extensions: { 
            code: 'EMAIL_NOT_VERIFIED',
            email: 'test@example.com'
          }
        }]
      }
    });

    cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@LoginUser');
    cy.contains('Your email address needs to be verified to continue.').should('be.visible');
    cy.contains('Verify your email now').should('have.attr', 'href', '/verify-otp?email=test%40example.com');
  });
});
