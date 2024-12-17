describe('Set-Password Page', () => {
  beforeEach(() => {
    cy.visit('/signup/password');
  });

  it('1. Should render set password page', () => {
    cy.get('[data-cy="Set-Password-Page"]').should('be.visible');
  });

  it('2. When user enters less than 8 characters on password input, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Password-Input]').type('122');
    cy.get('[data-cy=Sign-Up-Submit-Button]').click({ multiple: true });
    cy.get('[data-cy=Sign-Up-Password-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Password-Input-Error-Message]').should('have.text', 'Password must be at least 8 characters long.');
  });

  it('3. When user does not enter password, it should display error message', () => {
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input]').type('1234567');
    cy.get('[data-cy=Sign-Up-Submit-Button]').click({ multiple: true });
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input-Error-Message]').should('have.text', 'Confirm password must be at least 8 characters long.');
  });

  it('4. Password and Confirm password must match', () => {
    cy.get('[data-cy=Sign-Up-Password-Input]').type('12345678');
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input]').type('12345679');
    cy.get('[data-cy=Sign-Up-Submit-Button]').click({ multiple: true });
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input-Error-Message]').should('have.text', 'Passwords do not match');
  });
  it('5. When user enters all values, it should render login', () => {
    const email = 'test@gmail.com';

    cy.intercept('POST', 'api/graphql', (req) => {
      req.reply({
        body: {
          data: {
            email: email,
            password: '12345678',
            message: 'Profile created successfully',
          },
        },
      });
    }).as('SetPassword');

    cy.get('[data-cy=Sign-Up-Password-Input]').type('12345678');
    cy.get('[data-cy=Sign-Up-Confirm-Password-Input]').type('12345678');

    cy.get('[type="submit"]').click();

    cy.wait('@SetPassword');

    cy.visit('/login');

    cy.url().should('include', '/login');
  });
});
