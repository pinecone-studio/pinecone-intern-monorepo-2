describe('Signup Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should render elements and handle input changes', () => {
    cy.get('img[alt="Instagram"]').should('be.visible');
    cy.contains('Sign up to see photos and videos from your friends').should('be.visible');
    cy.get('input[placeholder="Email Address"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('input[placeholder="Full Name"]').should('be.visible');
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.contains('Sign up').should('be.visible');
    cy.contains('Log in').should('be.visible');
    cy.contains('Terms').should('be.visible');
    cy.contains('Privacy Policy').should('be.visible');
    cy.contains('Cookies Policy').should('be.visible');

    cy.get('input[placeholder="Email Address"]').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('input[placeholder="Password"]').type('password123').should('have.value', 'password123');
    cy.get('input[placeholder="Full Name"]').type('Test User').should('have.value', 'Test User');
    cy.get('input[placeholder="Username"]').type('testuser').should('have.value', 'testuser');
  });

  it('should test form validation, interactions, and navigation links', () => {
    cy.get('button[type="submit"]').click();
    cy.wait(100);
    
    cy.get('input[placeholder="Email Address"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('123');
    cy.get('input[placeholder="Full Name"]').type('Test User');
    cy.get('input[placeholder="Username"]').type('testuser');
    cy.get('select[aria-hidden="true"]').first().select('OTHER', { force: true });
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 6 characters long').should('be.visible');
    
    cy.get('input[placeholder="Password"]').clear().type('validpassword123');
    cy.contains('Sign up').click();

    cy.contains('Log in').should('have.attr', 'href', '/login');
    cy.contains('Terms').should('have.attr', 'href', '/terms');
    cy.contains('Privacy Policy').should('have.attr', 'href', '/privacy');
    cy.contains('Cookies Policy').should('have.attr', 'href', '/cookies');
    cy.contains('Learn More').should('have.attr', 'href', '/help/learn-more');
  });

  it('should test signup mutations and error handling', () => {
    cy.visit('/signup');
    
    cy.interceptGraphql({
      operationName: 'CreateUser',
      state: 'success',
      data: {
        data: {
          createUser: {
            _id: '123',
            fullName: 'Test User',
            userName: 'testuser',
            email: 'test@example.com',
            gender: 'OTHER',
            createdAt: '2024-01-01'
          }
        }
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

    cy.interceptGraphql({
      operationName: 'CreateUser',
      state: 'error', 
      data: {
        errors: [{
          message: 'A user with that username already exists.',
          extensions: { code: 'USERNAME_EXISTS' }
        }]
      }
    });

    cy.visit('/signup');
    cy.get('input[placeholder="Email Address"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Full Name"]').type('Test User');
    cy.get('input[placeholder="Username"]').type('existinguser');
    cy.get('select[aria-hidden="true"]').first().select('OTHER', { force: true });
    cy.get('button[type="submit"]').click();
    cy.wait('@CreateUser');
    cy.wait(100);
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
});
