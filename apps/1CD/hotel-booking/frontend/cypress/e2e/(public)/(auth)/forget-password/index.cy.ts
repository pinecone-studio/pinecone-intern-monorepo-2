describe('Forget-Password Page', () => {
  beforeEach(() => {
    cy.visit('/forget-password');
  });

  it('1. Should render sign-up', () => {
    cy.get('[data-cy=Forget-Password-Page]').should('be.visible');
  });

  it('2. When user enters invalid email, it should display error message', () => {
    cy.get('[data-cy=Forget-Password-Page-Email-Input]').type('1');
    cy.get('[data-cy=Forget-Password-Page-Continue-Button]').click();
    cy.get('[data-cy=Forget-Password-Page-Username-Input-Error-Message]').should('be.visible');
    cy.get('[data-cy=Forget-Password-Page-Username-Input-Error-Message]').should('have.text', 'Email must be at least 2 characters.');
  });

  it('3. When user enters email that does not exists', () => {
    cy.get('[data-cy="Forget-Password-Page-Email-Input"]').type('existinguser@example.com');
    cy.get('[data-cy="Forget-Password-Page-Continue-Button"]').click();

    cy.get('[role="alert"]').should('contain', 'Email does not exists');
  });

  it('4. When user enters valid email, it should navigate to otp page', () => {
    cy.get('[data-cy=Forget-Password-Page-Email-Input]').type('example@gmail.com');
    cy.get('[data-cy=Forget-Password-Page-Continue-Button]').click();

    cy.contains('Success');

    cy.visit('/forget-password/otp');
  });
});
