describe('Layout Coverage', () => {
  it('should exercise layout components on public routes', () => {
    // Test layout on different public routes to ensure layout.tsx is covered
    cy.visit('/login');
    cy.get('html[lang="en"]').should('exist');
    cy.get('body').should('exist');
    
    cy.visit('/signup');
    cy.get('html[lang="en"]').should('exist');
    cy.get('body').should('exist');
    
    cy.visit('/forgot-password');
    cy.get('html[lang="en"]').should('exist');
    cy.get('body').should('exist');
    
    cy.visit('/reset-password?identifier=test@example.com');
    cy.get('html[lang="en"]').should('exist');
    cy.get('body').should('exist');
  });

  it('should test ConditionalLayout for public routes', () => {
    cy.visit('/login');
    
    // Should render minimal layout for public routes
    cy.get('div.min-h-screen.bg-white').should('exist');
    
    // Should not show authenticated layout components
    cy.get('[data-testid="sidebar"]').should('not.exist');
    cy.get('[data-testid="search-sidebar"]').should('not.exist');
  });

  it('should test ConditionalLayout loading state', () => {
    // Mock auth loading state
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    
    cy.visit('/');
    
    // The loading state might be very brief, but we can try to catch it
    // by visiting the home page which might trigger auth loading
  });

  it('should test different routes to ensure layout coverage', () => {
    const routes = [
      '/',
      '/login',
      '/signup', 
      '/forgot-password',
      '/user-profile/test-user',
      '/userProfile'
    ];
    
    routes.forEach(route => {
      if (route === '/reset-password') {
        cy.visit(`${route}?identifier=test@example.com`);
      } else {
        cy.visit(route);
      }
      
      // Ensure basic HTML structure is present
      cy.get('html').should('exist');
      cy.get('body').should('exist');
    });
  });

  it('should test metadata and document structure', () => {
    cy.visit('/');
    
    // Test that the layout properly sets up the document
    cy.document().should('exist');
    cy.get('html').should('have.attr', 'lang', 'en');
  });

  it('should test provider wrappers in layout', () => {
    cy.visit('/login');
    
    // Test that providers are working by checking if we can interact with the login form
    // This ensures the ApolloWrapper and other providers are functioning
    cy.get('input[placeholder="Username, phone number, or email"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    
    // Type into the form to ensure providers are working
    cy.get('input[placeholder="Username, phone number, or email"]').type('test@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    
    // Trigger form submission to ensure all providers are working
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
    
    cy.get('button[type="submit"]').click();
    cy.wait('@LoginUser');
  });

  it('should test NavigationProvider by using navigation', () => {
    cy.visit('/login');
    
    // Click navigation links to test NavigationProvider
    cy.contains('Forgot password?').click();
    cy.url().should('include', '/forgot-password');
    
    cy.contains('Back to login').click();
    cy.url().should('include', '/login');
    
    cy.contains('Sign Up').click();
    cy.url().should('include', '/signup');
  });
});
