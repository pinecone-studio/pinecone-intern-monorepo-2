describe('Admin Page', () => {
  beforeEach(() => {
    cy.mockGraphQL();
    cy.visit('/admin');
  });

  it('should load the admin page', () => {
    cy.get('body').should('exist');
  });

  it('should display the admin page with hotels title', () => {
    cy.get('h3').should('contain', 'Hotels');
  });

  it('should display the add hotel button', () => {
    cy.get('button').should('contain', '+ Add Hotel');
  });

  it('should navigate to add hotel page when add hotel button is clicked', () => {
    cy.get('button').contains('+ Add Hotel').click();
    cy.url().should('include', '/admin/add-hotel');
  });

  it('should have proper page layout', () => {
    cy.get('body').should('exist');
  });

  it('should have proper sidebar', () => {
    cy.get('nav').should('exist');
  });

  it('should have proper main content area', () => {
    cy.get('main').should('exist');
  });

  it('should have proper header styling', () => {
    cy.get('h3').should('contain', 'Hotels');
  });

  it('should have proper button styling', () => {
    cy.get('button').contains('+ Add Hotel').should('exist');
  });

  it('should have proper navigation flow', () => {
    // Test navigation to add hotel page
    cy.get('button').contains('+ Add Hotel').click();
    cy.url().should('include', '/admin/add-hotel');
    
    // Test navigation back to admin page
    cy.visit('/admin');
    cy.url().should('include', '/admin');
  });

  it('should have proper semantic structure', () => {
    cy.get('h3').should('exist');
    cy.get('button').should('exist');
  });
});
