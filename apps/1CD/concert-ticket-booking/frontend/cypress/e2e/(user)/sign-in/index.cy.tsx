describe('Sign-In Page', () => {
  beforeEach(() => {
    cy.visit('/user/sign-in');
  });

  it('1. should render sign-in page', () => {
    cy.get('h1').contains('Нэвтрэх');
    cy.get('[data-cy="Sign-In-Page"]').should('be.visible');
  });

  it('2. should show validation errors for invalid inputs', () => {
    cy.get('[data-cy="Sign-In-Submit-Button"]').click();
    cy.get('.text-red-500').should('contain', 'Email must be at least 2 characters.');
    cy.get('.text-red-500').should('contain', 'Be at least 8 characters long');
  });

  it('3. should show a success message and call the handleSignIn function on valid form submission', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('[data-cy="Sign-In-Submit-Button"]').should('be.visible').click();
    cy.url().should('include', '/');
  });

  it('4.should navigate to the sign-up page when "Бүртгүүлэх" button is clicked', () => {
    cy.get('[data-cy="Sign-Up-Link-Button"]').click();
    cy.url().should('include', '/sign');
  });
});
