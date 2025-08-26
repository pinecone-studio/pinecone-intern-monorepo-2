describe('Landing Page E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    describe('Page Structure and Content', () => {
      it('should display main heading', () => {
        cy.get('h1').should('contain.text', 'Swipe Right®');
      });
  
      it('should display background image', () => {
        cy.get('img[alt="Background"]')
          .should('exist')
          .and('have.attr', 'src', '/Frame1321316627.png');
      });
  
      it('should display header logo', () => {
        cy.get('header img[alt="Tinder Logo"]')
          .should('exist')
          .and('have.attr', 'src', '/TinderLogo-20172.png');
      });
  
      it('should display footer logo', () => {
        cy.get('footer img[alt="Tinder Logo"]')
          .should('exist')
          .and('have.attr', 'src', '/Group.png');
      });
  
      it('should display copyright text', () => {
        cy.get('footer').should('contain.text', '© Copyright 2024');
      });
    });
  
    describe('Button Navigation', () => {
      beforeEach(() => {
        cy.window().then((win) => {
          cy.stub(win.history, 'pushState').as('historyPush');
        });
      });
  
      it('should navigate to signup when main Create Account button is clicked', () => {
        cy.get('main button').contains('Create Account').click();
        cy.url().should('include', '/signup');
      });
  
      it('should navigate to signup when header Create Account button is clicked', () => {
        cy.get('header button').contains('Create Account').click();
        cy.url().should('include', '/signup');
      });
  
      it('should navigate to signin when Log in button is clicked', () => {
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
  
    describe('Button Interactions', () => {
      it('should have proper hover states for main CTA button', () => {
        cy.get('main button')
          .should('have.class', 'hover:bg-red-600')
          .and('have.class', 'bg-[#E11D48]');
      });
  
      it('should have proper hover states for header buttons', () => {
        cy.get('header button').contains('Create Account')
          .should('have.class', 'hover:bg-white/10');
        
        cy.get('header button').contains('Log in')
          .should('have.class', 'hover:bg-gray-100');
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