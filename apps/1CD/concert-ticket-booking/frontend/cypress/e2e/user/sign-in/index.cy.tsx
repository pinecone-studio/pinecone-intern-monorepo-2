describe('Sign-In Page', () => {
  beforeEach(() => {
    cy.visit('/user/sign-in');
  });

  it('should display the mobile dropdown menu and buttons', () => {
    cy.visit('/user/home');
    cy.viewport(375, 800);
    cy.get('[data-testid="dropdown-trigger"]').should('be.visible');
    cy.get('[data-testid="dropdown-trigger"]').click();
    cy.get('[data-testid="EventsCl"]').should('be.visible');
    cy.get('[data-testid="SignInCl"]').should('be.visible');
    cy.get('[data-testid="SignUpCl"]').should('be.visible').click();
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
  it('4.should show a success message and call the handleSignIn function on valid form submission check in mobile view', () => {
    cy.get('input[name="email"]').type('bat1@gmail.com');
    cy.get('input[name="password"]').type('P@ss1234');
    cy.get('[data-cy="Sign-In-Submit-Button"]').should('be.visible').click();
    cy.get('.toast').should('contain', 'Successfully login');
    cy.url().should('include', '/user/home');
    cy.get('[data-testid="Search-Input"]').should('be.visible');
    cy.get('[data-testid="Search-Input"]').type('search query');
    cy.get('[data-testid="Search-Input"]').should('have.value', 'search query');
    cy.viewport(375, 800);
    cy.get('[data-testid="dropdown-trigger"]').should('be.visible');

    cy.get('[data-testid="dropdown-trigger"]').click();
    cy.get('[data-testid="user-close-button"]').should('be.visible');
    cy.get('[data-testid="ClEvents"]').should('be.visible');
    cy.get('[data-testid="SignOutCl"]').should('be.visible');
  });

  it('6.should navigate to the sign-up page when "Бүртгүүлэх" button is clicked', () => {
    cy.get('[data-cy="Sign-Up-Link-Button"]').click();
    cy.url().should('include', '/sign');
  });
});
