describe('Sign-Up Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('1. Should render sign-up', () => {
    cy.get('[data-cy=Sign-Up-Page]').should('be.visible');
  });

  it('2. When user enters invalid email, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Email-Input]').type('1');
    cy.get('[data-cy=Sign-Up-Continue-Button]').click();
    cy.get('[data-cy=Sign-Up-Username-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Username-Input-Error-Message]').should('have.text', 'Email must be at least 2 characters.');
  });

  it('3. handles server error when user already exists', () => {
    cy.intercept('POST', '/api/graphql', {
      statusCode: 200,
      body: {
        errors: [
          {
            message: 'user exists',
          },
        ],
      },
    }).as('sendOtpError');

    cy.get('[data-cy="Sign-Up-Email-Input"]').type('existinguser@example.com');
    cy.get('[data-cy="Sign-Up-Continue-Button"]').click();

    cy.wait('@sendOtpError');

    cy.get('[role="alert"]').should('contain', 'user exists');
  });

  it('4. When user enters valid email, it should navigate to otp page', () => {
    cy.get('[data-cy=Sign-Up-Email-Input]').type('test@gmail.com');
    cy.get('[data-cy=Sign-Up-Continue-Button]').click();
    cy.intercept('POST', '/api/graphql', {
      body: {
        message: 'OTP sent successfully',
      },
    }).as('sendOtp');
    cy.visit('/signup/otp');
    cy.url().should('include', 'otp');
  });

  it('5. When user clicks on login button, it should render login page', () => {
    cy.get('[data-cy=Sign-Up-Log-In-Button]').click();
    cy.visit('/login');
  });
});
