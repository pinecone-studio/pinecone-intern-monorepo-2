describe('Homepage E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });
 
  describe('Page Load and Structure', () => {
    it('should load the homepage successfully', () => {
      cy.get('body').should('be.visible');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
 
    it('should have proper page structure', () => {
      cy.get('div').should('have.class', 'flex').and('have.class', 'h-screen').and('have.class', 'w-screen').and('have.class', 'relative').and('have.class', 'shadow-2xl');
      cy.get('header').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');
    });
  });
 
  describe('Background Image', () => {
    it('should display the background image correctly', () => {
      cy.get('img')
        .first()
        .should('be.visible')
        .and('have.attr', 'src', '/Frame1321316627.png')
        .and('have.class', 'w-full')
        .and('have.class', 'h-full')
        .and('have.class', 'object-cover');
    });
  });
 
  describe('Header Section', () => {
    it('should display header elements correctly', () => {
      cy.get('header')
        .should('be.visible')
        .and('have.class', 'absolute')
        .and('have.class', 'top-0')
        .and('have.class', 'left-0')
        .and('have.class', 'right-0')
        .and('have.class', 'z-30');
      cy.get('header img').should('be.visible');
    });
 
    it('should have navigation buttons', () => {
      cy.get('header button')
        .contains('Create Account')
        .should('be.visible')
        .and('have.class', 'bg-transparent')
        .and('have.class', 'text-white');
 
      cy.get('header button')
        .contains('Log in')
        .should('be.visible')
        .and('have.class', 'bg-white')
        .and('have.class', 'text-black');
    });
  });
 
  describe('Main Content Section', () => {
    it('should display main heading correctly', () => {
      cy.get('main h1')
        .should('be.visible')
        .and('contain.text', 'Swipe Right®')
        .and('have.class', 'text-4xl')
        .and('have.class', 'md:text-6xl')
        .and('have.class', 'font-bold')
        .and('have.class', 'text-white')
        .and('have.class', 'mb-8')
        .and('have.class', 'drop-shadow-lg');
    });
 
    it('should have main Create Account button', () => {
      cy.get('main button')
        .contains('Create Account')
        .should('be.visible')
        .and('have.class', 'bg-[#E11D48]')
        .and('have.class', 'text-white')
        .and('have.class', 'px-8')
        .and('have.class', 'py-3')
        .and('have.class', 'rounded-full');
    });
  });
 
  describe('Footer Section', () => {
    it('should display footer elements correctly', () => {
      cy.get('footer')
        .should('be.visible')
        .and('have.class', 'absolute')
        .and('have.class', 'bottom-0')
        .and('have.class', 'left-0')
        .and('have.class', 'right-0')
        .and('have.class', 'z-10');
      cy.get('footer img').should('be.visible');
    });
 
    it('should display copyright text', () => {
      cy.get('footer')
        .contains('© Copyright 2024')
        .should('be.visible')
        .and('have.class', 'text-white')
        .and('have.class', 'text-sm');
    });
  });
 
  describe('Navigation Functionality', () => {
    it('should navigate to signup page when Create Account button is clicked in header', () => {
      cy.get('header button')
        .contains('Create Account')
        .click();
      
      cy.url().should('include', '/signup');
      cy.get('body').should('be.visible');
    });
 
    it('should navigate to signin page when Log in button is clicked in header', () => {
      cy.get('header button')
        .contains('Log in')
        .click();
      
      cy.url().should('include', '/signin');
      cy.get('body').should('be.visible');
    });
 
    it('should navigate to signup page when main Create Account button is clicked', () => {
      cy.get('main button')
        .contains('Create Account')
        .click();
      
      cy.url().should('include', '/signup');
      cy.get('body').should('be.visible');
    });
  });
 
  describe('Responsive Design', () => {
    it('should have responsive design working correctly', () => {

      cy.viewport('iphone-x');
      cy.get('main h1').should('have.class', 'text-4xl');

      cy.viewport('macbook-13');
      cy.get('main h1').should('have.class', 'md:text-6xl');
    });
  });
});
 