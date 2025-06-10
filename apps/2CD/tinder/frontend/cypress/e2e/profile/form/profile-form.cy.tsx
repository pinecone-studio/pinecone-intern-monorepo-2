describe('Profile Form', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('renders the form with all fields', () => {
    cy.contains('Personal Information').should('exist');
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('textarea[name="bio"]').should('exist');
    cy.get('input[name="profession"]').should('exist');
    cy.get('input[name="school"]').should('exist');
    cy.get('select[name="gender"]').should('exist');
  });

  it('shows validation errors when fields are empty and form is submitted', () => {
    cy.contains('Submit').click();

    cy.contains('name is a required field', { matchCase: false }).should('exist');
    cy.contains('email is a required field', { matchCase: false }).should('exist');
  });

  it('submits the form when valid', () => {
    cy.get('input[name="name"]').type('Shagai');
    cy.get('input[name="email"]').type('shagai@example.com');
    cy.get('textarea[name="bio"]').type('I love nature and coding.');
    cy.get('input[name="profession"]').type('Developer');
    cy.get('input[name="school"]').type('Mongolian University');

    cy.contains('Submit').click();

    cy.url().should('include', '/profile'); 
  });
});
