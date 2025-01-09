describe('should sign in', () => {
  beforeEach(() => {
    cy.visit('signIn');
  });

  it('1.should successfully signed in ', () => {
    cy.contains('tinder').should('be.visible');
    cy.contains('Sign in').should('be.visible');
    cy.contains('Enter your email below to sign in').should('be.visible');
    cy.contains('Create an account').should('be.visible');
    cy.contains('Terms of Service').should('be.visible');
    cy.get('[data-cy="signIn-email-input"]').should('be.visible').and('have.attr', 'placeholder', 'name@example.com').type('cypress@gmail.com');
    cy.get('[data-cy="signIn-password-input"]').should('be.visible').and('have.attr', 'placeholder', 'Tinder12345@').type('Tinder1213@');
    cy.contains('Continue').should('be.visible').click();
    cy.url().should('include', '/recs');
  });
  it('2.should show error if email is empty', () => {
    cy.get('[data-cy="signIn-password-input"]').type('tindeR1213@');
    cy.contains('Continue').click();
    cy.contains('Email is required.').should('exist');
  });
  it('3.should show error if password is empty', () => {
    cy.get('[data-cy="signIn-email-input"]').type('tinder@gmail.com');
    cy.contains('Continue').click();
    cy.contains('Password is required.').should('exist');
  });

  // it('4.should show toast when password is incorrect',()=>{
  //   cy.get('[data-cy="signIn-email-input"]').type('existinguser@example.com');
  //   cy.get('[data-cy="signIn-password-input"]').type('tinder129999');
  //   cy.contains('Continue').click();
  //   cy.contains('Your password is incorrect. Don’t worry—try again.').should('exist');
  // });
  it('5.should show toast when user is not registered',()=>{
    cy.get('[data-cy="signIn-email-input"]').type('tsatssaa@gmail.com');
    cy.get('[data-cy="signIn-password-input"]').type('tinder12');
    cy.contains('Continue').click();
    cy.contains('Looks like you’re not signed up yet. No worries—sign up now and join the fun!').should('exist');
  });
  it('6.should direct to the forget password page',()=>{
    cy.contains('Forget password?').should('be.visible').click();
    cy.url().should('include','/forgetPassword/email')
  })
});
