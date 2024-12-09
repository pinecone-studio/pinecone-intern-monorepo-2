describe('Header', () => {
  beforeEach(() => {
    cy.visit('/home');
  });
  it('should navigate to home page when logo is clicked', () => {
    cy.get('img[alt="HeaderLogo"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/home');
  });

  it('should show search input and allow text entry', () => {
    cy.get('input[placeholder="Хайлт"]').should('be.visible');
    cy.get('input[placeholder="Хайлт"]').type('Киоск');
    cy.get('input[placeholder="Хайлт"]').should('have.value', 'Киоск');
  });

  it('should navigate to the cart page when basket icon is clicked', () => {
    cy.get('a[href="/order"]').click();
    cy.url().should('include', '/order');
  });

  context('When user is not logged in', () => {
    it('should show sign up and sign in button when user not logged in', () => {
      cy.get('[data-cy="SignUpBtn"]').should('be.visible');
      cy.get('[data-cy="SignInBtn"]').should('be.visible');
    });
  });
  context('When user is logged in', () => {
    it('should show sign out button when user logged in', () => {
      cy.get('[data-cy="SignInBtn"]').click();
      cy.get('[data-cy="input-email"]').type('haru@gmail.com');
      cy.get('[data-cy="input-password"]').type('har1234@');
      cy.get('[data-cy="Sign-In-Submit-Button"]').click();
      cy.get('[data-cy="SignOutBtn"]').should('be.visible');
      cy.get('[data-cy="SignOutBtn"]').click();
    });
  });
});

describe('Sign-In Page', () => {
  beforeEach(() => {
    cy.visit('/sign-in');
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
