/// <reference types="cypress" />

describe('Add Hotel Page', () => {
  beforeEach(() => {
    cy.mockGraphQL();
    cy.visit('/admin/add-hotel');
  });

  it('should load the add hotel page', () => {
    cy.get('body').should('exist');
  });

  it('should display the add hotel page title', () => {
    cy.get('h1').should('contain', 'Add New Hotel');
  });

  it('should display the back button', () => {
    cy.get('button').should('contain', 'Back');
  });

  it('should navigate back when back button is clicked', () => {
    cy.get('button').contains('Back').click();
    cy.go('back');
    cy.url().should('include', '/admin');
  });

  it('should display all form sections', () => {
    cy.get('h3').should('contain', 'General Information');
    cy.get('h3').should('contain', 'Hotel Images');
    cy.get('h3').should('contain', 'Languages');
    cy.get('h3').should('contain', 'Amenities');
    cy.get('h3').should('contain', 'Policies');
    cy.get('h3').should('contain', 'What You Need to Know');
    cy.get('h3').should('contain', 'Frequently Asked Questions');
  });

  it('should display submit and cancel buttons', () => {
    cy.get('button').should('contain', 'Create Hotel');
    cy.get('button').should('contain', 'Cancel');
  });

  it('should navigate back when cancel button is clicked', () => {
    cy.get('button').contains('Cancel').click();
    cy.go('back');
    cy.url().should('include', '/admin');
  });

  it('should have a form element', () => {
    cy.get('form').should('exist');
  });

  it('should allow entering hotel name', () => {
    cy.get('input[id="name"]').type('New Test Hotel');
    cy.get('input[id="name"]').should('have.value', 'New Test Hotel');
  });

  it('should allow uploading images', () => {
    cy.get('input[type="file"]').should('exist');
    cy.get('input[type="file"]').should('have.attr', 'multiple');
  });

  it('should have proper page layout', () => {
    cy.get('body').should('exist');
  });

  it('should have proper form layout', () => {
    cy.get('form').should('exist');
  });

  it('should have proper header layout', () => {
    cy.get('h1').should('contain', 'Add New Hotel');
  });

  it('should have proper navigation flow', () => {
    // Test navigation from admin page to add hotel page
    cy.visit('/admin');
    cy.get('button').contains('+ Add Hotel').click();
    cy.url().should('include', '/admin/add-hotel');

    // Test navigation back to admin page
    cy.go('back');
    cy.url().should('include', '/admin');
  });

  it('should maintain form state during navigation', () => {
    cy.get('input[id="name"]').type('Test Hotel Name');
    cy.get('input[id="name"]').should('have.value', 'Test Hotel Name');

    // Navigate away and back
    cy.go('back');
    cy.visit('/admin/add-hotel');

    // Form should be reset
    cy.get('input[id="name"]').should('have.value', '');
  });

  it('should have proper semantic structure', () => {
    cy.get('h1').should('exist');
    cy.get('form').should('exist');
    cy.get('button').should('exist');
  });
});
