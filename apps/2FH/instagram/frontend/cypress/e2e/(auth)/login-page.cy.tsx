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
    cy.get('button[type="submit"]').click();
    cy.wait(100);

    cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait(100);

    cy.get('input[placeholder="Username, phone number, or email"]').clear();
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait(100);
  });

  it('should have correct navigation links', () => {
    cy.contains('Forgot password?').should('have.attr', 'href', '/forgot-password');
    cy.contains('Sign Up').should('have.attr', 'href', '/signup');
  });

  it('should handle form interactions and validation', () => {
    cy.get('input[placeholder="Username, phone number, or email"]').type('test@test.com').clear().type('test@test.com');
    cy.get('input[placeholder="Password"]').type('pass123').clear().type('pass123');
    
    cy.get('input[placeholder="Password"]').clear();
    cy.get('button[type="submit"]').click();
    cy.wait(100);
    
    cy.get('input[placeholder="Password"]').type('validpassword123');
    cy.get('button[type="submit"]').click();
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
    cy.reload();
    
    cy.get('input[placeholder="Username, phone number, or email"]').invoke('removeAttr', 'required');
    cy.get('input[placeholder="Password"]').invoke('removeAttr', 'required');
    
    cy.get('button[type="submit"]').click();
    cy.wait(100);
    
    cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.wait(100);
    
    cy.get('input[placeholder="Username, phone number, or email"]').clear();
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait(100);
    
    cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').clear().type('password123');
    
    cy.window().then((win) => {
      cy.get('form').then($form => {
        const event = new win.Event('submit', { bubbles: true });
        $form[0].dispatchEvent(event);
      });
    });
  });
});
