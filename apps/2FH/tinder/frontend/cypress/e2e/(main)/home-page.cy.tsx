describe('Landing Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');});
  describe('Page Structure and Content', () => {
    it('should display main heading', () => {
      cy.get('h1').should('contain.text', 'Swipe Right®');});
    it('should display background image', () => {
      cy.get('img[alt="Background"]')
        .should('exist').and('have.attr', 'src').and('include', 'Frame1321316627.png');});
    it('should display header logo', () => {
      cy.get('header img[alt="Tinder Logo"]')
        .should('exist').and('have.attr', 'src').and('include', 'TinderLogo-20172.png');});
    it('should display footer logo', () => {
      cy.get('footer img[alt="Tinder Logo"]')
        .should('exist').and('have.attr', 'src').and('include', 'Group.png'); });
    it('should display copyright text', () => {
      cy.get('footer').should('contain.text', '© Copyright 2024');});
  });

  describe('Button Navigation', () => {
    it('should navigate to signup when main Create Account button is clicked', () => {
      cy.get('main button').contains('Create Account').click();
      cy.url().should('include', '/signup');
    });

    it('should navigate to signup when header Create Account button is clicked', () => {
      cy.get('header button').contains('Create Account').click();
      cy.url().should('include', '/signup');
    });

    // Fix: Use correct signin route
    it('should navigate to signin when Log in button is clicked', () => {
      cy.get('header button').contains('Log in').click();
      cy.url().should('include', '/signin');
    });

    it('should handle multiple navigation clicks', () => {
      cy.get('main button').contains('Create Account').click();
      cy.url().should('include', '/signup');
      cy.go('back');
      cy.get('header button').contains('Log in').click();
      cy.url().should('include', '/signin');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('h1').should('be.visible');
      cy.get('header').should('be.visible');
      cy.get('main button').should('be.visible');
    });

    it('should display correctly on tablet', () => {
      cy.viewport(768, 1024);
      cy.get('h1').should('be.visible');
      cy.get('header').should('be.visible');
      cy.get('main button').should('be.visible');
    });

    it('should display correctly on mobile', () => {
      cy.viewport(375, 667);
      cy.get('h1').should('be.visible');
      cy.get('header').should('be.visible');
      cy.get('main button').should('be.visible');
    });
  });

  describe('Visual Elements', () => {
    it('should have all gradient overlays applied', () => {
      cy.get('.bg-gradient-to-br').should('exist');
      cy.get('.bg-gradient-to-bl').should('exist');
      cy.get('.bg-gradient-to-tr').should('exist');
      cy.get('.bg-gradient-to-tl').should('exist');
    });

    it('should have proper z-index stacking', () => {
      cy.get('header').should('have.class', 'z-30');
      cy.get('main').should('have.class', 'z-20');
      cy.get('footer').should('have.class', 'z-10');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button types', () => {
      cy.get('button').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'type', 'button');
      });
    });

    it('should have alt text for images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });
  });
});
describe('Login Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/signin'); // Changed from /login to /signin
  });

  describe('Login Form Structure', () => {
    it('should display login form elements', () => {
      cy.get('form').should('exist');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain.text', 'Continue');
    });
    it('should display logo and heading', () => {
      cy.get('img[alt="Tinder Logo"]').should('exist');
      cy.get('h2').should('contain.text', 'Sign in');
    });
    it('should have create account button', () => {
      cy.get('button[type="button"]').should('contain.text', 'Create an account');
    });
  });
  describe('Form Validation', () => {
    it('should show error for empty email', () => {
      cy.get('button[type="submit"]').click();
      cy.get('form').should('contain.text', 'Email is required');
    });
    it('should show error for empty password', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
      cy.get('form').should('contain.text', 'Password is required');
    });

    it('should accept valid email format', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="email"]').should('have.value', 'test@example.com');
    });
  });
  describe('Form Interactions', () => {
    it('should handle form submission', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should('contain.text', 'Continue');
    });
    it('should handle forgot password link', () => {
      cy.get('a').contains('Forgot password?').should('exist');
    });

    it('should handle create account button', () => {
      cy.get('button[type="button"]').contains('Create an account').click();
    });
  });
  describe('Login Page Styling', () => {
    it('should have proper form styling', () => {
      cy.get('form').should('have.class', 'bg-white');
      cy.get('input[type="email"]').should('have.class', 'border-gray-300');
      cy.get('button[type="submit"]').should('have.class', 'bg-tinder-pink');
    });
  });
});